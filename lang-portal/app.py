import os
import json

# Directory containing the JSON files
json_dir = './json'

# Initialize an empty dictionary to hold the combined data
combined_data = {}

# Iterate over each file in the directory
for filename in os.listdir(json_dir):
    if filename.endswith('.json'):
        file_path = os.path.join(json_dir, filename)
        with open(file_path, 'r', encoding='utf-8') as file:
            # Load the JSON data from the file
            data = json.load(file)
            # Use the filename (without extension) as the key
            key = os.path.splitext(filename)[0]
            # Add the data to the combined dictionary
            combined_data[key] = data

# Write the combined data to a new JSON file
with open('combined_data.json', 'w', encoding='utf-8') as outfile:
    json.dump(combined_data, outfile, ensure_ascii=False, indent=4)

print("Combined JSON data has been written to 'combined_data.json'")