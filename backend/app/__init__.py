import os
from flask import Flask
from .api import api
from utils.json_parser import read_json_to_dict, write_dict_to_json
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    CORS(app)

    # keep the original map data in the app config
    app.config["original_map_data"] = read_json_to_dict("data/map.json")

    # Make a copy of the original map to map_working_copy if it does not exist
    working_map_path = "data/map_working_copy.json"
    if not os.path.exists(working_map_path):
        write_dict_to_json(app.config["original_map_data"], working_map_path)

    app.config["working_map_data"] = read_json_to_dict(working_map_path)
    app.register_blueprint(api)

    return app
