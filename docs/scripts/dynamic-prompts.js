//@api-1.0
// dynamic prompts
// author: zanshinmu
// v3.5.9.1
// Discord Thread for Dynamic Prompts:
// https://discord.com/channels/1038516303666876436/1207467278426177736
/**
 * Documentation for "Dynamic Prompts" Script (Version 3.5.9.1) for "Draw Things"
 *
 * This script generates dynamic prompts for the "Draw Things" application. Customize it to enhance your creative experience.
 *
 * Modifying Categories:
 * - Categories are thematic elements like 'Locale', 'Adjective', etc.
 * - To add a new category: Include it in the 'categories' object (e.g., "Futuristic": ["cybernetic", "AI-driven"]).
 * - To modify an existing category: Add or remove elements directly in the category's list.
 *
 * Dynamic Prompt Strings:
 * - The Prompts string structures your generated prompts.
 * - Use curly braces {} to include category elements. Examples:
 *   - Single element: "{Locale}" might generate "neon-lit city."
 *   - Multiple elements: "{Adjective:2}" can give "rainy, bustling."
 *   - Random range: "{Object:1-3}" could return "hovercar" or "hovercar, android, neon sign."
 *
 * BatchCount:
 * - BatchCount sets the number of prompts to generate.
 * - Change its value with the slider to control output (e.g., `BatchCount = 15;` for fifteen prompts).
 *
 * Customize your script to create diverse and inspiring prompts for "Draw Things."
 *
 * User Interface:
 * - Use UI Prompt:
 *   Process the prompt in the UI box instead of selecting random prompts.
 
 * - Lock configuration:
 *   When selecting random prompts, do not change configurations.
 
 * - Iterate Mode:
 *   Iterated generation of all combinations of dynamic prompt.  Best used with UI Prompt.
 *   BatchCount is not used in Iterate mode. Iterate mode can create very large numbers.
 *   To reduce the numbers, eliminate categories from your prompt.
 */

//Default example prompt for UI demonstrating category use
const defaultPrompt = "wide-angle shot of {weather} {time} {locale}"

/* Following are the prompts randomly selected from if UI Prompt mode isn't enabled.
   Modify prompts to provide dynamic prompts with LoRAs which will be randomly selected from if a valid dynamic prompt is not found in the UI.
 
   As of 3.0.1 there can be a 'configuration' object for each prompt which contains arbitrary settings which will be passed on to the pipeline at runtime.  These settings correspond to the possible values of pipeline.configuration
 
   There is an important caveat: Sampler is tricky because it looks like a string with the sampler name but it's actually an integer from a lookup table, so you want to find the number that corresponds to the desired sampler and use that instead (without quotes).
 
 Here is the current sampler lookup table:
 SamplerType = {
 DPMPP_2M_KARRAS: 0,
 EULER_A: 1,
 DDIM: 2,
 PLMS: 3,
 DPMPP_SDE_KARRAS: 4,
 UNI_PC: 5,
 LCM: 6,
 EULER_A_SUBSTEP: 7,
 DPMPP_SDE_SUBSTEP: 8,
 TCD: 9,
 EULER_A_TRAILING: 10,
 DPMPP_SDE_TRAILING: 11,
 DPMPP_2M_AYS: 12,
 EULER_A_AYS: 13,
 DPMPP_SDE_AYS: 14,
 DPMPP_2M_TRAILING: 15,
 DDIM_TRAILING: 16
}
 */

