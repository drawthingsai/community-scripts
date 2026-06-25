//@api-1.0
// dynamic prompts
// author: zanshinmu
// v3.7.1
// Discord Thread for Dynamic Prompts:
// https://discord.com/channels/1038516303666876436/1207467278426177736
/**
 * Dynamic Prompts Script Documentation (Version 3.7.1) for Draw Things
 *
 * OVERVIEW:
 * This script enables dynamic prompt generation in the Draw Things application.
 * Users can customize the script to create diverse and inspiring prompts.
 *
 * CORE FEATURES:
 *
 * 1. Categories
 *    - Thematic elements like 'Locale', 'Adjective', etc.
 *    - Add new categories in 'categories' object:
 *      Example: "Futuristic": ["cybernetic", "AI-driven"]
 *    - Modify existing categories by editing their lists
 *
 * 2. Dynamic Prompt Syntax
 *    Use curly braces {} to include category elements:
 *    - Single element: {Locale} → "neon-lit city"
 *    - Multiple elements: {Adjective:2} → "rainy, bustling"
 *    - Random range: {Object:1-3} → "hovercar" or "hovercar, android, neon sign"
 *
 * 3. Prompts Object
 *    - Contains prompts randomly selected when UI Prompt mode is disabled
 *    - Each prompt can have a configuration object with pipeline settings
 *    - Example structure:
 *      {
 *        prompt: "wide shot of {weather} {locale}",
 *        label: "Landscape Scene",      // Added in 3.6: friendly name
 *        configuration: {
 *          guidanceScale: [2, 4],      // Random value between 2-4
 *          sampler: 1,                 // IMPORTANT: Must use number, not name
 *          steps: 20
 *        }
 *      }
 *
 * 4. Configuration Settings
 *    IMPORTANT: For sampler settings, you may use numbers or names
 *    (see Sampler Types table below)
 *
 *    Numeric Values (3.6):
 *    - Two numbers = random range
 *      Example: guidanceScale:[2,4] → random between 2-4
 *    - Three+ numbers = random selection
 *      Example: guidanceScale:[2, 3, 3.2, 4] → picks one value
 *
 *    Other Settings:
 *    - clipLText/openClipGText: Support wildcards if enabled
 *    - label: Provides friendly name for prompts (added in 3.6)
 *
 * 5. User Interface Controls
 *
 *    Main Options:
 *    - UI Prompt: Process prompts from UI box instead of random selection
 *    - Lock Configuration: Prevents config changes, random selection only generates prompts
 *    - Override Canvas: Customize canvas size, HRF, steps
 *
 *    Generation Settings:
 *    - RenderCount: Controls number of prompts generated (adjust via slider)
 *    - Iterate Mode:
 *      • Generates all prompt combinations
 *      • Best used with UI Prompt
 *      • RenderCount ignored
 *      • Can generate large numbers; reduce by limiting categories
 *
 *    System Options:
 *    - Download Models: Auto-downloads referenced models (default: enabled)
 *    - Debug Mode: Prints diagnostic information to console
 *
 * 6. Seed Modes
 *    - Random: Generates new random seed
 *    - Increment: Adds 1 to existing seed
 *    - Static: Maintains same seed
 *
 * 7. Output Options
 *    - Save rendered images to specified directory
 *    - Note: 'Saved Generated Images' setting is separate
 *    - Future updates will allow custom output filenames
 *    - Not compatible with batch size > 1
 *
 * 8. Sampler Types
 *    Use these numbers or the names in configuration
 *
 *    DPMPP_2M_KARRAS: 0       EULER_A: 1
 *    DDIM: 2                  PLMS: 3
 *    DPMPP_SDE_KARRAS: 4      UNI_PC: 5
 *    LCM: 6                   EULER_A_SUBSTEP: 7
 *    DPMPP_SDE_SUBSTEP: 8     TCD: 9
 *    EULER_A_TRAILING: 10     DPMPP_SDE_TRAILING: 11
 *    DPMPP_2M_AYS: 12        EULER_A_AYS: 13
 *    DPMPP_SDE_AYS: 14       DPMPP_2M_TRAILING: 15
 *    DDIM_TRAILING: 16
 */
