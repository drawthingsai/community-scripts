//@api-1.0
// parameters
// steps to run the model
const STEPS = 8;
// how closely the generation should adhere to prompt
const TEXT_GUIDANCE_SCALE = 5;
const SAMPLER = SamplerType.TCD;

// script
const userSelection = requestFromUser("Make a Wallpaper", "", function () {
  return [
    this.section("What", "", [
      this.comboBox("Serene mountain landscape", [
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
      ]),
    ]),
    this.section("Who", "", [
      this.comboBox("No people, just nature",
        ["No people, just nature",
          "Silhouettes of people",
          "Lone ethereal fairy",
          "Couple walking hand in hand",
          "Children playing",
          "Mermaids and sea creatures",
          "Customers and staff",
          "Astronauts and scientists",
          "Knights and dragons",
          "A lone traveler with a camel"
        ]),
    ]),
    this.section("Where", "", [
      this.comboBox("Swiss Alps", [
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
      ]),
    ]),
    this.section("When", "", [
      this.comboBox("Early morning", [
        "Early morning",
        "Dusk",
        "Twilight",
        "Midday",
        "Nighttime",
        "Sunrise",
        "Golden hour"
      ]),
    ]),

    this.section("Describe the scene", "", [
      this.comboBox("Snow-capped peaks, reflective lake, wildflowers, warm dawn hues",
        ["Snow-capped peaks, reflective lake, wildflowers, warm dawn hues",
          "Towering skyscrapers, neon lights, flying vehicles, warm sunset glow",
          "Ancient trees, bioluminescent plants, glowing fairy, twilight hues",
          "White sand, crystal-clear waters, palm trees, golden sunset glow",
          "Lush greenery, colorful flowers, sparkling fountain, bright sunlight",
          "Ancient ruins, bioluminescent plants, glowing city lights",
          "Classic cars, neon signs, chrome accents, checkered floors",
          "Panoramic Earth view, stars, futuristic technology",
          "Majestic castle, lush greenery, mystical creatures",
          "Rolling dunes, vibrant sunset, long shadows, warm tones"
        ]),
    ]),

    this.section("Describe the art style", "", [
      this.comboBox("Hyper-realistic, vivid colors, fine details",
        ["Hyper-realistic, vivid colors, fine details",
          "Cyberpunk, neon lighting, high contrast",
          "Fantasy, magical, dreamlike quality",
          "Impressionist, soft brushstrokes, warm colors",
          "Storybook illustration, rich details, playful vibe",
          "Fantasy, vibrant, detailed",
          "Vintage, nostalgic, colorful",
          "Sci-fi, futuristic, awe-inspiring",
          "Epic, magical, rich in detail",
          "Photorealistic, serene, atmospheric"
        ]),
    ])]
});
canvas.clear();
canvas.canvasZoom = 1
const configuration = pipeline.configuration;
const size = device.screenSize;
configuration.width = size.width * 2;
configuration.height = size.height * 2;
configuration.tiledDecoding = true;
canvas.updateCanvasSize(configuration);
configuration.steps = STEPS;
configuration.guidanceScale = TEXT_GUIDANCE_SCALE;
configuration.strength = 1;
configuration.controls = [];
canvas.clearMoodboard();
moodboardSrc = userSelection[1];
configuration.sampler = SAMPLER;
pipeline.downloadBuiltins(["kwai_kolors_1.0_q6p_q8p.ckpt", "hyper_sdxl_8_step_lora_f16.ckpt", "realesrgan_x2plus_f16.ckpt"]);
configuration.model = "kwai_kolors_1.0_q6p_q8p.ckpt";
configuration.loras = [{ "file": "hyper_sdxl_8_step_lora_f16.ckpt", "weight": 0.85 }];
// upscaled to 2x the original size
configuration.upscaler = "Real-ESRGAN X2+";
pipeline.run({
  configuration: configuration, prompt: userSelection.join(", ")
});
