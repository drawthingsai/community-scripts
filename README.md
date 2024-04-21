# Community Scripts

This repository maintains the source material and publish mechanism for "Community Scripts" section of Scripts in the Draw Things app.

# How to Contribute

You are welcome to put up Pull Requests to add new scripts to the "Community Scripts" section within the app. To add a new script, first create a directory under `./scripts` and add the following files:

 1. add LICENSE (optional);

 2. add the js file;

 3. Add a `metadata.json` file that contains the metadata including name and other information. If metadata.json is not provided, the default metadata will be generated based on the name of the js file.

Example metadata.json
 ```javascript
 {
  "name": "SD Ultimate Upscale",
  "author": "",
  "file": "sd-ultimate-upscale.js",
  "description": "Generate high-quality, high-resolution images from low-resolution inputs, while preserving fine details and textures."
}
 ```

The `scripts.txt` file at the top level of the repository maintains the order of available list that will be shown in the app.e

# License

Unless otherwise specified, contributed scripts are licensed under GPL-v3. Contributors are free to license their scripts under more permissive licenses (per script LICENSE.md file).
