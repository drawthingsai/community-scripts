//@api-1.0

/*
   Script for DrawThings with similar functionality as ADetailer. 
   Automatically detects faces after a generation, zooms in, adds mask, generates again, and saves the file.
   
   Detailer keeps generating images and detailing the faces on them. 
   If you would like to just run the Detailer on existing image use SingleDetailer instead.
   
   Works with Loras and Hi-Res Fix no problem.

   Note: Limited testing so maybe has bugs.
         Only tested on SDXL resolutions.

   Author: @clarkCheeckyKent on DrawThings discord.
   Script Thread: https://discord.com/channels/1038516303666876436/1212228571586629712/1212228571586629712
   Version Date: Jul 12, 2024
*/

// Number of generations to make.
// Note: if EXISTING_IMAGES_DIRECTORY is used this is not honored.
const NUMBER_OF_EXECUTIONS = 100;

// Directory to grab images from to execute Detailer on instead of generating new ones.
// This must be under the Pictures folder.
const EXISTING_IMAGES_DIRECTORY = null // Exampe usage: "DrawThings/preDetailer"

// The prompt to give to the detailer. 
// Leave null if you just want to take the prompt from the UI
const DETAILER_PROMPT = null; // or something like "Portrait of ohwx woman."

// Instead of replacing prompt to detail with, this appends to the UI Prompt
const DETAILER_PROMPT_SUFFIX = null; //"Photo"; // or something like "Portrait of ohwx woman."

const DETAILER_STRENGTH = 0.4;
const DETAILER_STEPS = null;
const DETAILER_TEXT_GUIDANCE = null;

// Resolution to use when detailing. Must be multiple of 64.
const DETAILER_WIDTH = 1024;
const DETAILER_HEIGHT = 1024;

// Number of largest detected faces to process. 
// If you want all faces set it to something large like 99.
const TOP_K_FACES = 99;

// Override mask blur, this allows you to go beyond 27 which is the max value in the UI
const MASK_BLUR = 50;

// How much of the canvas real estate the face should take up
const CANVAS_FACE_FACTOR = 0.7;

// Seed to perform Detailer with.
// Useful if you want to test different detailer settings against same images.
const DETAILER_SEED = null;

// Array of Loras to use with Detailer.
const LORAS = null; /* [
                  //{"file":"nmwx_sdxl14_realvis4_000006_lora_f16.ckpt","weight": 1.0},
                  //{"file":"ohwx_sdxl12_realvis4_lora_f16.ckpt","weight": 1.0},
               ];*/

const CONTROLS = null; /*[
                  //{"file":"ohwx_sdxl12_realvis4_lora_f16.ckpt","weight": 1.0},
                  //{"file":"fooocus_inpaint_v2.6_lora_f16.ckpt","weight": 0.5}
               ];*/

// Save the preDetailer and Detailer files.
const SAVE_FILES = false;

// Subdirectory within the Pictures Folder to save images in.
// Note it must already exist.
const SUBDIRECTORY = "DrawThings/Scripts/Detailer";

/*****************************************************************************************
                                 END OF CONFIGURATIONS
*****************************************************************************************/


// code start
let runTimeStartString = getCurrentTimeString();

const configuration = pipeline.configuration;

// Save base image prompt so we can reset it back after detailer prompt.
const originalPrompt = pipeline.prompts.prompt;

// set how many images to generate
if(EXISTING_IMAGES_DIRECTORY != null) {
   console.log(`Existing images directory provided. Reading files from:`)
   console.log(EXISTING_IMAGES_DIRECTORY)
   preDetailerPaths = filesystem.pictures.readEntries(EXISTING_IMAGES_DIRECTORY).filter(file => !file.endsWith(".DS_Store"));
   times = preDetailerPaths.length;
   console.log(`Found (${times}) files in directory to perform detailer on.`)
} else {
   times = NUMBER_OF_EXECUTIONS;
}


console.log(`-----------------------------------------------------------------`)
console.log(`         Starting Detailer execution for (${times}) images.`)
console.log(`-----------------------------------------------------------------`)

let fullExecutionStartTime = new Date().getTime();

canvas.clear();

// Set Detailer Configs
let detailerConfiguration = getDetailerConfig();

// code start
let filePrefix = getCurrentTimeString();

filePrefix += `_(${detailerConfiguration.steps})step_(${detailerConfiguration.strength*100})strength_(${detailerPromptActual.slice(0, 100)})prompt_`

let directoryPath = `${filesystem.pictures.path}/${SUBDIRECTORY}/${filePrefix}`;

