const userSelection = requestFromUser("Change background", "Start", function() {
  return [
    this.section(
	    "Original Image", "Image you want to change background",
	    [
	      this.imageField("Add images..."),
	    ]
    ),
	this.section(
	    "Reference Image", "Image you want to inspire the new background",
	    [
	      this.imageField("Add images..."),
	    ]
    )                    
  ];
});

const imageSrc = userSelection[0][0]
const referenceImageSrc = userSelection[1][0]

if (imageSrc.length > 0 && referenceImageSrc.length > 0) {
  canvas.clear()
  canvas.clearMoodboard()
  canvas.loadImageSrc(imageSrc);
  canvas.loadMoodboardFromSrc(referenceImageSrc);

  const imageMetadata = new ImageMetadata(userSelection[0])

  configuration = pipeline.configuration

  const zoom = Math.min(imageMetadata.width / configuration.width, imageMetadata.height / configuration.height);

  canvas.canvasZoom = zoom

  const x = (imageMetadata.width - configuration.width) / 2 / zoom
  const y = (imageMetadata.height - configuration.height) / 2 / zoom

  canvas.moveCanvas(x, y)

  configuration.width = imageMetadata.width
  configuration.height = imageMetadata.height

  canvas.updateCanvasSize(configuration)

  configuration.strength = 1;
  configuration.seed = -1;

  console.log("Change Background");
  pipeline.downloadBuiltins(["juggernaut_reborn_f16.ckpt", "ip_adapter_plus_sd_v1.x_open_clip_h14_f16.ckpt", "controlnet_depth_1.x_v1.1_f16.ckpt", "is_net_v1.1_fp16.ckpt"]);
  configuration.model = "juggernaut_reborn_f16.ckpt";

  const backgroundMask = canvas.backgroundMask;
  canvas.loadMaskFromSrc(backgroundMask.src)

  canvas.extractDepthMap();
  depthMapControl = pipeline.findControlByName("Depth Map (SD v1.x, ControlNet 1.1)");
  depthMapControl.weight = 1;
  depthMapControl.guidanceEnd = 0.6;

  ipAdapterControl = pipeline.findControlByName("IP Adapter Plus (SD v1.x)");
  ipAdapterControl.weight = 1;
  ipAdapterControl.guidanceEnd = 0.6;

  configuration.controls = [depthMapControl, ipAdapterControl];
  pipeline.run({ configuration: configuration, prompt: "a (cosmetic product: 0.8) photograph, high quality, highly detailed, 4k, cinematic, ((product shoot beautiful)), product at center", mask:backgroundMask });

} else {
  
	console.error("Background change Script need to original image and reference image as inputs")
}
