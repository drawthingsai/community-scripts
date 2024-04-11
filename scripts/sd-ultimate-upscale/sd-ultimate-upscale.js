//@api-1.0
//
// "Scripts" is a way to enhance Draw Things experience with custom JavaScript snippets. Over time,
// we will enhance Scripts with more APIs and do neccessary modifications on the said APIs, but we
// will also keep the API stable. In particular, you can mark your script with a particular API
// version and it will make sure we use the proper API toolchain to execute the script even in
// the future some of the APIs changed.
//
// Existing APIs:
//
// We currently provides three global objects for you to interact with: `canvas`, `pipeline` and `filesystem`.
//
// `canvas` is the object to manipulate the existing infinite canvas on Draw Things interface. It
// supports the following methods:
//
// `canvas.boundingBox`: return the bounding box of existing images collectively on the canvas.
// `canvas.clear()`: remove all images on the canvas, same effect as you tap on the "New Canvas" button.
// `canvas.createMask(width, height, value)`: create a mask with a given size and fill-in value.
// `canvas.currentMask`: return the current mask on the view, you can further manipulate the mask through `Mask` APIs.
// `canvas.loadImage(file)`: load image from a file (a path).
// `canvas.moveCanvas(left, top)`: move the canvas to a particular coordinate, these coordinates work as if the zoom scale is 1x.
// `canvas.saveImage(file, visibleRegionOnly)`: save the image currently on canvas to a file.
// `canvas.canvasZoom`: Set / get the zoom scale of the canvas.
// `canvas.topLeftCorner`: return the coordinate the canvas currently at, these coordinates work as if the zoom scale is 1x.
// `canvas.updateCanvasSize(configuration)`: extract the size from configuration object and then sync the canvas with that size.
//
// `pipeline` is the object to run the image generation pipeline. It supports the following methods:
//
// `pipeline.configuration`: extract the current configuration, whether it is on screen or after pipeline.run.
// `pipeline.findControlByName(name)`: using the display name to find a particular control.
// `pipeline.findLoRAByName(name)`: using the display name to find a particular LoRA.
// `pipeline.prompts`: return prompt and negativePrompt currently on the screen.
// `pipeline.run({prompt: null, negativePrompt: null, configuration: configuration, mask: null})`: run image generation through
// this API. You can optionally provides prompt / negativePrompt, or it can take prompt from the screen. mask can be provided
// optionally too and sometimes it can be helpful.
//
// `filesystem` provides a simple access to the underlying file system. Note that Draw Things is
// sandboxed so we can only have access to particular directories within the user file system.
//
// `filesystem.pictures.path`: get the path of the pictures folder. It is the system Pictures folder on macOS, and a Pictures
// folder under Draw Things within Files app for iOS / iPadOS.
// `filesystem.pictures.readEntries`: enumerate all the files under the pictures folder.
//
// This script upscales the original image to 512x512 tiles and fixes the seams.
// This script assumes the original image is at 1x zoom level.
// The configuration parameters in this script may need tuning to improve final image.
// Author: @Gooster

const USE_UPSCALER = "Real-ESRGAN X2+";
const UPSCALE_FACTOR = 2;

const TILE_STRENGTH = 0.7;
const INPAINTING_STRENGTH = 0.7;
const MASK_BLUR = 6;
const MIN_OVERLAP = 48;
const TILE_SIZE = 512;

const configuration = pipeline.configuration;
configuration.maskBlur = MASK_BLUR;

const imageRect = canvas.boundingBox;

// initial upscale
canvas.canvasZoom = 1;
if (USE_UPSCALER) {
  pipeline.downloadBuiltin(USE_UPSCALER);
  configuration.strength = 0;
  configuration.upscaler = USE_UPSCALER;
  canvas.moveCanvas(imageRect.x, imageRect.y);
  // generate the upscaled image
  pipeline.run({ configuration: configuration });
}
pipeline.downloadBuiltin("controlnet_tile_1.x_v1.1_f16.ckpt");
pipeline.downloadBuiltin("controlnet_inpaint_1.x_v1.1_f16.ckpt");
// tiling over the image to upscale
configuration.strength = TILE_STRENGTH;
tiledUpscale(configuration, imageRect, UPSCALE_FACTOR);
canvas.moveCanvas(imageRect.x, imageRect.y);
canvas.canvasZoom = 1;

