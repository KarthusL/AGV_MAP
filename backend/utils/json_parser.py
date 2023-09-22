import json

def read_json_to_dict(filename):
    with open(filename, 'r') as f:
        return json.load(f)

def write_dict_to_json(data, filename):
    with open(filename, 'w') as f:
        json.dump(data, f, indent=4)
