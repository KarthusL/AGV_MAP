from utils.map_data_helper import (
    get_map_data,
    write_dict_to_json,
)  # Import the utility functions
from utils.json_parser import read_json_to_dict
from flask import Blueprint, jsonify, current_app, request, abort


api = Blueprint("api", __name__)


def save_map_data_to_file():
    write_dict_to_json(
        current_app.config["working_map_data"], "data/map_working_copy.json"
    )


@api.route("/api/map", methods=["GET"])
def get_map():
    map_data = get_map_data(current_app)
    if not map_data or "map" not in map_data:
        return jsonify({"message": "Data not initialized"}), 500
    return jsonify(map_data), 200


@api.route("/api/map", methods=["PUT"])
def update_map():
    new_data = request.json
    if not new_data:
        abort(400, description="Invalid input data.")
    current_app.config["map_data"] = new_data
    save_map_data_to_file()
    return jsonify({"message": "Map updated successfully"}), 200


@api.route("/api/map/nodes", methods=["POST"])
def add_node():
    map_data = get_map_data(current_app)
    new_node = request.json
    if (
        not new_node
        or "code" not in new_node
        or "x" not in new_node
        or "y" not in new_node
    ):
        abort(400, description="Invalid input data.")

    existing_nodes = [
        node for node in map_data["map"]["nodes"] if node["code"] == new_node["code"]
    ]
    if existing_nodes:
        return jsonify({"message": "Node with this code already exists"}), 400
    map_data["map"]["nodes"].append(new_node)
    current_app.config["map_data"] = map_data
    save_map_data_to_file()
    return jsonify({"message": "Node added successfully"}), 201


@api.route("/api/map/nodes/<int:code>", methods=["PUT"])
def update_node(code):
    map_data = get_map_data(current_app)
    updated_node = request.json
    if not updated_node or "code" not in updated_node:
        abort(400, description="Invalid input data.")

    existing_nodes = [node for node in map_data["map"]["nodes"] if node["code"] == code]
    if not existing_nodes:
        return jsonify({"message": "Node not found"}), 404

    existing_node = existing_nodes[0]
    existing_node.update(updated_node)
    current_app.config["map_data"] = map_data
    save_map_data_to_file()
    return jsonify({"message": "Node updated successfully"}), 200


@api.route("/api/map/nodes/<int:code>", methods=["DELETE"])
def delete_node(code):
    map_data = get_map_data(current_app)
    existing_nodes = [node for node in map_data["map"]["nodes"] if node["code"] == code]

    if not existing_nodes:
        return jsonify({"message": "Node not found"}), 404

    map_data["map"]["nodes"].remove(existing_nodes[0])
    current_app.config["map_data"] = map_data
    save_map_data_to_file()
    return jsonify({"message": "Node deleted successfully"}), 200


@api.route("/api/map/reset", methods=["POST"])
def reset_map():
    original_map = read_json_to_dict("data/map.json")

    # Update the map in memory
    # current_app.config["map_data"] = original_map
    current_app.config["working_map_data"] = original_map

    # Save the original map back to map.json
    write_dict_to_json(original_map, "data/map_working_copy.json")

    return jsonify({"message": "Map has been reset to the original state"}), 200


# for future improvement
@api.route("/api/map/max-neighbor-distance", methods=["GET"])
def get_max_neighbor_distance():
    map_data = get_map_data(current_app)
    if (
        not map_data
        or "map" not in map_data
        or "maxNeighborDistance" not in map_data["map"]
    ):
        return jsonify({"message": "Data not initialized"}), 500
    return jsonify({"maxNeighborDistance": map_data["map"]["maxNeighborDistance"]}), 200


@api.route("/api/map/max-neighbor-distance", methods=["PUT"])
def update_max_neighbor_distance():
    map_data = get_map_data(current_app)
    new_distance = request.json.get("maxNeighborDistance")

    if new_distance is None:
        return jsonify({"message": "Invalid request body"}), 400

    map_data["map"]["maxNeighborDistance"] = new_distance
    current_app.config["map_data"] = map_data
    save_map_data_to_file()
    return jsonify({"message": "Max neighbor distance updated successfully"}), 200
