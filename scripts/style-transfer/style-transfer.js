//@api-1.0
// This is an image to image script so reference image should be loaded at userSelection time
const styleChoices = ["Oil Painting", "Cartoon", "Anime", "Pixel Art"];
const userSelection = requestFromUser("Style Transfer Parameters", "", function () {
  return [
    this.section("Styles", "Selecting a value will apply the style to reference image", [
      this.menu(0, styleChoices),
    ]),
  ]
});
let moodboardSrc = canvas.saveImageSrc(true);
const configuration = pipeline.configuration;
configuration.strength = 0.7;
configuration.loras = [];
configuration.controls = [];
canvas.clearMoodboard();
let assistivePrompts = ["african american, highres, detailed, 4k", "highres, detailed, 4k"]
let CLIPScores = canvas.CLIP(assistivePrompts);
const maxIndex = CLIPScores.reduce((maxIdx, currentValue, currentIndex, arr) => {
  return currentValue > arr[maxIdx] ? currentIndex : maxIdx;
}, 0);

switch (userSelection[0][0]) {
  // SD
  case 0:
    console.log(styleChoices[0] + " selected");
    pipeline.downloadBuiltins(["oilpainting_oilpaintingv10_f16.ckpt", "ip_adapter_plus_face_sd_v1.x_open_clip_h14_f16.ckpt", "controlnet_depth_1.x_v1.1_f16.ckpt"]);
    configuration.model = "oilpainting_oilpaintingv10_f16.ckpt";
    canvas.extractDepthMap();
    depthMapControl = pipeline.findControlByName("Depth Map (SD v1.x, ControlNet 1.1)");
    depthMapControl.weight = 0.9;
    ipAdapterControl = pipeline.findControlByName("IP Adapter Plus Face (SD v1.x)");
    ipAdapterControl.weight = 0.9;
    ipAdapterControl.guidanceEnd = 0.7;
    canvas.loadMoodboardFromSrc(moodboardSrc);
    configuration.controls = [depthMapControl, ipAdapterControl];
    pipeline.run({ configuration: configuration, prompt: assistivePrompts[maxIndex] });
    break;
  // disney
  case 1:
    console.log(styleChoices[1] + " selected");
    pipeline.downloadBuiltins(["disney_pixar_cartoon_type_b_q6p_q8p.ckpt", "ip_adapter_plus_face_sd_v1.x_open_clip_h14_f16.ckpt", "controlnet_depth_1.x_v1.1_f16.ckpt"]);
    configuration.model = "disney_pixar_cartoon_type_b_q6p_q8p.ckpt";
    canvas.extractDepthMap();
    depthMapControl = pipeline.findControlByName("Depth Map (SD v1.x, ControlNet 1.1)");
    depthMapControl.weight = 1;
    ipAdapterControl = pipeline.findControlByName("IP Adapter Plus Face (SD v1.x)");
    ipAdapterControl.weight = 0.7;
    ipAdapterControl.guidanceEnd = 0.6;
    canvas.loadMoodboardFromSrc(moodboardSrc);
    configuration.controls = [depthMapControl, ipAdapterControl];
    pipeline.run({ configuration: configuration, prompt: assistivePrompts[maxIndex] });
    break;
  // rev animated
  case 2:
    console.log(styleChoices[2] + " selected");
    pipeline.downloadBuiltins(["rev_animated_v1.22_q6p_q8p.ckpt", "ip_adapter_plus_face_sd_v1.x_open_clip_h14_f16.ckpt", "controlnet_depth_1.x_v1.1_f16.ckpt"]);
    configuration.model = "rev_animated_v1.22_q6p_q8p.ckpt";
    canvas.extractDepthMap();
    depthMapControl = pipeline.findControlByName("Depth Map (SD v1.x, ControlNet 1.1)");
    depthMapControl.weight = 1;
    ipAdapterControl = pipeline.findControlByName("IP Adapter Plus Face (SD v1.x)");
    ipAdapterControl.weight = 1;
    ipAdapterControl.guidanceEnd = 0.6;
    canvas.loadMoodboardFromSrc(moodboardSrc);
    configuration.controls = [depthMapControl, ipAdapterControl];
    pipeline.run({ configuration: configuration, prompt: assistivePrompts[maxIndex] });
    break;
  // pixel art
  case 3:
    console.log(styleChoices[3] + " selected");
    pipeline.downloadBuiltins(["juggernaut_xl_v9_q6p_q8p.ckpt", "pixel_art_xl_v1.1_lora_f16.ckpt", "ip_adapter_plus_face_xl_base_open_clip_h14_f16.ckpt", "controlnet_depth_sdxl_v1.0_mid_f16.ckpt"]);
    configuration.model = "juggernaut_xl_v9_q6p_q8p.ckpt";
    canvas.extractDepthMap();
    depthMapControl = pipeline.findControlByName("Depth Map (SDXL, ControlNet, Diffusers 1.0 Mid)");
    depthMapControl.weight = 1;
    ipAdapterControl = pipeline.findControlByName("IP Adapter Plus Face (SDXL Base)");
    ipAdapterControl.weight = 1;
    ipAdapterControl.guidanceEnd = 0.6;
    canvas.loadMoodboardFromSrc(moodboardSrc);
    lora = pipeline.findLoRAByName("Pixel Art XL v1.1");
    lora.weight = 1.65
    configuration.loras = [lora]
    configuration.controls = [depthMapControl, ipAdapterControl];
    pipeline.run({ configuration: configuration, prompt: assistivePrompts[maxIndex] });
    break;

  default:
    console.log("Unknown selection");
}
console.log("Generation Completed");