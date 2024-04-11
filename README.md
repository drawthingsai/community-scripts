# Community Scripts

This repository maintains the source material and publish mechanism for "Community" section of Scripts in the Draw Things app.

# How to Contribute

TBD

You are welcome to put up Pull Requests to add new scripts to the "Community" section within the app. To add a new script, first create a directory under `./scripts` and add the following files:

 1. add LICENSE.md

 2. add the js file

 3. Add a `metadata.json` file that contains the metadata including name and other information. If metadata.json is not provided, the default metadata will be generated based on the name of the js file.

Example metadata.json
 ```javascript
 {
  "display_name": "SD Ultimate Upscale",
  "author": "",
  "file": "sd-ultimate-upscale.js",
  "description": "Generate high-quality, high-resolution images from low-resolution inputs, while preserving fine details and textures."
}
 ```

Then add the directory name for your script into the `scripts.txt` file at the top level of the repository.

# How It Works

Once a Pull Request merged into the repository, an automatic process will be kicked off to add the scripts to a listing hosted by Draw Things. A new json list will be generated so the script will be available to everyone use the app upon a refresh.

# License

TBD