for (let iter = 0; iter < times; iter++ ) {
   console.log(`-----------------------------------------------------------------`)
   console.log(`              Executing for image (${iter + 1}) of (${times}).`)
   console.log(`-----------------------------------------------------------------`)

   let detailerFileSuffix = null;

   if (EXISTING_IMAGES_DIRECTORY) {
      // Load file
      console.log(`Loading file ${preDetailerPaths[iter]}`);
      canvas.loadImage(preDetailerPaths[iter]);
      detailerFileSuffix = iter;
   } else {
      imageSeed = Math.floor(Math.random() * 99999999);

      let imageConfiguration = {
         ...configuration, 
         strength: 1,
         seed: imageSeed
      };

      // Generate new Image
      console.log(`Generating (${configuration.steps}) steps at resolution (${configuration.width})x(${configuration.height}) started with seed (${imageSeed}).`);
      let startTime = new Date().getTime();
      pipeline.run({
           configuration: imageConfiguration,
           prompt: originalPrompt
      });
      let endTime = new Date().getTime();
      let secondsElapsed = Math.round((endTime - startTime) / 1000);
      console.log(`Generating (${configuration.steps}) steps at resolution (${configuration.width})x(${configuration.height}) finished in (${secondsElapsed}) seconds.`);
        
      if(SAVE_FILES) {
            // Save PreDetailer File
            let saveLocation = `${directoryPath}_${pipeline.configuration.seed}_preDetailer.png`
            console.log(`Saving generation to ${saveLocation}`); // save the image currently on canvas to a file.
            canvas.saveImage(saveLocation, true); // save the image currently on canvas to a file.
      }

      detailerFileSuffix = pipeline.configuration.seed;
   }

   if(DETAILER_SEED != null) {
      detailerFileSuffix += ("_" + DETAILER_SEED);
   }

   canvas.updateCanvasSize(detailerConfiguration);

   let faces = [];
   try {
      // Find Faces
      faces = canvas.detectFaces();
   } catch (error) {
      // Handle any errors that occur during the detection process
      console.error("An error occurred during face detection:", error);
   }    

   if (faces.length < 1) {
      console.log(`Faces not detected. If you think theres faces perhaps they are too small or disfigured and detectFace API was not able to find them.`);
   } else {
      console.log(`Detected ${faces.length} faces. Processing up to ${TOP_K_FACES}.`)
      // Sort by size of face, prevents it from detailing random background face.
      faces.sort((a, b) => (b.size.width * b.size.height) - (a.size.width * a.size.height));
   }
   for (let iFace = 0; iFace < faces.length && iFace < TOP_K_FACES; iFace++) {
      canvas.updateCanvasSize(detailerConfiguration)
      
      let face = faces[iFace];   
      console.log(`Processing face number ${iFace + 1} out of ${Math.min(faces.length, TOP_K_FACES)}`) 


      // Determine how far to zoom.
      setZoomFactor(Math.round(face.size.width), Math.round(face.size.height), detailerConfiguration.width, detailerConfiguration.height);

      __dtSleep(0.1);
      let actualFaceFactorX = face.size.width * canvas.canvasZoom / detailerConfiguration.width;
      let actualFaceFactorY = face.size.height * canvas.canvasZoom / detailerConfiguration.height
      console.log(`Actual Face Factors: x=${actualFaceFactorX} y=${actualFaceFactorY}`)

      // Calculate where to move canvas relative to face so that face is centered.
      let faceCenteredLocationX = face.origin.x - detailerConfiguration.width / ((2/(1-actualFaceFactorX)) * canvas.canvasZoom);
      let faceCenteredLocationY = face.origin.y - detailerConfiguration.height / ((2/(1-actualFaceFactorY)) * canvas.canvasZoom);

      // Make sure that the canvas is not moving outside the bounds of the image.
      let actualMoveLocationX = Math.max(Math.min(faceCenteredLocationX, canvas.boundingBox.width - detailerConfiguration.width / canvas.canvasZoom),0)
      let actualMoveLocationY = Math.max(Math.min(faceCenteredLocationY, canvas.boundingBox.height - detailerConfiguration.height / canvas.canvasZoom),0)

      canvas.moveCanvas(Math.round(actualMoveLocationX), Math.round(actualMoveLocationY));

      // Generate the mask
      const generateRegion = createGenerateRegion();

      console.log(`Detailing (${detailerConfiguration.steps}) steps at resolution (${detailerConfiguration.width})x(${detailerConfiguration.height}) started.`);
      startTime = new Date().getTime();

      pipeline.run({
                     configuration: detailerConfiguration,
                     mask: generateRegion,
                     prompt: detailerPromptActual
                  });

      endTime = new Date().getTime();
      secondsElapsed = Math.round((endTime - startTime) / 1000);
      console.log(`Detailing (${detailerConfiguration.steps}) steps at resolution (${detailerConfiguration.width})x(${detailerConfiguration.height}) finished in (${secondsElapsed}) seconds.`);

      // Reset canvas for next generation.
      canvas.updateCanvasSize(configuration);
      canvas.canvasZoom = 1;
      canvas.moveCanvas(0, 0)
   }
   if(SAVE_FILES) {
      // Save image post detailer.
      saveLocation = `${directoryPath}_${detailerFileSuffix}.png`
      console.log(`Saving generation to ${saveLocation}`); // save the image currently on canvas to a file.
      canvas.saveImage(saveLocation, true); // save the image currently on canvas to a file.
   }
}
let fullExecutionEndTime = new Date().getTime();
let fullExecutionSecondsElapsed = Math.round((fullExecutionEndTime - fullExecutionStartTime) / 1000);
console.log(`---------------------------------------------------------------------------------------`)
console.log(`     Finished execution for (${times}) images in (${fullExecutionSecondsElapsed}) seconds.`)


