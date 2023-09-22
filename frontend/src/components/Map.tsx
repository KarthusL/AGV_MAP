import React, { FC, useEffect, useState, useContext, useRef } from "react";

import Node from "./Node";
import SliderComponent from "./Slider";
import Legend from "./Legend";
import NodeInformationPanel from "./NodeInformationPanel";
import Axes from "./Axes";

// Interfaces and Contexts
import { NodeProps } from "../interfaces/interface";
import { MyContext } from "../App";

import "../App.css";

const Map: FC = () => {
  const context = useContext(MyContext);
  const horizontalLayoutRef = useRef(null);
  const [scaleRate, setScaleRate] = useState<number>(0.15);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [rotationAngle, setRotationAngle] = useState<number>(0);

  // those numbers are based on the original map size
  const svgWidth = 16500 * scaleRate;
  const svgHeight = 5500 * scaleRate;

  const handleNodeClick = (code: number) => {
    if (selectedNode === code) {
      setSelectedNode(null);
    } else {
      setSelectedNode(code);
    }
  };

  const handleRotate = () => {
    setRotationAngle((prevAngle) => (prevAngle + 90) % 360);
  };

  const renderConnections = (nodes: NodeProps[]) => {
    const lines: JSX.Element[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const node1 = nodes[i];
        const node2 = nodes[j];
        if (node1.x === node2.x || node1.y === node2.y) {
          lines.push(
            <line
              key={`${node1.code}-${node2.code}`}
              x1={node1.x * scaleRate}
              y1={node1.y * scaleRate}
              x2={node2.x * scaleRate}
              y2={node2.y * scaleRate}
              stroke="black"
            />
          );
        }
      }
    }
    return lines;
  };

  useEffect(() => {
    const updatePosition = () => {
      if (horizontalLayoutRef.current) {
        const scrollLeft = window.scrollX || window.pageXOffset;
        const windowCenter = window.innerWidth / 2;
        const divWidth = horizontalLayoutRef.current.offsetWidth / 2;

        // Update the 'left' style property
        horizontalLayoutRef.current.style.left = `${
          scrollLeft + windowCenter - divWidth
        }px`;
      }
    };
    window.addEventListener("scroll", updatePosition);
    // Clean up for preventing memory leak
    return () => {
      window.removeEventListener("scroll", updatePosition);
    };
  }, []);

  const resetSelectedNode = () => {
    setSelectedNode(null);
  };

  if (!context.mapData) return <div>Loading</div>;

  return (
    <>
      <div ref={horizontalLayoutRef} className="horizontal-layout">
        <div>
          <Legend />
        </div>
        <div>
          <SliderComponent scaleRate={scaleRate} setScaleRate={setScaleRate} />
          <button onClick={handleRotate}>Rotate</button>
        </div>
        <div>
          <NodeInformationPanel
            selectedNode={selectedNode}
            nodes={context.mapData.nodes}
            resetSelectedNode={resetSelectedNode} // Pass the function
          />
        </div>
      </div>
      <div style={{ padding: "50px" }}>
        <svg width={svgWidth} height={svgHeight}>
          <Axes
            svgWidth={svgWidth}
            svgHeight={svgHeight}
            scaleRate={scaleRate}
          />
          <g
            transform={`rotate(${rotationAngle} ${svgWidth / 2} ${
              svgHeight / 2
            })`}
          >
            {context.mapData.nodes.map((node, index) => (
              <Node
                key={index}
                x={node.x}
                y={node.y}
                scaleRate={scaleRate}
                isSelected={node.code === selectedNode}
                onClick={() => handleNodeClick(node.code)}
                {...node}
              />
            ))}
            {renderConnections(context.mapData.nodes)}
          </g>
        </svg>
      </div>
    </>
  );
};

export default Map;