const prompts = [
    {
    prompt: "{colors:1-3} dominant {camera} shot of a {cyborg}, {pose} in {weather} {time} {locale}",
    negativePrompt: "NSFW, nude, blurry, 3d, drawing, anime",
    model: "FLUX.1 [schnell] (8-bit)",
    loras: [
            { file: "AntiBlur v1.0 [dev]", weight: 0.4}
            ],
    configuration:
        {width:1152,height:896,steps:2,sampler:10,guidanceScale:2.5,clipLText:"Photograph, sensual, professional",resolutionDependentShift:true}
    },
    {
    prompt: "{camera} shot of a {cyborg}, {pose} in {weather} {time} {locale}",
    negativePrompt: "NSFW, nude, blurry, 3d, drawing, anime",
    model: "FLUX.1 [schnell] (8-bit)",
    loras: [
            { file: "AntiBlur v1.0 [dev]", weight: 0.4}
            ],
    configuration:
        {width:1152,height:896,steps:2,sampler:10,guidanceScale:2.5,clipLText:"Photograph, sensual, professional",resolutionDependentShift:true}
    },
    {
    prompt: "{camera} shot of a {cyborg}, {pose} in {weather} {time} {locale}",
    negativePrompt: "NSFW, nude, blurry, 3d, drawing, anime",
    model: "RealVisXL v4.0",
    loras: [
        { file: "Fix Hands Slider", weight: 0.3 },
        { file: "Pixel Art XL v1.1", weight: 0.4 }
    ],
    configuration:
        {width:1024,height:1024,steps:28,sampler:0,guidanceScale:4.0}
    }
    
  // Add more prompt objects as needed
  // Empty file will be ignored
];

// Categories definition: This is where you add your dynamic categories.
const categories = {
    cyborg: [
    "{adjective} cyborg man, {hairstyle} {haircolor} hair, {features}, wearing {malestyle}",
    "{adjective} cyborg woman, {hairstyle} {haircolor} hair, {features} wearing {style}"
    ],
    time: [
    "morning",
    "noon",
    "night",
    "midnight",
    "sunset",
    "sunrise"
    ],
    camera: [
        "full body",
        "medium",
        "close_up",
        "establishing"
    ],
    locale: [
        "cityscape",
          "street",
          "alley",
          "marketplace",
          "industrial zone",
          "waterfront",
          "forest",
          "rooftop",
          "bridge",
          "park"
     ],
     weather: [
        "rainy",
        "smoggy",
        "stormy",
        "dusty"
    ],
    adjective: [
        "beautiful",
        "moody",
        "cute",
        "tired",
        "injured",
        "cyborg",
        "muscular"
    ],
    style: [
        "cyberpunk street", "dark gothic", "military armor", "elegant kimono", "eveningwear dress", "corpo uniform", "tech bodysuit"
    ],
    hairstyle: [
        "long",
        "medium",
        "shaved",
        "short",
        "wet",
        "punk"
    ],
    haircolor: [
        "red",
        "blonde",
        "colored",
        "brunette",
        "natural",
        "streaked"
    ],
    colors: [
        "red",
        "blue",
        "green",
        "yellow",
        "orange",
        "purple",
        "pink",
        "brown",
        "black",
        "white",
        "gray",
        "cyan",
        "magenta",
        "teal",
        "olive",
        "maroon",
        "navy",
        "lime",
        "indigo",
        "gold",
        "silver",
        "bronze",
        "salmon",
        "coral",
        "turquoise",
        "peach",
        "lavender",
        "emerald",
        "ruby",
        "sapphire"
    ],
    features: [
        "{colors} glowing cyborg eyes",
        "smoking",
        "tech brella with {colors} glowing accents",
        "cyborg arm",
        "cyborg legs",
        "optics implant",
        "tech goggles"
    ],
    pose: [
        "action pose",
        "poses",
        "model pose",
        "relaxing",
        "sitting"
    ],
    malestyle: [
                "leather",
                "denim",
                "silk",
                ]
};

//Version
const versionString = "v3.5.9.1";
//Maximum iterations for Iterate Mode, this is a good value for everything
//Macs with more resources can probably set this much higher
const maxIter = 500;

//Sure, you can turn this on if you like your console cluttered. :P
const DEBUG = false;

class DebugPrint {
  static Level = Object.freeze({
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR'
  });

  #debugMode; // Private field to store debug mode state

  /**
   * Constructor for DebugPrint
   * @param {boolean} [debugMode=false] - Whether to enable debug printing by default
   */
  constructor(debugMode = false) {
    this.#debugMode = debugMode;
  }

  /**
   * Prints a message if debug mode is enabled
   * @param {string} message - The message to print
   * @param {DebugPrint.Level} [level=DebugPrint.Level.INFO] - The log level of the message
   */
  print(message, level = DebugPrint.Level.INFO) {
    if (!Object.values(DebugPrint.Level).includes(level)) {
      throw new Error(`Invalid log level: ${level}`);
    }

    if (this.#debugMode) {
    switch (level) {
        case DebugPrint.Level.INFO:
            console.log(`${message}`);
        break;
        
        case DebugPrint.Level.WARN:
            console.warn(`${message}`);
        break;
        
        case DebugPrint.Level.ERROR:
            console.error(`${message}`);
        break;
            
        }
    }
  }
}