function getCurrentTimeString() {
   const now = new Date();
   const month = (now.getMonth() + 1).toString().padStart(2, '0');
   const day = now.getDate().toString().padStart(2, '0');
   const year = now.getFullYear();
   const hours = now.getHours().toString().padStart(2, '0');
   const minutes = now.getMinutes().toString().padStart(2, '0');
   const seconds = now.getSeconds().toString().padStart(2, '0');	
   
   return `${month}_${day}_${year}_${hours}_${minutes}_${seconds}`;
}

function setZoomFactor(faceWidth, faceHeight, canvasWidth, canvasHeight) {
   // Calculate the zoom factor so the face fills a certain percentage of the canvas
   const targetSize = Math.min(canvasWidth, canvasHeight) * CANVAS_FACE_FACTOR;
   const faceMaxDimension = Math.max(faceWidth, faceHeight);

   const targetZoomFactor = Math.max(targetSize / faceMaxDimension, 1);
   const actualZoomFactor = Math.floor(targetZoomFactor) + Math.round((targetZoomFactor - Math.floor(targetZoomFactor)) * 60) / 60;

   console.log("Setting zoom factor to " + actualZoomFactor);
   canvas.canvasZoom = actualZoomFactor;
}

function createGenerateRegion() {
   var region = canvas.foregroundMask

   // Create a border around it so that it blends well
   region.fillRectangle(
      0, 
      0, 
      detailerConfiguration.width, 
      MASK_BLUR,
   0);
   region.fillRectangle(
      0, 
      0, 
      MASK_BLUR, 
      detailerConfiguration.height,
   0);
   region.fillRectangle(
      0, 
      detailerConfiguration.height-MASK_BLUR, 
      detailerConfiguration.width, 
      MASK_BLUR,
   0);
   region.fillRectangle(
      detailerConfiguration.width-MASK_BLUR, 
      0, 
      MASK_BLUR, 
      detailerConfiguration.height,
   0);
   return region
}

function getDetailerConfig() {
   // Set Detailer Configs
   let detailerConfiguration = {
      ...configuration, 
      strength: DETAILER_STRENGTH,
      hiresFix: false,
   };

   // If loras defined use them
   if (LORAS != null) {
      console.log(`Found ${LORAS.length} lora(s) defined, will run detailer with them.`)
      detailerConfiguration = {
         ...detailerConfiguration,
         loras: LORAS
      }
   }

   // If controls defined use them
   if (CONTROLS != null) {
      console.log(`Found ${CONTROLS.length} control(s) defined, will run detailer with them.`)
      detailerConfiguration = {
         ...detailerConfiguration,
         controls: CONTROLS
      }
   }

   // Use seed override if set.
   if (DETAILER_SEED != null) {
      console.log(`Found seed override ${DETAILER_SEED}.`)
      detailerConfiguration = {
         ...detailerConfiguration,
         seed: DETAILER_SEED
      }
   }

   // Use blur override if set.
   if (MASK_BLUR != null) {
      console.log(`Found mask blur override ${MASK_BLUR}.`)
      detailerConfiguration = {
         ...detailerConfiguration,
         maskBlur: MASK_BLUR,
         maskBlurOutset: MASK_BLUR * -1
      }
   }

   // Use guidance override if set.
   if (DETAILER_TEXT_GUIDANCE != null) {
      console.log(`Found text guidance override ${DETAILER_TEXT_GUIDANCE}.`)
      detailerConfiguration = {
         ...detailerConfiguration,
         guidanceScale: DETAILER_TEXT_GUIDANCE
      }
   }

   // Use step override if set.
   if (DETAILER_STEPS != null) {
      console.log(`Found steps override ${DETAILER_STEPS}.`)
      detailerConfiguration = {
         ...detailerConfiguration,
         steps: DETAILER_STEPS
      }
   }

   // Use dimension override if set
   if (DETAILER_WIDTH != null && DETAILER_HEIGHT != null) {
      console.log(`Found ${DETAILER_WIDTH}x${DETAILER_HEIGHT} dimensions defined, will run detailer with them.`)
      detailerConfiguration = {
         ...detailerConfiguration,
         width: DETAILER_WIDTH,
         height: DETAILER_HEIGHT
      }
   }

   if (DETAILER_PROMPT) {
      console.log(`Detailer prompt specified:`)
      console.log(DETAILER_PROMPT)
      detailerPromptActual = DETAILER_PROMPT
   } else if (DETAILER_PROMPT_SUFFIX) {
      console.log(`Detailer prompt suffix specified; using prompt from UI:`)
      detailerPromptActual = originalPrompt + ", " + DETAILER_PROMPT_SUFFIX
      console.log(detailerPromptActual)
   } else {
      detailerPromptActual = originalPrompt
      console.log(`Detailer prompt not specified; using prompt from UI:`)
      console.log(originalPrompt)
   }

   console.log(`Processing up to ${TOP_K_FACES} (TOP_K_FACES) per image.`)
   return detailerConfiguration;
}
