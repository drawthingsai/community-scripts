//@api-1.0

const userSelection = requestFromUser("User Selection", "", function() {
  return [
    this.section("Upscale Factor", "This determines many times we should upscale the image. For example, 400% requires us to upscale the image twice.", [
      this.segmented(1, ["200%", "400%"])
    ])
  ];
});

const configuration = pipeline.configuration;

pipeline.downloadBuiltins(["4x_ultrasharp_f16.ckpt"]);

configuration.strength = 0;
configuration.upscaler = "4x UltraSharp";
pipeline.run({configuration: configuration});

const tileSrc = canvas.saveImageSrc(true);

pipeline.downloadBuiltins(["controlnet_tile_1.x_v1.1_f16.ckpt", "juggernaut_reborn_q6p_q8p.ckpt", "add_more_details__detail_enhancer___tweaker__lora_f16.ckpt", "sdxl_render_v2.0_lora_f16.ckpt", "tcd_sd_v1.5_lora_f16.ckpt"]);

const imageRect = canvas.boundingBox;

const baseZoom = canvas.canvasZoom;

configuration.width = configuration.width * 2;
configuration.height = configuration.height * 2;
canvas.updateCanvasSize(configuration);
canvas.canvasZoom = baseZoom * 2;
canvas.moveCanvas(imageRect.x, imageRect.y);

configuration.steps = 8;
configuration.tiledDecoding = true;
configuration.decodingTileWidth = 1024;
configuration.decodingTileHeight = 1024;
configuration.decodingTileOverlap = 128;
configuration.tiledDiffusion = true;
configuration.diffusionTileWidth = 1024;
configuration.diffusionTileHeight = 1024;
configuration.diffusionTileOverlap = 128;
configuration.sampler = SamplerType.TCD;
configuration.stochasticSamplingGamma = 0.3;
configuration.upscaler = null;
configuration.preserveOriginalAfterInpaint = true;
configuration.faceRestoration = null;
configuration.batchSize = 1;
configuration.batchCount = 1;
configuration.hiresFix = false;
configuration.clipSkip = 1;
configuration.shift = 1;
configuration.refinerModel = null;
configuration.sharpness = 0;
configuration.zeroNegativePrompt = false;

configuration.model = "juggernaut_reborn_q6p_q8p.ckpt";
configuration.strength = 0.4;
configuration.loras = [{"file": "add_more_details__detail_enhancer___tweaker__lora_f16.ckpt", "weight": 0.6}, {"file": "sdxl_render_v2.0_lora_f16.ckpt", "weight": 1}, {"file": "tcd_sd_v1.5_lora_f16.ckpt", "weight": 1}];
const tile = pipeline.findControlByName("Tile (SD v1.x, ControlNet 1.1)");
tile.weight = 0.5;
configuration.controls = [tile];

pipeline.run({configuration: configuration, prompt: "masterpiece, best quality, highres"});

if (userSelection[0] > 0) { // This allows us to upscale again to 400%.
  configuration.width = configuration.width * 2;
  configuration.height = configuration.height * 2;
  canvas.updateCanvasSize(configuration);
  canvas.canvasZoom = baseZoom * 4;
  canvas.moveCanvas(imageRect.x, imageRect.y);

  canvas.loadCustomLayerFromSrc(tileSrc);

  pipeline.run({configuration: configuration, prompt: "masterpiece, best quality, highres"});
}