// tiled upscale support integer zoom levels
function tiledUpscale(configuration, imageRect, zoom) {
  const minOverlap = MIN_OVERLAP;
  // set zoom level and reconfigure the canvas dimensions to tile size
  configuration.upscaler = null;
  configuration.width = configuration.height = TILE_SIZE;
  canvas.updateCanvasSize(configuration);
  canvas.canvasZoom = zoom;
  canvas.moveCanvas(imageRect.x, imageRect.y);
  const numTiles = {
    x: imageRect.width * zoom / configuration.width,
    y: imageRect.height * zoom / configuration.height
  }
  const tileSize = Math.floor(imageRect.width / numTiles.x)
  numTiles.x = Math.ceil(numTiles.x + (minOverlap * (numTiles.x - 1)) / configuration.width)
  numTiles.y = Math.ceil(numTiles.y + (minOverlap * (numTiles.y - 1)) / configuration.height)
  console.log(`Number of tiles: ${numTiles.x * numTiles.y}`);
  canvas.moveCanvas(imageRect.x, imageRect.y);
  const generatedRows = [];
  let previousCoordinates = { x: imageRect.x, y: imageRect.y };
  let currentCoordinates = previousCoordinates;

  // tiling over the image
  for (let y = 0; y < numTiles.y; y++) {
    let currentRow = new Rectangle(0, 0, 0, 0)
    for (let x = 0; x < numTiles.x; x++) {
      // restore tile control and strength for each tile
      const tileControl = pipeline.findControlByName("Tile (SD v1.x, ControlNet 1.1)");
      configuration.controls = [tileControl];
      configuration.strength = TILE_STRENGTH;
      currentCoordinates = {
        x: imageRect.x + Math.floor(x * (tileSize - minOverlap)),
        y: imageRect.y + Math.floor(y * (tileSize - minOverlap))
      };
      if (x == 0) {
        currentRow.x = currentCoordinates.x;
        currentRow.y = currentCoordinates.y;
      }
      // the last tile should match the x, y edge of the image
      if (x == numTiles.x - 1) currentCoordinates.x = imageRect.x + imageRect.width - tileSize;
      if (y == numTiles.y - 1) currentCoordinates.y = imageRect.y + imageRect.height - tileSize;
      console.log(`Upscaling tile ${x + y * numTiles.x} of ${numTiles.x * numTiles.y}`);
      // add mask for tiles other than the first
      let mask = new Rectangle(currentCoordinates.x, currentCoordinates.y, tileSize, tileSize);
      if (x != 0) {
        // exclude the current row
        mask = mask.exclude(currentRow);
      }
      if (y != 0) {
        // exclude the row above
        mask = mask.exclude(generatedRows[y - 1]);
      }
      // convert mask coordinate to tile local coordinates
      mask.x -= currentCoordinates.x;
      mask.y -= currentCoordinates.y;
      mask.scale(configuration.width / tileSize);
      // ensure mask is the same size as the configuration
      const generateRegion = canvas.createMask(configuration.width, configuration.height, 0);
      generateRegion.fillRectangle(
        mask.x,
        mask.y,
        mask.width,
        mask.height, 2);
      canvas.moveCanvas(currentCoordinates.x, currentCoordinates.y)
      pipeline.run({ configuration: configuration, mask: generateRegion });
      // seams are created at the right and bottom edge of each previous tile we can fix the seam at the next tile generation
      configuration.strength = INPAINTING_STRENGTH;
      const inpaintControl = pipeline.findControlByName("Inpainting (SD v1.x, ControlNet 1.1)");
      configuration.controls = [inpaintControl];
      const inpaintRegion = canvas.createMask(configuration.width, configuration.height, 0);
      let edgePolisher = 5;
      if (y > 0) {
        // after the first row always fill the previous row's bottom edge
        edgePolisher = x === 0 ? 0 : 5;
        const inpaintRect = new Rectangle(
          edgePolisher,
          mask.y - Math.floor(minOverlap / 2),
          configuration.width - edgePolisher,
          minOverlap);
        inpaintRegion.fillRectangle(
          inpaintRect.x,
          inpaintRect.y,
          inpaintRect.width,
          inpaintRect.height,
          2
        )
      }
      if (x > 0) {
        edgePolisher = y === 0 ? 0 : 5;
        const inpaintRect = new Rectangle(
          mask.x - Math.floor(minOverlap / 2),
          edgePolisher,
          minOverlap,
          configuration.height - edgePolisher);
        inpaintRegion.fillRectangle(
          inpaintRect.x,
          inpaintRect.y,
          inpaintRect.width,
          inpaintRect.height,
          2
        )
      }
      // skip over the first tile that doesn't have seams yet
      canvas.moveCanvas(currentCoordinates.x, currentCoordinates.y)
      if (x != 0 || y != 0) {
        console.log(`Inpainting seams on tile ${x + y * numTiles.x} of ${numTiles.x * numTiles.y}`);
        pipeline.run({ configuration: configuration, mask: inpaintRegion });
      }
      previousCoordinates = currentCoordinates;
      currentRow = Rectangle.union(currentRow, new Rectangle(currentCoordinates.x, currentCoordinates.y, tileSize, tileSize));
    }
    generatedRows.push(currentRow);
  }
}