//Default example prompt for UI demonstrating category use
const defaultPrompt = "wide-angle shot of {weather} {time} {locale}";
//Prompts object containing dynamic prompts and configurations
const prompts = [
    {
    label: "Schnell photo dynamic colors",
    prompt: "{colors:1-3} dominant {camera} shot of a {cyborg}, {pose} in {weather} {time} {locale}",
    negativePrompt: "NSFW, nude, blurry, 3d, drawing, anime",
    model: "FLUX.1 [schnell] (8-bit)",
    loras: [
            { file: "AntiBlur v1.0 [dev]", weight: 0.4}
            ],
    configuration:
        {width:1152,height:896,steps:2,sampler:"EULER_A_TRAILING",guidanceScale:[2.5,4.5],separateClipL:true,
            clipLText:"Photograph, sensual, professional {cliptones}",resolutionDependentShift:true}
    },
    {
    label: "Schnell photo",
    prompt: "{camera} shot of a {cyborg}, {pose} in {weather} {time} {locale}",
    negativePrompt: "NSFW, nude, blurry, 3d, drawing, anime",
    model: "FLUX.1 [schnell] (8-bit)",
    loras: [
            { file: "AntiBlur v1.0 [dev]", weight: 0.4}
            ],
    configuration:
        {width:1152,height:896,steps:2,sampler:"EULER_A_TRAILING",guidanceScale:[2.5,4.5],separateClipL:true,
            clipLText:"Photograph, sensual, professional {cliptones}",resolutionDependentShift:true}
    },
    {
    label: "RVXL4.0 photo",
    prompt: "{camera} shot of a {cyborg}, {pose} in {weather} {time} {locale}",
    negativePrompt: "NSFW, nude, blurry, 3d, drawing, anime",
    model: "RealVisXL v4.0",
    loras: [
        { file: "Fix Hands Slider", weight: 0.3 },
        { file: "Pixel Art XL v1.1", weight: 0.4 }
    ],
    configuration:
        {width:1024,height:1024,steps:[28,20,32],sampler:"DPMPP_2M_KARRAS",guidanceScale:[2.5,4.5]}
    }
    
  // Add more prompt objects as needed
  // Empty file will be ignored
];

