
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

const modelScale = 16
const ratio = canvas.boundingBox.width / canvas.boundingBox.height;
const bestFitValue = bestFitRatio(ratio);
configuration = pipeline.configuration
if (bestFitValue < 1) {
  configuration.width = Math.round(modelScale * bestFitValue) * 64
  configuration.height = 1024
} else {
  configuration.width = 1024 
  configuration.height = Math.round(modelScale / bestFitValue) * 64
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

console.log("Change clothes");
pipeline.downloadBuiltins(["vton_f16.ckpt", "garm_f16.ckpt"]);
configuration.model = "vton_f16.ckpt";

const backgroundMask = canvas.bodyMask(["upper"], true);
canvas.loadMaskFromSrc(backgroundMask.src)

ootdControl = pipeline.findControlByName("OOTD Garm (SD v1.x)");
ootdControl.weight = 1;
ootdControl.guidanceEnd = 0.6;
configuration.guidanceScale = 2.0;
configuration.sampler = 0;
configuration.preserveOriginalAfterInpaint = false;
configuration.hiresFix = false;
configuration.controls = [ootdControl];
pipeline.run({ configuration: configuration, prompt: "", mask:backgroundMask });