// Initiate debug logger, set state to DEBUG;
const debug = new DebugPrint(DEBUG);
//store selected prompt data and UI config
let userPrompt = '';
let uiPrompt = '';
const UICONFIG = pipeline.configuration;

// UI
const categoryNames = Object.keys(categories).join(', ');
const seedOptions = ["Random","Increment","Static"];
const okButton = "Start";
const header = "Dynamic Prompts " + `${versionString}` + " by zanshinmu";
const aboutText = "Selects randomly from " + `${prompts.length} dynamic prompts`+
                  " located in the script's 'const prompts' object.";

const userSelection = requestFromUser("Dynamic Prompts", okButton, function() {
  return [
    this.section(header, aboutText, [
      this.section("Seed Mode", "", [this.segmented(1, seedOptions),
             this.slider(10, this.slider.fractional(0), 1, 2000, "batch count")]),
      this.section("Output:", "Output rendered images to custom location", [
        this.directory(`${filesystem.pictures.path}`)]),
      this.switch(false, "Enter UI Prompt"),
      this.switch(false, "Lock configuration"),
      this.switch(false, "Iterate Mode"),
      this.switch(true, "Download Models"),
    ])
  ];
});

// Parse UI input
const seedMode = userSelection[0][0][0];
const batchCount = userSelection[0][0][1];
const outputDir = userSelection[0][1][0];
const useUiPrompt = userSelection[0][2];
const overrideModels = userSelection[0][3];
const iterateMode = userSelection[0][4];
const downloadModels = userSelection[0][5];


if (iterateMode){
    console.log("Iterate Mode");
}



if (useUiPrompt) {
    const userSelection = requestFromUser("Dynamic Prompts: UI Prompt", okButton, function() {
        return [
            this.section("Dynamic Prompt Syntax","", [
                this.section("{category}","Replaces category with random item", []),
                this.section("{category:2}","Replaces category with 2 random items", []),
                this.section("{category:1-3}","Replaces category with 1 to 3 random items", []),
            this.section("UI Prompt", "Modify the dynamic prompt to your desire", [
                this.textField(defaultPrompt, pipeline.prompts.prompt, true, 80),
                this.section("Available Categories", categoryNames, [])
                ])
            ])
        ]; // Closing bracket for the return array
    });
    uiPrompt = userSelection[0][3][0];
}

// Store UI negative prompt for later
const uiNegPrompt = pipeline.prompts.negativePrompt;

if(useUiPrompt){
    if(isPromptValid(uiPrompt, categories)){
        console.log("Valid UI prompt detected.");
        userPrompt = uiPrompt; // Use the UI prompt
    } else {
        console.log("Error, Invalid UI Prompt");
        return;
    }
}

// Main batch loop
if (!iterateMode){
    const bstart = Date.now();
    const bmessage = "✔︎ Total render time ‣";
    for (let i = 0; i < batchCount; i++){
        let batchCountLog = `Rendering ${i + 1} of ${batchCount}`;
        console.warn(batchCountLog);
        render(getDynamicPrompt(), i);
    }
    elapsed(bstart, message = bmessage);
} else {
    const promptData = getDynamicPrompt();
    const dynPrompt = promptData.prompt;
    p = computeTotalPromptCount(dynPrompt);
    if (p > maxIter){
        console.warn(`Max iterations of ${maxIter} exceeded: Prompt total combinations = ${p}\n`);
        console.warn("Reduce the number of categories used in prompt.");
    } else {
        let k = 1;
        console.log(`Iterating over dynamic prompt:\n '${dynPrompt}'\n Total combinations number ${p}.`);
        const istart = Date.now();
        const imessage = "✔︎ Total iteration time ‣";
        for (let generatedPrompt of generatePrompts(dynPrompt)) {
            let myConfig = promptData;
            promptData.prompt = dynPrompt;
            console.warn(`iterating render ${k} of ${p}\n${generatedPrompt}\n`);
            render(generatedPrompt, k);
            k++;
        }
        elapsed(istart, message = imessage);
    }
}

