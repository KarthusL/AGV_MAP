from .json_parser import write_dict_to_json


def get_map_data(current_app):
    return current_app.config.get("working_map_data")


def save_map_data(current_app, data, working=True):
    key = "working_map_data" if working else "original_map_data"
    current_app.config[key] = data
    filename = "data/map_working_copy.json" if working else "data/map.json"
    write_dict_to_json(data, filename)  # Save to the JSON file
