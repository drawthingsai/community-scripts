import copy
import subprocess
import os
import json

def sha256sum(file):
  result = subprocess.run(['sha256sum', file], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
  if result.returncode == 0:
    return result.stdout.strip().split()[0]
  
def collect_metadata_from_list(file_path):
  metadata_array = []
  sha256_dict = {}
  with open(file_path, 'r') as file:
    # Read each line in the file
    for line in file:
      directory_path = line.strip()  # Remove newline and whitespace
      print(directory_path)
      metadata_path = os.path.join('scripts', directory_path, 'metadata.json')
      # process the folders with metadata
      if os.path.exists(metadata_path):
        # Open and load the JSON content
        with open(metadata_path, 'r') as json_file:
          metadata = json.load(json_file)
        js_file_path = os.path.join('scripts', directory_path, metadata['file'])
        if os.path.exists(js_file_path):
          sha = sha256sum(js_file_path)
          metadata_array.append(copy.deepcopy(metadata))
          sha256_dict[directory_path] = sha
            
      
  return metadata_array, sha256_dict

# Replace 'scripts.txt' with the path to your actual file if it's located elsewhere
scripts_txt_path = 'scripts.txt'
metadata_array, sha256_dict = collect_metadata_from_list(scripts_txt_path)
with open('scripts_sha256.json', 'w') as file:
  sha256_string = json.dumps(sha256_dict, indent=2)
  file.write(sha256_string)

# Convert the array to a JSON string for printing or further processing
with open('scripts.json', 'w') as file:
  metadata_json_string = json.dumps(metadata_array, indent=2)
  file.write(metadata_json_string)
