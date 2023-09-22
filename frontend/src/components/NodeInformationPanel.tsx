import React, { FC, useEffect, useState, useContext } from "react";
import axios from "axios";

import { NodeProps } from "../interfaces/interface";
import { MyContext } from "../App";
import TextField from "./TextField";
import CheckboxField from "./CheckboxField";
import SelectField from "./SelectField";

interface NodeInformationPanelProps {
  selectedNode: number | null;
  nodes: NodeProps[];
  resetSelectedNode: () => void;
}

const NodeInformationPanel: FC<NodeInformationPanelProps> = ({
  selectedNode,
  nodes,
  resetSelectedNode,
}) => {
  const {
    setMapData,
    originalMapData,
    resetMapData,
    updateNode,
    addNode,
    deleteNode,
  } = useContext(MyContext);
  const [editableNode, setEditableNode] = useState<NodeProps | null>(null);
  const selectedNodeDetails = nodes.find((node) => node.code === selectedNode);

  useEffect(() => {
    // Update state with selected node details
    setEditableNode(selectedNodeDetails || null);
  }, [selectedNodeDetails, selectedNode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableNode({ ...editableNode, [name]: value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "nodeType") {
      if (value === "charger") {
        setEditableNode({
          ...editableNode,
          charger: { direction: editableNode?.charger?.direction || "North" },
          chute: undefined,
        });
      } else if (value === "chute") {
        setEditableNode({
          ...editableNode,
          chute: { direction: editableNode?.chute?.direction || "North" },
          charger: undefined,
        });
      } else {
        setEditableNode({
          ...editableNode,
          charger: undefined,
          chute: undefined,
        });
      }
    }
  };

  const handleDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (editableNode?.charger) {
      setEditableNode({ ...editableNode, charger: { direction: value } });
    } else if (editableNode?.chute) {
      setEditableNode({ ...editableNode, chute: { direction: value } });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    let newDirections = editableNode?.directions || [];
    if (checked) {
      newDirections.push(value);
    } else {
      newDirections = newDirections.filter((dir) => dir !== value);
    }
    setEditableNode({ ...editableNode, directions: newDirections });
  };

  const handleSubmit = () => {
    if (!editableNode) {
      alert("No node selected.");
      return;
    }

    const { code, x, y, directions } = editableNode;

    // Validate required fields
    if (!code || !x || !y || !directions || directions.length === 0) {
      alert("Please fill in all required fields: code, x, y, base directions.");
      return;
    }

    if (editableNode && updateNode) {
      // Swap x and y back before sending to the backend
      const { x, y, ...rest } = editableNode;
      const nodeDataToSend = { x: Number(y), y: Number(x), ...rest };
      axios
        .put(
          `http://localhost:8000/api/map/nodes/${editableNode.code}`,
          nodeDataToSend
        )
        .then((response) => {
          // Update the node in the context's state
          updateNode({ ...editableNode, y: Number(y), x: Number(x) });
        })
        .catch((error) => {
          console.error("Error updating node:", error);
        });
    }
    updateNode(editableNode);
  };

  const handleAddNode = () => {
    if (!editableNode) {
      alert("No node selected.");
      return;
    }

    const { code, x, y, directions } = editableNode;

    // Validate required fields
    if (!code || !x || !y || !directions || directions.length === 0) {
      alert("Please fill in all required fields: code, x, y, base directions.");
      return;
    }

    // Check if a node with the same code already exists
    const existingNode = nodes.find((node) => node.code === editableNode.code);
    if (existingNode) {
      alert("A node with this code already exists.");
      return;
    }

    // Validate type-specific fields
    if (editableNode.charger && !editableNode.charger.direction) {
      alert("Please select a direction for the charger.");
      return;
    }
    if (editableNode.chute && !editableNode.chute.direction) {
      alert("Please select a direction for the chute.");
      return;
    }

    // Swap x and y back before sending to the backend
    const nodeDataToSend = {
      ...editableNode,
      x: Number(y),
      y: Number(x),
      code: Number(code),
    };
    console.log("Type of code:", typeof nodeDataToSend.code);
    axios
      .post("http://localhost:8000/api/map/nodes", nodeDataToSend)
      .then((response) => {
        // Update the nodes in the context's state
        addNode({
          ...editableNode,
          code: Number(code),
          y: Number(y),
          x: Number(x),
        });
      })
      .catch((error) => {
        console.error("Error adding node:", error);
      });
  };

  const handleDeleteNode = () => {
    if (!editableNode || !editableNode.code) {
      alert("No node selected.");
      return;
    }

    console.log("editableNode.code", editableNode.code);
    axios
      .delete(`http://localhost:8000/api/map/nodes/${editableNode.code}`)
      .then((response) => {
        deleteNode(editableNode.code);
        setEditableNode(null);
        resetSelectedNode(); // Reset selectedNode state in the Map component
      })
      .catch((error) => {
        console.error("Error deleting node:", error);
      });
  };

  const handleResetMap = () => {
    axios
      .post("http://localhost:8000/api/map/reset")
      .then((response) => {
        // Reset the mapData in context to originalMapData
        resetMapData();
        location.reload()
      })
      .catch((error) => {
        console.error("Error resetting map:", error);
      });
  };

  // if (!editableNode) return <div>No Node Selected</div>;
  const directions = ["North", "South", "East", "West"];

  return (
    <div className="form-container">
      <div className="vertical-div">
        <TextField
          className="text-field"
          label="Code"
          type="number"
          name="code"
          value={editableNode?.code || ""}
          onChange={handleInputChange}
          readOnly={selectedNode !== null}
        />
        <TextField
          className="text-field"
          label="X"
          type="number"
          name="x"
          value={editableNode?.x || ""}
          onChange={handleInputChange}
        />
        <TextField
          className="text-field"
          label="Y"
          type="number"
          name="y"
          value={editableNode?.y || ""}
          onChange={handleInputChange}
        />
      </div>
      <div className="vertical-div">
        <div className="checkbox-field">
          <label>Base Directions:</label>
          {directions.map((direction) => (
            <CheckboxField
              key={direction}
              label={direction}
              name="direction"
              value={direction}
              checked={editableNode?.directions?.includes(direction) || false}
              onChange={handleCheckboxChange}
            />
          ))}
        </div>

        <SelectField
          className="select-field"
          label="Type"
          name="nodeType"
          value={
            editableNode?.charger
              ? "charger"
              : editableNode?.chute
              ? "chute"
              : ""
          }
          options={["None", "charger", "chute"]}
          onChange={handleSelectChange}
        />
        {(editableNode?.charger || editableNode?.chute) && (
          <SelectField
            className="select-field"
            label="Direction"
            name="direction"
            value={
              editableNode?.charger
                ? editableNode.charger.direction
                : editableNode?.chute
                ? editableNode.chute.direction
                : ""
            }
            options={directions}
            onChange={handleDirectionChange}
          />
        )}
      </div>
      <div className="button-container" style={{ flex: "1" }}>
        <button onClick={handleSubmit}>Update</button>
        <button onClick={handleDeleteNode}>Delete</button>
        <button onClick={handleResetMap}>Reset</button>
        {selectedNode === null && <button onClick={handleAddNode}>Add</button>}
      </div>
    </div>
  );
};

export default NodeInformationPanel;