function computeTotalPromptCount(dynamicPrompt) {
    // Find all unique top-level placeholders in the prompt
    const regex = /{(\w+)}/g;
    let match;
    let placeholders = new Set();
    while ((match = regex.exec(dynamicPrompt)) !== null) {
        placeholders.add(match[1]);
    }

    // If no placeholders, return 1
    if (placeholders.size === 0) {
        return 1;
    }

    let totalCombinations = 1;

    for (let placeholder of placeholders) {
        const optionsCount = countPlaceholderOptions(placeholder, new Set());
        totalCombinations *= optionsCount;
    }

    return totalCombinations;
}

function countPlaceholderOptions(placeholder, seenPlaceholders) {
    if (seenPlaceholders.has(placeholder)) {
        throw new Error(`Circular reference detected for placeholder '{${placeholder}}'`);
    }

    seenPlaceholders.add(placeholder);

    const values = categories[placeholder];
    if (!values) {
        throw new Error(`Category '${placeholder}' not defined.`);
    }

    let totalOptions = 0;

    for (let value of values) {
        const optionsCount = countValueOptions(value, new Set(seenPlaceholders));
        totalOptions += optionsCount;
    }

    seenPlaceholders.delete(placeholder);

    return totalOptions;
}

function countValueOptions(value, seenPlaceholders) {
    // Find all placeholders in the value
    const regex = /{(\w+)}/g;
    let match;
    let placeholders = new Set();
    while ((match = regex.exec(value)) !== null) {
        placeholders.add(match[1]);
    }

    // If no placeholders, return 1
    if (placeholders.size === 0) {
        return 1;
    }

    let totalCombinations = 1;

    for (let placeholder of placeholders) {
        const optionsCount = countPlaceholderOptions(placeholder, seenPlaceholders);
        totalCombinations *= optionsCount;
    }

    return totalCombinations;
}

function* generatePrompts(dynamicPrompt) {
    // Base case: if no placeholders, yield the prompt
    if (!/{\w+}/.test(dynamicPrompt)) {
        yield dynamicPrompt;
        return;
    }

    // Find the first placeholder in the prompt
    const regex = /{(\w+)}/g;
    const match = regex.exec(dynamicPrompt);

    if (!match) {
        yield dynamicPrompt;
        return;
    }

    const placeholder = match[1];

    const values = categories[placeholder];
    if (!values) {
        throw new Error(`Category '${placeholder}' not defined.`);
    }

    for (const value of values) {
        // Replace all occurrences of the placeholder with the value
        const newPrompt = dynamicPrompt.replace(new RegExp(`{${placeholder}}`, 'g'), value);
        // Recursively generate prompts for the new prompt
        yield* generatePrompts(newPrompt);
    }
}

function selectRandomPrompt() {
  // Generate a random index to select a random prompt
  const randomIndex = Math.floor(Math.random() * prompts.length);
  console.log(`Selected dynamic prompt ${randomIndex} of ${prompts.length}`)
  // Get the randomly selected prompt object
  const selectedPrompt = prompts[randomIndex];
  // Extract prompt string, LoRa filenames, and weights
  const myprompt = selectedPrompt.prompt;
  const myneg = selectedPrompt.negativePrompt;
  const mymodel = selectedPrompt.model;
  const loras = [];
  let myconfig = {};
  if (typeof selectedPrompt.configuration !== 'undefined'){
      myconfig = selectedPrompt.configuration;
  } else {
      myconfig = {...UICONFIG};
  }
  //Prepare LoRAs
  const myLoras = resolveLoras(selectedPrompt.loras);
  if (typeof myLoras !== 'undefined'){
     myconfig.loras = myLoras.map(lora => ({ file: lora.file, weight: lora.weight }));
  }
  myconfig.model = resolveModel(mymodel);
  // Store the promptData object
  const promptData = { prompt: myprompt, negativePrompt: myneg, configuration: myconfig };
  debug.print(JSON.stringify(promptData), DebugPrint.Level.WARN);
  return promptData;
}

