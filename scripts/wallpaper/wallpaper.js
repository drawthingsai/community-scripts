
const what = [
  "Serene mountain landscape",
  "Futuristic cityscape",
  "Enchanted forest",
  "Serene beach",
  "Whimsical garden",
  "Mystical underwater city",
  "Vintage 1950s diner",
  "Space station overlooking Earth",
  "Medieval fantasy castle",
  "Sunset over desert dunes"
];

const randomWhat = what[Math.floor(Math.random() * what.length)];

const who = [
  "No people, just nature",
  "Silhouettes of people",
  "Lone ethereal fairy",
  "Couple walking hand in hand",
  "Children playing",
  "Mermaids and sea creatures",
  "Customers and staff",
  "Astronauts and scientists",
  "Knights and dragons",
  "A lone traveler with a camel"
];

const randomWho = who[Math.floor(Math.random() * who.length)];

const where = [
  "Swiss Alps",
  "Bustling metropolis",
  "Mystical woodland",
  "Tropical island",
  "Hidden garden in old castle",
  "Ocean depths",
  "Retro American diner",
  "Low Earth orbit",
  "Enchanted forest",
  "Sahara desert"
];

const randomWhere = where[Math.floor(Math.random() * where.length)];

const when = [
  "Early morning",
  "Dusk",
  "Twilight",
  "Midday",
  "Nighttime",
  "Sunrise",
  "Golden hour"
];

const randomWhen = when[Math.floor(Math.random() * when.length)];

const scene = [
  "Snow-capped peaks, reflective lake, wildflowers, warm dawn hues",
  "Towering skyscrapers, neon lights, flying vehicles, warm sunset glow",
  "Ancient trees, bioluminescent plants, glowing fairy, twilight hues",
  "White sand, crystal-clear waters, palm trees, golden sunset glow",
  "Lush greenery, colorful flowers, sparkling fountain, bright sunlight",
  "Ancient ruins, bioluminescent plants, glowing city lights",
  "Classic cars, neon signs, chrome accents, checkered floors",
  "Panoramic Earth view, stars, futuristic technology",
  "Majestic castle, lush greenery, mystical creatures",
  "Rolling dunes, vibrant sunset, long shadows, warm tones"
];

const randomScene = scene[Math.floor(Math.random() * scene.length)];

const artStyle = [
  "Hyper-realistic, vivid colors, fine details",
  "Cyberpunk, neon lighting, high contrast",
  "Fantasy, magical, dreamlike quality",
  "Impressionist, soft brushstrokes, warm colors",
  "Storybook illustration, rich details, playful vibe",
  "Fantasy, vibrant, detailed",
  "Vintage, nostalgic, colorful",
  "Sci-fi, futuristic, awe-inspiring",
  "Epic, magical, rich in detail",
  "Photorealistic, serene, atmospheric"
];

const randomArtStyle = artStyle[Math.floor(Math.random() * artStyle.length)];

const userSelection = requestFromUser("Make a Wallpaper", "", function () {
  return [
    this.section("What", "", [
      this.comboBox(randomWhat, what)
    ]),
    this.section("Who", "", [
      this.comboBox(randomWho, who)
    ]),
    this.section("Where", "", [
      this.comboBox(randomWhere, where)
    ]),
    this.section("When", "", [
      this.comboBox(randomWhen, when)
    ]),

    this.section("Scene", "", [
      this.comboBox(randomScene, scene)
    ]),

    this.section("Art Style", "", [
      this.comboBox(randomArtStyle, artStyle)
    ])]
});

canvas.clear();
canvas.canvasZoom = 1
const configuration = pipeline.configuration;
/*
const size = device.screenSize;
configuration.width = size.width;
configuration.height = size.height;
canvas.updateCanvasSize(configuration);
*/
configuration.steps = 6;
configuration.guidanceScale = 1;
configuration.strength = 1;
configuration.controls = [];
configuration.sampler = SamplerType.EULER_A_TRAILING;

// Set all relevant options.
configuration.preserveOriginalAfterInpaint = true;
configuration.faceRestoration = null;
configuration.batchSize = 1;
configuration.batchCount = 1;
// configuration.hiresFix = false;
configuration.clipSkip = 2;
configuration.shift = 1;
configuration.refinerModel = null;
configuration.tiledDiffusion = false;
configuration.tiledDecoding = true;
configuration.decodingTileWidth = 768;
configuration.decodingTileHeight = 768;
configuration.diffusionTileOverlap = 128;
configuration.sharpness = 0;
configuration.zeroNegativePrompt = false;
configuration.cropLeft = 0;
configuration.cropTop = 0;
configuration.originalImageHeight = configuration.height;
configuration.originalImageWidth = configuration.width;
configuration.targetImageHeight = configuration.height;
configuration.targetImageWidth = configuration.width;
configuration.negativeOriginalImageHeight = Math.max(Math.floor(configuration.height / 128) * 64, 512);
configuration.negativeOriginalImageWidth = Math.max(Math.floor(configuration.width / 128) * 64, 512);

configuration.seed = -1;

pipeline.downloadBuiltins(["kwai_kolors_1.0_q6p_q8p.ckpt", "hyper_sdxl_8_step_lora_f16.ckpt", "dmd2_sdxl_4_step_lora_f16.ckpt"]);

configuration.model = "kwai_kolors_1.0_q6p_q8p.ckpt";
configuration.loras = [{ "file": "hyper_sdxl_8_step_lora_f16.ckpt", "weight": 0.45 }, { "file": "dmd2_sdxl_4_step_lora_f16.ckpt", "weight": 0.25 }];

pipeline.run({
  configuration: configuration, prompt: userSelection.join(", "), negativePrompt: ""
});
