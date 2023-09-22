import React, { useEffect, useState } from "react";
import Map from "./components/Map";
import axios from "axios";
import "./App.css";
import { MapProps, NodeProps } from "./interfaces/interface";

export const MyContext = React.createContext(null);

interface MapResponse {
  map: MapProps;
}

function App() {
  const [colorMapper, setColorMapper] = useState({
    node: "lightblue",
    named: "red",
    charger: "orange",
    chute: "yellow",
    scale: 0.15,
  });
  const [originalMapData, setOriginalMapData] = useState<MapProps | undefined>(
    undefined
  );
  const [mapData, setMapData] = useState<MapProps | undefined>(undefined);

  useEffect(() => {
    axios
      .get<MapResponse>("http://localhost:8000/api/map")
      .then((response) => {
        const scaledNodes = response.data.map.nodes.map((node) => ({
          ...node,
          x: node.y,
          y: node.x,
        }));
        setOriginalMapData({ ...response.data.map, nodes: scaledNodes });
        setMapData(prevMapData => ({ ...prevMapData, nodes: scaledNodes }));
      })
      .catch((error) => {
        console.error("Error fetching map data:", error);
      });
  }, []);

  const addNode = (newNode: NodeProps) => {
    setMapData(prevMapData => {
      if (!prevMapData) return prevMapData;
      const nodes = [...prevMapData.nodes, newNode];
      return { ...prevMapData, nodes };
    });
  };

  const deleteNode = (code: number) => {
    setMapData(prevMapData => {
      if (!prevMapData) return prevMapData;
      const nodes = prevMapData.nodes.filter((node) => node.code !== code);
      return { ...prevMapData, nodes };
    });
  };

  const updateNode = (newNode: NodeProps) => {
    setMapData(prevMapData => {
      if (!prevMapData) return prevMapData;

      const updatedNodes = prevMapData.nodes.map((node) => {
        if (node.code === newNode.code) {
          return { ...newNode }; // Create a new object
        }
        return node;
      });

      return { ...prevMapData, nodes: updatedNodes };
    });
  };

  const resetMapData = () => {
    setMapData(originalMapData);
  };

  return (
    <>
      <MyContext.Provider
        value={{
          colorMapper,
          mapData,
          originalMapData,
          resetMapData,
          updateNode,
          addNode,
          deleteNode,
          setMapData,
        }}
      >
        <Map />
      </MyContext.Provider>
    </>
  );
}

export default App;