function resolveModel(model){
    if(downloadModels){
        let myNameArray = [];
        myNameArray.push(model);
        pipeline.downloadBuiltins(myNameArray);
        debug.print(`Model ${model} downloaded`);
    } else {
        debug.print('Download models disabled.');
    }
    return model;
}

// Resolves LoRAs to filenames
function resolveLoras(loras){
    if (typeof loras === 'undefined'){
        return loras;
    }
    const FILESUFFIX = ".ckpt";
    const myLoras = [];
    for (let i = 0; i < loras.length; i++) {
        let myLora = loras[i];
        let myname = myLora.file;
        if (typeof myname === 'undefined'){
            debug.print("Empty LoRA", DebugPrint.level.WARN);
            continue;
        }
        if (!myname.endsWith(FILESUFFIX)){
            try{
                let myfile = pipeline.findLoRAByName(myname).file;
                // Assign resolved name
                myLora.file = myfile;
                debug.print(`Filename ${myname} resolved to ${JSON.stringify(myfile)}`);
            } catch (e){
                debug.print(`${e} Is it downloaded?`);
                if(downloadModels){
                    let myNameArray = [];
                    myNameArray.push(myname);
                    myLora.file = pipeline.downloadBuiltins(myNameArray);
                } else {
                    myLora.file = myname;
                }
            }
        }
        myLoras.push(myLora);
    }
    return myLoras;
}

// Function to extract and validate category names and their requested item count or range from the uiPrompt
function isPromptValid(uiPrompt, categories) {
    const regex = /{(\w+)(?::(\d+)(?:-(\d+))?)?}/g; // Extended regex to capture syntax variations
    let isValid = false; // Assume the prompt is invalid initially

    let match;
    while ((match = regex.exec(uiPrompt)) !== null) {
        const [fullMatch, categoryName, itemCount, rangeEnd] = match;
        
        // Check if the category name is valid
        if (!(categoryName in categories)) {
            console.log(`Invalid UI prompt: Category '${categoryName}' not found.`);
            return false; // Invalid if the category doesn't exist
        }
        
        // Validate item count or range syntax if specified
        if (itemCount) {
            isValid = true; // Assume valid syntax if itemCount exists
            if (rangeEnd && (parseInt(itemCount) > parseInt(rangeEnd))) {
                console.log(`Invalid UI prompt: Incorrect range '${itemCount}-${rangeEnd}' in category '${categoryName}'.`);
                return false; // Invalid if the range start is greater than the range end
            }
        } else {
            // Valid if only the category name is specified without itemCount or range
            isValid = true;
        }
    }

    // Prompt is invalid if no categories or incorrect syntax is detected
    if (!isValid) {
        console.log("Invalid UI prompt: No valid categories or incorrect syntax detected.");
    }
    return isValid;
}

//get prompt each iteration
function getDynamicPrompt () {
    let promptData = {};
    if (useUiPrompt) {
        console.log("Using UI Prompt");
        promptData.prompt = userPrompt;
        } else {
        promptData = selectRandomPrompt();
        }
    return promptData;
}

function elapsed (start, message = "✔︎ Render time ‣"){
    const end = Date.now();
    const duration = end - start;
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000); // calculate the remaining minutes after subtracting the elapsed hours from the total duration
    let seconds = Math.floor((duration % 60000) / 1000);
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    console.log(`${message} ${formattedHours}:${formattedMinutes}:${formattedSeconds}\n`);
}

// Run pipeline
function render (promptData, batchCount){
    // start timer
    let start = Date.now();
    // set generated prompt
    let generatedPrompt = replaceWildcards(promptData.prompt, categories);
    let neg;
    let finalConfiguration = Object.create(pipeline.configuration);
    // Set seed according to user selection
    let mySeed = getSeed(pipeline.configuration.seed);
    debug.print(JSON.stringify(finalConfiguration));
    
    if (useUiPrompt){
       finalConfiguration = UICONFIG;
       finalConfiguration.loras = UICONFIG.loras;
       neg = uiNegPrompt;
    } else {
        neg = promptData.negativePrompt;
        if (!overrideModels){
            //Apply configuration changes, if any
            finalConfiguration = Object.assign(UICONFIG, promptData.configuration);
            finalConfiguration.loras = promptData.configuration.loras;
            debug.print(finalConfiguration.model);
        }
    }
    // Batch > 1 is no bueno
    finalConfiguration.batchSize = 1;
    finalConfiguration.seed = mySeed;
    
    canvas.clear();
    
    debug.print(JSON.stringify(finalConfiguration), DebugPrint.Level.WARN);
    pipeline.run({
        configuration: finalConfiguration,
        prompt: generatedPrompt,
        negativePrompt: neg
    });
    //Output render time elapsed
    elapsed(start);
    //Save Image if enabled
    savetoImageDir(finalConfiguration, batchCount);
}

