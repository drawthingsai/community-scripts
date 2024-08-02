
const ratios = {
  oneToOne: 1,
  oneToTwo: 1 / 2,
  twoToThree: 2 / 3,
  fourToFive: 4 / 5,
  fiveToFour: 5 / 4,
  threeToFour: 3 / 4,
  fourToThree: 4 / 3,
  threeToTwo: 3 / 2,
  twoToOne: 2 / 1
};

function bestFitRatio(inputRatio) {
  let closestMatchValue = null;
  let smallestDifference = Infinity;

  for (const value of Object.values(ratios)) {
    const difference = Math.abs(inputRatio - value);
    if (difference < smallestDifference) {
      smallestDifference = difference;
      closestMatchValue = value;
    }
  }
  return closestMatchValue;
}

const ratio = canvas.boundingBox.width / canvas.boundingBox.height;
const bestFitValue = bestFitRatio(ratio);
configuration = pipeline.configuration
if (bestFitValue < 1) {
  configuration.width = Math.round(8 * bestFitValue) * 64
  configuration.height = 512
} else {
  configuration.width = 512 
  configuration.height = Math.round(8 / bestFitValue) * 64
}

canvas.updateCanvasSize(configuration)
zoom = configuration.width / canvas.boundingBox.width
canvas.canvasZoom = zoom
console.log(bestFitValue)
if (bestFitValue < 1) {
  let x = ((canvas.boundingBox.width * zoom - configuration.width) / 2 )/ zoom
  canvas.moveCanvas(x, 0)
} else {
  let y = ((canvas.boundingBox.height * zoom - configuration.height) / 2 )/ zoom
  canvas.moveCanvas(0, y)
}


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