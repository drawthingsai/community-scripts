import os
import shutil
import json

# Define the paths
scripts_dir = 'scripts'  # Replace with the path to your scripts directory
docs_dir = 'docs'  # Replace with the path to your docs directory

# Ensure the destination directory exists
if not os.path.exists(docs_dir):
    os.makedirs(docs_dir)
    
for subdir in os.listdir(scripts_dir):
    subdir_path = os.path.join(scripts_dir, subdir)
    
    if os.path.isdir(subdir_path):
        metadata_path = os.path.join(subdir_path, 'metadata.json')
        
        # Check if metadata.json exists in the subdirectory
        if os.path.isfile(metadata_path):
            with open(metadata_path, 'r') as f:
                metadata = json.load(f)
            
            # Get the script file name from metadata.json
            js_file_name = metadata.get('file')  # Get the file name from the 'file' key
            if js_file_name:
                js_file_path = os.path.join(subdir_path, js_file_name)
                
                # Copy the .js file to docs directory
                if os.path.isfile(js_file_path):
                    shutil.copy(js_file_path, docs_dir)
                
                # Copy the assets directory
                assets_src_dir = os.path.join(subdir_path, 'assets')
                assets_dst_dir = os.path.join(docs_dir, js_file_name.replace('.js', ''), 'assets')
                
                if os.path.isdir(assets_src_dir):
                    # Create the destination directory if it doesn't exist
                    os.makedirs(assets_dst_dir, exist_ok=True)
                    
                    # Copy the assets directory
                    for item in os.listdir(assets_src_dir):
                        s = os.path.join(assets_src_dir, item)
                        d = os.path.join(assets_dst_dir, item)
                        if os.path.isdir(s):
                            shutil.copytree(s, d, dirs_exist_ok=True)
                        else:
                            shutil.copy2(s, d)