function savetoImageDir(config, batchCount){
    if(outputDir) {
          // worked around metadata bug by forcing our config onto the UI before saving
          // but that didn't work consistently so trying something else
          // Crazy thing is the metadata is borked with canvas.save, but fine
          // if you reload the image in DT
          const SamplerTypeReverse = Object.fromEntries(
              Object.entries(SamplerType).map(([key, value]) => [value, key])
          );
          const seed = config.seed;
          let model = "undefined";
          if (typeof config.model !== 'undefined'){
             model = sanitize(config.model.replace('.ckpt'));
          }
          const sampler = sanitize(SamplerTypeReverse[config.sampler]);
          const steps = config.steps;
          const time = getTimeString();
          let savePath = `${outputDir}/${model}_${sampler}_${steps}_${time}_${batchCount}.png`
          console.log(`Saving to ${savePath}\n\n`);
          canvas.saveImage(savePath, true); // save the image currently on canvas to a file.
    }
}

function sanitize(text) {
    // Handle null case
    if (typeof text === 'undefined'){
        let undef = "undefined";
        return undef;
    }
    const trunc = 16;
    // Replace characters that are not allowed in filenames with a hyphen
    return text
        .trim() // Remove leading/trailing whitespace
        .toLowerCase() // Convert to lowercase for consistency
        .replace(new RegExp('[\/\\\\?%*:|"<>[]{}$#@&+;,.~()]', 'g'), '-') // Comprehensive now
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .slice(0, trunc) // Truncate to trunc chars;
}

function getTimeString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}`;
}

function getSeed(oldSeed){
    const MAX_INT_32 = 2147483647;
    let seed = 0;
    
    switch (seedMode) {
        case 0: // Random
            seed = Math.floor(Math.random() * (MAX_INT_32));
            break;
        
        case 1: // Iterate
            if (seed < MAX_INT_32){ //Wrap if seed exceeds MAX_INT_32
                seed = ++oldSeed;
            }
            break;
            
        case 2: // Static
            seed = oldSeed;
            break;
    }
    console.log(`${seedOptions[seedMode]} Seed Mode, Seed: ${seed}`);
    return seed;
}

function replaceWildcards(promptString, categories) {
    const wildcardRegex = /{(\w+)(?::(\d+)(?:-(\d+))?)?}/g;

    function replaceWildcard(match, categoryName, minCount, maxCount) {
        const categoryOptions = categories[categoryName];
        if (categoryOptions) {
            const count = getRandomCount(minCount, maxCount);
            const options = new Set(); // Use a Set to ensure uniqueness

            while (options.size < count) {
                let randomOption = categoryOptions[Math.floor(Math.random() * categoryOptions.length)];

                // Recursively expand the wildcard in the selected option
                randomOption = replaceWildcards(randomOption, categories);

                options.add(randomOption);
            }

            return [...options].join(", ");
        }
        return match; // If category not found, return the original match
    }

    let editedString = promptString;

    // Recursively replace wildcards until there are none left
    while (wildcardRegex.test(editedString)) {
        editedString = editedString.replace(wildcardRegex, replaceWildcard);
    }

    return editedString;
}


// Function to get a random count within the specified range or default to 1 if range not provided
function getRandomCount(minCount, maxCount) {
    const min = parseInt(minCount);
    const max = parseInt(maxCount);

    if (!isNaN(min) && !isNaN(max)) {
        // Both min and max are numbers, return a random number in this range
        return Math.floor(Math.random() * (max - min + 1)) + min;
    } else if (!isNaN(min)) {
        // Only min is a number, return this number
        return min;
    } else {
        // Default case when neither min nor max is a number
        return 1;
    }
}
