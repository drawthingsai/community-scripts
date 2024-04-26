# Community Scripts

This repository maintains the source material and publish mechanism for "Community Scripts" section of the Scripts feature in the Draw Things app.

## How to Contribute

To contribute a new script to the "Community Scripts" section, please follow these steps:

 1. **Create a Script Directory**: Make a new directory under `./scripts`.
 2. **Add Necessary Files**:
    * **JavaScript File**: This is the main script file.
    * **Metadata File (`metadata.json`)**: This file should contain essential metadata about the script, including the name, author, and description.
    * **License File (`LICENSE`)**: Optionally, include a license file if you want your script to be licensed under terms different from GPL-v3.

 **Example of a Complete `metadata.json` File**:
 ```javascript
 {
  "name": "SD Ultimate Upscale",
  "author": "Your Name",
  "file": "sd-ultimate-upscale.js",
  "description": "Generate high-quality, high-resolution images from low-resolution inputs, while preserving fine details and textures."
}
 ```

### Scripts List:

The `scripts.txt` file at the top level of the repository organizes the scripts in the order they will be displayed in the app.

## Licensing

Default licensing for scripts is GPL-v3. If you prefer a more permissive license, please include a specific `LICENSE` file with your script to indicate this choice.
