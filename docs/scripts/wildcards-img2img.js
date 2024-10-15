//@api-1.0
//
// Wildcards_Img2Img
// v0.2
// author: wetcircuit
// 
// import images from Pictures/Input_Img folder, run image generation with wildcards, and save each render to Pictures/Output_Img folder.


//set the maximum number of renders
//
const batchMax = 500;

// fallback prompt if no wildcards found
//
const fallbackPrompt = "heavy splatters of {green|yellow|blue|red} ink on a {rough outline sketch|scribbled doodle|old b&w photo|fashion sketch|smudged charcoal rubbing}...";


// grab the config and prompt
//
const configuration = pipeline.configuration;
const uiPrompt = pipeline.prompts.prompt;
var uiHint = "no wildcards found in the prompt.";
var Input_Img = "Input_Img";
var Output_Img = "Output_Img";
var strength = configuration.strength;
var strengthHint = strength * 100;



// look for wildcards in the UI prompt
//
  if (uiPrompt.includes('{') && uiPrompt.includes('|') && uiPrompt.includes('}')) {
	uiHint = "wildcard detected in the prompt.";
	promptString = uiPrompt;
    } else {
	promptString = "";
  }


// UI
//
const userSelection = requestFromUser("Wildcards Img2Img", "", function() {
  return [
	this.section("Wildcard Prompt", uiHint, [
		this.textField(promptString, fallbackPrompt, true, 120),
		this.slider(25, this.slider.fractional(0), 1, batchMax, "batch count")
    ]),
	this.section("ImageToImage", "A higher value makes the prompt stronger, a lower value preserves the original image.", [
		this.slider(strengthHint, this.slider.fractional(0), 1, 100, "Strength"),
    ]),
	this.section("Input / Output", "Add the names of the User/Pictures/ subfolders on Mac, DT/pictures on IOS, to load and save the images. These folders must already exist.", [
		this.textField(Input_Img, "Input_Img", false, 20),
		this.textField(Output_Img, "Output_Img", false, 20)
    ]),
	this.section("about", "Wildcards Img2Img v0.2 by wetcircuit \n\nGenerate a batch of ImageToImage using inline wildcards to randomize elements within the Prompt. Select an Input_Img source folder of images, and an Output_Img folder to save.", [])
  ];
});

promptString = userSelection[0][0];
const batchCount = userSelection[0][1];
const uStrength = userSelection[1][0];
Input_Img = userSelection[2][0];
Output_Img = userSelection[2][1];
pipeline.configuration.strength = uStrength / 100;


// Get a list of input image filenames in the Input_Img folder
//
var inputImagePaths = filesystem.pictures.readEntries(Input_Img);

// Extract filenames from the full paths
//
var imageFilenames = inputImagePaths.map(function(path) {
    var pathComponents = path.split("/");
    return pathComponents[pathComponents.length - 1];
});

// Filter the list of filenames to include only supported image extensions
//
var supportedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
imageFilenames = imageFilenames.filter(function(filename) {
    var lowerCaseFilename = filename.toLowerCase();
    return supportedExtensions.some(function(extension) {
        return lowerCaseFilename.endsWith(extension);
    });
});


// initialize job log
//
console.log("\nwildcards prompt:\n");
console.log(promptString + "\n");
console.log("Available input images:\n");
for (var i = 0; i < imageFilenames.length; i++) {
    console.log(i + 1 + ". " + imageFilenames[i]);
}
console.log("\n");

// Define the output folder path
//
var outputFolderPath = filesystem.pictures.path + "/" + Output_Img + "/";



// Create a shuffled copy of the original array
//
const shuffledArray = [...imageFilenames];
shuffleArray(shuffledArray);

// Initialize counters
//
let currentIndex = 0;
let usedCount = 0;




// Your loop
//

for (let i = 0; i < batchCount; i++) {

 canvas.clear();

  if (usedCount === shuffledArray.length) {
    // All shuffled items have been used, so shuffle again
    shuffleArray(shuffledArray);
    usedCount = 0;
  }

  // Process the current item (e.g., console.log or any other operation)
  let currentItem = shuffledArray[usedCount];


 
   // Load the current input image from the Input_Img folder
    var inputImagePath = filesystem.pictures.path + "/" + Input_Img + "/" + currentItem;

    canvas.loadImage(inputImagePath);
    
editedString = replaceWildcards(promptString);
configuration.seed = -1;
let batchCountLog = `render ${i+1} of ${batchCount}`;
console.log(batchCountLog);

    
    // Run the image generation pipeline with the current configuration
    //

var startTime = new Date().getTime();
    pipeline.run({ configuration: pipeline.configuration, prompt: editedString });
  
    // Save the generated image to the Output_Img folder
    //
    var outputImagePath = outputFolderPath + currentIndex + " " + "_" + editedString + ".png";
    canvas.saveImage(outputImagePath, 1);
    
    // Console log indicating completion for the current image
    console.log(editedString);
  console.log(`original image: ${currentItem}`);
var endTime = new Date().getTime();
var elapsedTime = (endTime - startTime) / 1000;
console.log("generated in " + elapsedTime + " seconds\n");


  // Move to the next item
  currentIndex++;
  usedCount++;
}  

console.log("Job complete. Open Console to see job report.");


// functions
//

function replaceWildcards(inputString) {
    const wildcardRegex = /{([^}]+)}/g;

    function getRandomItem(arr) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }

function replaceWildcard(match) {
    const options = match.slice(1, -1).split('|');
    const randomOption = getRandomItem(options);
    return randomOption;
}
    let editedString = inputString;
    while (wildcardRegex.test(editedString)) {
        editedString = editedString.replace(wildcardRegex, replaceWildcard);
    }
    return editedString;
}

// Shuffle function using Fisher-Yates algorithm
//
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}