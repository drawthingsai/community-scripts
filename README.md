# Community Scripts

This repository maintains the source material and publish mechanism for "Community Scripts" section of the Scripts feature in the Draw Things app.

# How to Contribute

We welcome Pull Requests for adding new scripts to the "Community Scripts" section within the app. To contribute a script, please follow these steps:

 1. Create a directory under `./scripts`.
 2. Include the following files:
    * `LICENSE` (optional).
    * The JavaScript file.
    * A `metadata.json` file containing the script's metadata such as name and other relevant information.

 Example of `metadata.json`:
 ```javascript
 {
  "name": "SD Ultimate Upscale",
  "author": "",
  "file": "sd-ultimate-upscale.js",
  "description": "Generate high-quality, high-resolution images from low-resolution inputs, while preserving fine details and textures."
}
 ```

The `scripts.txt` file at the top level of the repository lists the scripts in the order they will appear in the app.

# License

Unless specified otherwise, contributed scripts are licensed under GPL-v3. Contributors may opt to license their scripts under more permissive licenses as indicated in a per-script `LICENSE` file.