// Categories definition: This is where you add your dynamic categories.
const categories = {
  "cyborg": [
    "{adjective} cyborg man, {hairstyle} {haircolor} hair, {features}, wearing {malestyle}",
    "{adjective} cyborg woman, {hairstyle} {haircolor} hair, {features} wearing {style}"
  ],
  "time": [
    "morning",
    "noon",
    "night",
    "midnight",
    "sunset",
    "sunrise"
  ],
  "camera": [
    "full body",
    "medium",
    "close_up",
    "establishing"
  ],
  "locale": [
    "A neon-lit skyline with towering skyscrapers, holographic billboards flicker above rain-slicked streets where autonomous vehicles glide past crowds dressed in futuristic fashion.",
    "A neon-lit street pulses amidst towering skyscrapers with holographic ads, flanked by enigmatic alleys where rogue androids gather.",
    "A neon-lit alley pulses with holographic ads and shadowy figures navigating rain-drenched cobblestones beneath towering skyscrapers.",
    "A neon-lit bazaar thrives with life, dominated by towering holographic billboards and bustling vendors selling futuristic gadgets amid the hum of hover vehicles and shadowy figures exchanging encrypted data.",
    "An expansive cyberpunk metropolis illuminated by neon lights, featuring towering industrial edifices and bustling harbors shrouded in perpetual twilight.",
    "A vibrant riverside vista with skyscrapers casting holographic ads onto an artificial waterway, enveloped by relentless rain, capturing the dynamic spirit of a bustling cyberpunk metropolis.",
    "A sprawling cyberpunk metropolis bathes under the glow of neon lights, where towering skyscrapers and holographic billboards illuminate rain-drenched streets.",
    "A neon-lit rooftop overlooks an urban sprawl, with skyscrapers boasting holographic ads and drones navigating through smoggy skies.",
    "A neon-lit bridge spans over the rain-soaked metropolis, alive with holographic billboards and bustling autonomous vehicles.",
    "A neon-drenched urban expanse where towering holographic billboards dominate rain-slicked streets, alive with augmented reality ads and robotic vendors beneath a sky teeming with drones.",
    "A bustling neon-lit metropolis where skyscrapers glisten with holographic ads and rain-slick streets hum with hovercars navigating through crowded alleys.",
    "A vibrant neon-lit metropolis where towering skyscrapers and digital billboards cast an electric glow over the bustling, gritty streets awash with advanced technology.",
    "Under a rain-soaked neon-lit skyline, towering skyscrapers and digital advertisements illuminate bustling streets where autonomous vehicles navigate past rogue androids mingling with futuristic fashion crowds at the vibrant bazaar beneath holographic billboards.",
    "'A neon-drenched avenue buzzes with life beneath skyscrapers adorned with digital displays, where augmented reality ads blend seamlessly among futuristic fashionistas and rain-slicked streets pulse under towering buildings illuminated by holographic billboards amidst autonomous vehicles navigating through crowds in cybernetic attire.'",
    "A neon-lit plaza buzzes beneath towering skyscrapers, where holographic displays flicker over rain-slicked streets filled with autonomous vehicles and futuristic fashionistas.",
    "A neon-soaked boulevard thrums beneath towering skyscrapers and flickering holographic displays, where autonomous vehicles glide past avant-garde fashion-clad crowds on rain-drenched streets pulsing with life under glowing billboards; sleek hovercars weave through the futuristic cityscape adorned by cybernetic pedestrians.",
    "A neon-lit avenue beneath skyscrapers draped in digital displays pulses with energy, where augmented reality ads mingle among futuristic fashionistas on rain-slicked streets alive with the hum of autonomous vehicles weaving through crowds clad in cybernetic attire under a canopy of towering buildings and holographic billboards.",
    "A neon-drenched boulevard pulses beneath towering skyscrapers, alive with flickering holographic displays and sleek autonomous vehicles gliding past avant-garde crowds, while rain-slicked streets hum under glowing billboards where hovercars weave through futuristic cityscapes teeming with cybernetic pedestrians.",
    "A vibrant, rain-slicked skyline with towering skyscrapers and digital advertisements cast neon hues over bustling streets filled with autonomous vehicles; nearby illuminated alleys pulse beneath looming towers where rogue androids mingle among crowds dressed in futuristic fashion at a buzzing bazaar under holographic billboards.",
    "Neon lights bathe the rain-slicked streets beneath skyscrapers adorned with digital billboards and autonomous vehicles weaving through crowds clad in futuristic fashion, while holographic displays flicker above sleek hovercars gliding past cybernetic pedestrians in avant-garde attire."
  ],
  "weather": [
    "rainy",
    "smoggy",
    "stormy",
    "dusty"
  ],
  "adjective": [
    "beautiful",
    "moody",
    "cute",
    "tired",
    "injured",
    "cyborg",
    "muscular"
  ],
  "style": [
    "cyberpunk street",
    "dark gothic",
    "military armor",
    "elegant kimono",
    "eveningwear dress",
    "corpo uniform",
    "tech bodysuit"
  ],
  "hairstyle": [
    "long",
    "medium",
    "shaved",
    "short",
    "wet",
    "punk"
  ],
  "haircolor": [
    "red",
    "blonde",
    "colored",
    "brunette",
    "natural",
    "streaked"
  ],
  "colors": [
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
  "features": [
    "{colors} glowing cyborg eyes",
    "smoking",
    "tech brella with {colors} glowing accents",
    "cyborg arm",
    "cyborg legs",
    "optics implant",
    "tech goggles"
  ],
  "pose": [
    "action pose",
    "poses",
    "model pose",
    "relaxing",
    "sitting"
  ],
  "malestyle": [
    "leather",
    "denim",
    "silk"
  ],
  "cliptones": [
    "Shrouded in perpetual twilight",
    "Overtaken by an eerie, pulsing gloom",
    "Bathed in the glow of ominous neon",
    "A tapestry of light and cutting-edge innovation",
    "Where steel and circuitry meet the sky",
    "Pulsating with the rhythm of progress",
    "Scarred by the remnants of a forgotten era",
    "A labyrinth of rust and neglected dreams",
    "Shadows dance upon crumbling facades",
    "Electric with the buzz of underground resistance",
    "Graffiti-scarred walls whisper tales of defiance",
    "The underbelly of society, exposed and raw",
    "Veiled in a mist of intrigue and mystery",
    "Where neon illusions beckon the brave",
    "Secrets hide in every shadowy alleyway",
    "A kaleidoscope of chaos, sound, and fury",
    "Sensory overload in a sea of humanity",
    "The city's frenetic heartbeat is palpable",
    "Echoes of abandonment in empty streets",
    "Nature's slow reclaiming of forgotten zones",
    "Silence hangs heavy, punctuated by the wind"
  ]
};

//Version
const versionString = "v3.7.1";
//Maximum iterations for Iterate Mode, this is a good value for everything
//Macs with more resources can probably set this much higher
const maxIter = 500;

//store selected prompt data and UI config
let userPrompt = '';
let uiPrompt = '';
const UICONFIG = pipeline.configuration;

// UI
const categoryNames = Object.keys(categories).join(', ');
const seedOptions = ["Random","Increment","Static"];
const batchOptions=["1","2","3","4"];
const okButton = "Start";
const header = "Dynamic Prompts " + `${versionString}` + " by zanshinmu";
const aboutText = "Selects randomly from " + `${prompts.length} dynamic prompts`+
                  " located in the script's 'const prompts' object.";

const userSelection = requestFromUser("Dynamic Prompts", okButton, function() {
  return [
    this.section(header, aboutText, [
      this.section("Seed Mode", "", [this.segmented(1, seedOptions),
      this.slider(10, this.slider.fractional(0), 1, 2000, "render count")]),
      this.section("Batch Size", "", [this.segmented(0, batchOptions)]),
      this.section("Output:", "Output rendered images to custom location", [
        this.directory(`${filesystem.pictures.path}`)]),
      this.switch(false, "Enter UI Prompt"),
      this.switch(false, "Lock configuration"),
      this.switch(false, "Override Canvas"),
      this.switch(false, "Iterate Mode"),
      this.switch(true, "Download Models"),
      this.switch(false, "Debug")
    ])
  ];
});

// Parse UI input
const seedMode = userSelection[0][0][0];
const renderCount = userSelection[0][0][1];
const batchCount = userSelection[0][1][0]+1;
const outputDir = userSelection[0][2][0];
const useUiPrompt = userSelection[0][3];
const overrideModels = userSelection[0][4];
const overrideCanvas = userSelection[0][5];
const iterateMode = userSelection[0][6];
const downloadModels = userSelection[0][7];
const DEBUG = userSelection[0][8];

//Throw error if batch size > 1 with save to directory
if (batchCount > 1 && outputDir){
    throw new Error("Batch size over 1 is incompatible with save to directory.");
}

//DEBUG CLASS
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

if (iterateMode){
    console.log("Iterate Mode");
}

// Data for Canvas Override
const CANVAS_OVERRIDE = {
  "canvas": [
    {
      "pass": "2",
      "width": 768,
      "height": 768
    },
    {
      "pass": "1",
      "width": 960,
      "height": 768
    }
  ],
  "config": {
    "hrf": false,
    "strength": 0.42,
    "steps": 0
  }
};

if (overrideCanvas) {
     const userSelection = requestFromUser("Dynamic Prompts: Override Canvas", "Go!", function() {
         return [
                     this.section(
                                  "Hi-Res Fix",
                                  "Set 2nd pass resolution",
                                  [
                                  this.size(1280, 1024),
                                  this.switch(false, "HRF"),
                                  this.slider(.42, this.slider.percent, .01, 1, "strength"),
                                  ]
                                  ),
                     this.section(
                                  "1st pass resolution",
                                  "Set first pass resoltion",
                                  [
                                  this.size(768, 768)
                                  ]
                                  ),
                     this.section(
                                  "Set rendering steps",
                                  "Higher than 0 enables override",
                                  [
                                  this.slider(0, this.slider.fractional(0), 1, 150, "Steps")
                                  ]
                                  )
                 ];
     });
    CANVAS_OVERRIDE["canvas"][1].width = userSelection[1][0].width;
    CANVAS_OVERRIDE["canvas"][1].height = userSelection[1][0].height;
    CANVAS_OVERRIDE["canvas"][0].width = userSelection[0][0].width;
    CANVAS_OVERRIDE["canvas"][0].height = userSelection[0][0].height;
    CANVAS_OVERRIDE["config"].hrf = userSelection[0][1];
    CANVAS_OVERRIDE["config"].strength = userSelection[0][2];
    CANVAS_OVERRIDE["config"].steps = userSelection[2][0];
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
    for (let i = 0; i < renderCount; i++){
        let renderCountLog = `Rendering ${i + 1} of ${renderCount}`;
        console.warn(renderCountLog);
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
  // Get the randomly selected prompt object
  const selectedPrompt = prompts[randomIndex];
  if (typeof selectedPrompt.label !== 'undefined'){
      console.log(`Selected dynamic prompt ${randomIndex} of ${prompts.length}: '${selectedPrompt.label}'`);
  } else {
      console.log(`Selected dynamic prompt ${randomIndex} of ${prompts.length}`);
  }
  // Extract prompt string, LoRa filenames, and weights
  const myprompt = selectedPrompt.prompt;
  const myneg = selectedPrompt.negativePrompt;
  const mymodel = selectedPrompt.model;
  const loras = [];
  let myconfig = {};
  if (typeof selectedPrompt.configuration !== 'undefined'){
      myconfig = processDynConfig(selectedPrompt.configuration);
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

function dynamicClipText(config){
    if (typeof config.separateClipL !=='undefined' && config.separateClipL){
        if (typeof config.clipLText !=='undefined'){
            config.clipLText = replaceWildcards(config.clipLText, categories);
            debug.print(`Dynamic ClipL: ${config.clipLText}\n`);
        }
    }
    if (typeof config.separateOpenClipG !=='undefined' && config.separateOpenClipG){
        if (typeof config.openClipGText !=='undefined'){
            config.openClipGText = replaceWildcards(config.openClipGText, categories);
            debug.print(`Dynamic ClipG: ${config.openClipGText}\n`);
        }
    }
    return config;
}

function processDynConfig(config) {
  // Loop through each key-value pair in the configuration object
  for (const [key, value] of Object.entries(config)) {
    if (Array.isArray(value) && value.every(isNumeric)) { // Check if the value is a numeric array
      if (value.length === 2) { // Array with 2 elements: treat as range
        const [min, max] = value;
        
        // Validation for numeric range
        if (!isValidNumericRange(min, max)) {
          debug.print(`Invalid numeric range for '${key}': [${min}, ${max}]`);
          continue;
        }
        
        // Generate random value within the range, preserving type (int/float)
        const generatedValue = getRandomValueInRange(min, max);
        config[key] = generatedValue; // Replace array with the generated random value
      } else { // Array with 3 or more elements: select one randomly
        if (!value.every(isNumeric)) {
          debug.print(`Non-numeric values in array for '${key}': ${value}`);
          continue;
        }
        
        const selectedValue = value[Math.floor(Math.random() * value.length)];
        config[key] = selectedValue; // Replace array with the selected random value
      }
    }
  }
  return dynamicClipText(config); // Return the modified configuration object
}

// Helper function to validate if a value is numeric (int or float)
function isNumeric(value) {
  return typeof value === 'number' && !isNaN(value);
}

// Helper function to validate a numeric range (ensures both ends are numeric and min <= max)
function isValidNumericRange(min, max) {
  return isNumeric(min) && isNumeric(max) && min <= max;
}

// Helper function to generate a random value within a range, preserving the type (int/float)
function getRandomValueInRange(min, max) {
  if (Number.isInteger(min) && Number.isInteger(max)) { // Both ends are integers
    return Math.floor(Math.random() * (max - min + 1)) + min;
  } else { // Floats involved, generate a random float within the range, capped at 2 decimals
    return Math.round((Math.random() * (max - min) + min) * 100) / 100;
  }
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
        debug.print("Undefined Loras");
        return loras;
    }
    const FILESUFFIX = ".ckpt";
    const myLoras = [];
    for (let i = 0; i < loras.length; i++) {
        let myLora = loras[i];
        let myname = myLora.file;
        if (typeof myname === 'undefined'){
            debug.print("Empty LoRA", DebugPrint.Level.WARN);
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
function render (promptData, renderCount){
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
            finalConfiguration.sampler = resolveSampler(promptData.configuration.sampler);
            debug.print(finalConfiguration.model);
        }
    }
    finalConfiguration.batchSize = batchCount;
    finalConfiguration.seed = mySeed;
    
    if (overrideCanvas){
        finalConfiguration = canvasOverride(finalConfiguration);
    }
    
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
    savetoImageDir(finalConfiguration, renderCount);
}

function canvasOverride(finalConfiguration){
    if (CANVAS_OVERRIDE["config"].steps){
        finalConfiguration.steps = CANVAS_OVERRIDE["config"].steps;
    }
    finalConfiguration.hiresFixStrength = CANVAS_OVERRIDE["config"].strength;
    finalConfiguration.hiresFix = CANVAS_OVERRIDE["config"].hrf;
    finalConfiguration.height = CANVAS_OVERRIDE["canvas"][0].height;
    finalConfiguration.width = CANVAS_OVERRIDE["canvas"][0].width;
    finalConfiguration.hiresFixHeight = CANVAS_OVERRIDE["canvas"][1].height;
    finalConfiguration.hiresFixWidth = CANVAS_OVERRIDE["canvas"][1].width;
    debug.print(`Canvas Override: ${JSON.stringify(CANVAS_OVERRIDE)}\n`);
    console.log("Canvas Override Active\n");
    return finalConfiguration;
}

function savetoImageDir(config, renderCount){
    if(outputDir && batchCount > 1) {
            //BatchSize 1 is normal, save just the image
            saveImage(config, renderCount);
        }
    // The workaround implementation was a failure
}

function resolveSampler(sampler){
    if (Number.isInteger(sampler) && sampler >= 0 && sampler < Object.keys(SamplerType).length ) {
            const samplerString = Object.keys(SamplerType).find(key => SamplerType[key] === sampler);
            debug.print(`Sampler ${sampler} resolved to: ${samplerString}`);
            return sampler; //
        } else if (typeof sampler === 'string') {
            // Handle string case
            const index = SamplerType[sampler.toUpperCase()];
            debug.print(`Sampler ${sampler} resolved to: ${index}`);
            return index;
        } else {
            debug.print("Error: sampler not resolved");
            return undefined;
        }
}

function saveImage(config, renderCount){
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
    const savePath = `${outputDir}/${model}_${sampler}_${steps}_${time}_${renderCount}.png`
    console.log(`Saving to ${savePath}\n\n`);
    canvas.saveImage(savePath, true); // save the image currently on canvas to a file.
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
