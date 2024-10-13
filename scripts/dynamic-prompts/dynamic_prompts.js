//@api-1.0
// dynamic prompts
// author zanshinmu
// v3.5
/**
 * Documentation for "Dynamic Prompts" Script (Version 3.5) for "Draw Things"
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
 *   BatchCount is not used. Iterate mode can create very large numbers.
 *   To reduce the numbers, eliminate a few dynamic categories from your prompt.
 */

//Version
const versionString = "3.5"
//Maximum iterations for Iterate Mode
const maxIter = 500
//store selected prompt/LoRA data
let promptData;
let userPrompt = '';
// Default example prompt for UI demonstrating category use
const defaultPrompt = "Cybervenues wide-angle shot of {weather} {time} {locale}"

/* These are the prompts randomly selected from if UI Prompt isn't valid.
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
    prompt: "{colors:1-3} dominant {camera} shot of a {adjective} cyborg woman, {style}, {hairstyle} {haircolor} hair, {features}, {pose} in {weather} {time} {locale}",
    negativePrompt: "NSFW, nude, blurry, 3d, drawing, anime",
    model: "FLUX.1 [schnell] (8-bit)",
    loras: [
            { file: "AntiBlur v1.0 [dev]", weight: 0.4}
            ],
    configuration:
        {width:1152,height:896,steps:2,sampler:10,guidanceScale:2.5,clipLText:"Photograph, sensual, professional",resolutionDependentShift:true}
    },
    {
    prompt: "{camera} shot of a {adjective} cyborg man, {hairstyle} {haircolor} hair, {features}, wearing {malestyle}, {pose} in {weather} {time} {locale}",
    negativePrompt: "NSFW, nude, blurry, 3d, drawing, anime",
    model: "RealVisXL v4.0",
    loras: [
        { file: "Fix Hands Slider", weight: 0.3 },
        { file: "Pixel Art XL v1.1", weight: 0.4 }
    ],
    configuration:
        {width:1024,height:1024,steps:28,sampler:0,guidanceScale:4.0}
    },
    {
    prompt: "{camera} shot of a {adjective} cyborg man, {hairstyle} {haircolor} hair, {features}, wearing {malestyle}, {pose} in {weather} {time} {locale}",
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

// Categories definition
const categories = {
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

// UI
const categoryNames = Object.keys(categories).join(', ');
const header = "Dynamic Prompts " + `${versionString}` + " by zanshinmu";
const aboutText = "Selects randomly from " + `${prompts.length}`+ " dynamic prompts" + "\nGenerates batch images using '{}' to randomize categories in prompt"
const userSelection = requestFromUser("Dynamic Prompts", "Start", function() {
  return [
    this.section(header, aboutText, []),
    this.section("Categories", categoryNames, [
        this.textField(defaultPrompt, pipeline.prompts.prompt, true, 60),
        this.slider(10, this.slider.fractional(0), 1, 2000, "batch count"),
        this.switch(false, "Use UI Prompt"),
        this.switch(false, "Lock configuration"),
        this.switch(false, "Iterate Mode"),
        this.switch(true, "Download Models")
    ])
  ];
});
// Number of prompts to generate
let batchCount = userSelection[1][1];
let uiPrompt = userSelection[1][0];
let useUiPrompt = userSelection[1][2];
let overrideModels = userSelection[1][3];
let iterateMode = userSelection[1][4];
let downloadModels = userSelection[1][5];
if (iterateMode){
    console.log("Iterate Mode");
}
//console.log(JSON.stringify(userSelection));

// Get configuration
const configuration = pipeline.configuration;
const defaultLoras = pipeline.configuration.loras;
//console.log(JSON.stringify(configuration));
const uiNegPrompt = pipeline.prompts.negativePrompt;
if (isPromptValid(uiPrompt, categories)) {
    if(useUiPrompt){
        console.log("Valid UI prompt detected.");
        userPrompt = uiPrompt; // Use the UI prompt
    }
}

// Main batch loop
if (!iterateMode){
    for (let i = 0; i < batchCount; i++){
        render(getPrompt());
        let batchCountLog = `batch ${i + 1} of ${batchCount}\n`;
        console.log(batchCountLog);
    }
} else {
    let dynprompt;
    if (useUiPrompt){
        dynPrompt = userPrompt;
    } else {
        dynPrompt = getPromptString(selectRandomPrompt());
    }
    p = computeTotalPromptCount(dynPrompt);
    if (p > maxIter){
        console.log(`Max iterations of ${maxIter} exceeded: Prompt total combinations = ${p}\n`);
        console.log("Reduce the number of categories used in prompt.")
        return;
    }
    let k = 1;
    console.log(`Iterating over dynamic prompt:\n '${dynPrompt}'\n Total combinations number ${p}.`);
    for (let generatedPrompt of generatePrompts(dynPrompt)) {
        console.log(`iterating render ${k} of ${p}\n`);
        render(generatedPrompt); // Do something with each generated prompt
        k++;
    }
}

function computeTotalPromptCount(dynamicPrompt) {
    let placeholders = dynamicPrompt.match(/{(\w+)}/g).map(p => p.replace(/[{}]/g, ''));
    let totalCombinationCount = 1;
    for (let placeholder of placeholders) {
        const valueCount = categories[placeholder].length; // Get the number of values in each category
        totalCombinationCount *= valueCount; // Multiply the counts to calculate the maximum possible number of combinations
    }
    return totalCombinationCount;
}

function* generatePrompts(dynamicPrompt) {
    function cartesian(...arrays) {
        return arrays.reduce((acc, curr) => acc.flatMap(d => curr.map(e => [d, e].flat())));
    }

    let placeholders = dynamicPrompt.match(/{(\w+)}/g).map(p => p.replace(/[{}]/g, ''));
    let validPlaceholders = placeholders.filter(p => categories[p]);
    let categoryValues = validPlaceholders.map(p => categories[p]);
    let combinations = cartesian(...categoryValues);

    for (let combination of combinations) {
        let prompt = dynamicPrompt;
        validPlaceholders.forEach((placeholder, i) => {
            prompt = prompt.replace(`{${placeholder}}`, combination[i]);
        });
        yield prompt;
    }
}


function selectRandomPrompt() {
  // Generate a random index to select a random prompt
  const randomIndex = Math.floor(Math.random() * prompts.length);
  console.log(`Selected ${randomIndex} of ${prompts.length}`)
  // Get the randomly selected prompt object
  const selectedPrompt = prompts[randomIndex];
  // Extract prompt string, LoRa filenames, and weights
  let myprompt = selectedPrompt.prompt;
  let myneg = selectedPrompt.negativePrompt;
  let mymodel = selectedPrompt.model;
  let myconfig = selectedPrompt.configuration;
  const loras = selectedPrompt.loras.map(lora => ({ file: lora.file, weight: lora.weight }));
  let myloras = getAssociatedLoRas(loras);
  myconfig.model = mymodel;
  myconfig.loras=myloras;
  // Store the promptData object
  let promptData = { prompt: myprompt, negativePrompt: myneg, configuration: myconfig };
  if (downloadModels){
      getModels(promptData);
  }
  return promptData;
}

//Download models if necessary
function getModels(promptData){
    let models = [];
    //Model first
    models.push(promptData.configuration.model);
    //Initiate Download
    pipeline.downloadBuiltins(models);
   
    //Loras
    for (let i = 0; i < promptData.configuration.loras.length; i++) {
        let lora = promptData.configuration.loras[i].file;
        models.push(lora);
    }
    //Initiate Download
    pipeline.downloadBuiltins(models);
}

function loraNamestoFiles(loras){
    for (let i = 0; i < loras.length; i++) {
        let loraname = loras[i].file;
        let lorafile = pipeline.findLoRAByName(loraname);
        loras[i]=lorafile;
    }
    return loras;
}

// Function to get the prompt string from the object returned by selectRandomPrompt
function getPromptString(p) {
  return p.prompt;
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
function getPrompt () {
    if (useUiPrompt) {
        console.log("Using UI Prompt");
        promptString = userPrompt;
        } else {
        console.log("Selecting dynamic prompt and configuration.");
        promptData = selectRandomPrompt();
        //console.log(promptData);
        promptString = getPromptString(promptData);
        }
    return promptString
}

function getAssociatedLoRas(loras) {
    if(!overrideModels){
      let validLoras = setLoras(loras);
      const mergedLoras = defaultLoras.concat(validLoras);
      return mergedLoras
    }else{
      return defaultLoras
    }
}

// is name in defaultLoras?
function isDefaultLora(lora){
    for (let i = 0; i < defaultLoras.length; i++) {
        if (defaultLoras[i].file === lora.file){
            return true;
        } else{
            return false;
        }
    }
}


// Only overwrite valid Loras from prompts
function setLoras (myLoras){
    let loras=[];
    for (let i = 0; i < myLoras.length; i++) {
        if (myLoras[i].file !== ''){
            if(!isDefaultLora(myLoras[i])){
                loras.push(myLoras[i]);
            }
        }
    }
    return loras
}

// Run pipeline
function render (promptString){
    let editedString = replaceWildcards(promptString, categories);
    let neg;
    let myConfiguration = configuration;
    if (useUiPrompt){
       neg = uiNegPrompt;
    } else {
       neg = promptData.negativePrompt;
        if (!overrideModels){
            myConfiguration.model = promptData.model;
            //Default to random seed, configuration overrides
            myConfiguration.seed = -1;
            //Apply configuration changes, if any
            myConfiguration = Object.assign(configuration, promptData.configuration);
            myConfiguration.loras = loraNamestoFiles(promptData.configuration.loras);
        }
    }
    //Clear canvas
    canvas.clear();
    pipeline.run({
        configuration: myConfiguration,
        prompt: editedString,
        negativePrompt: neg
    });
}

// Function to replace wildcards with random options
function replaceWildcards(promptString, categories) {
    const wildcardRegex = /{(\w+)(?::(\d+)(?:-(\d+))?)?}/g;

    function replaceWildcard(match, categoryName, minCount, maxCount) {
        const categoryOptions = categories[categoryName];
        if (categoryOptions) {
            const count = getRandomCount(minCount, maxCount);
            const options = new Set(); // Use a Set to ensure uniqueness

            while (options.size < count) {
                let randomOption = categoryOptions[Math.floor(Math.random() * categoryOptions.length)];
                
                // Check if the selected option contains another wildcard
                if (wildcardRegex.test(randomOption)) {
                    // Recursively expand the wildcard in the selected option
                    randomOption = replaceWildcards(randomOption, categories);
                }
                
                options.add(randomOption);
            }

            return [...options].join(", ");
        }
        return match; // If category not found, return the original match
    }

    // Recursively replace all wildcards in the prompt string
    let editedString = promptString.replace(wildcardRegex, replaceWildcard);

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
