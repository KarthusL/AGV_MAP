import React, { FC, useContext, useRef, useState, useEffect } from "react";
import axios from "axios";

import { NodeProps } from "../interfaces/interface";
import { MyContext } from "../App";

interface NodeExtendedProps extends NodeProps {
  scaleRate: number;
  isSelected: boolean;
  onClick: () => void;
}

const Node: FC<NodeExtendedProps> = ({
  x,
  y,
  code,
  directions,
  name,
  charger,
  chute,
  scaleRate,
  isSelected,
  onClick,
}) => {
  const { colorMapper, updateNode } = useContext(MyContext);
  const [dragging, setDragging] = useState(false);
  const [dragData, setDragData] = useState({ x: 0, y: 0 });
  const ref = useRef<SVGCircleElement>(null);

  const handleMouseDown = (e: React.MouseEvent<SVGCircleElement>) => {
    setDragging(true);
    setDragData({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging || !ref.current) return;

    const dx = (e.clientX - dragData.x) / scaleRate;
    const dy = (e.clientY - dragData.y) / scaleRate;

    const newX = x + dx;
    const newY = y + dy;

    ref.current.setAttribute("cx", `${newX}`);
    ref.current.setAttribute("cy", `${newY}`);

    setDragData({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setDragging(false);

    if (!ref.current) return;

    // Get the new x and y values
    const newX = parseFloat(ref.current?.getAttribute("cx") || "0");
    const newY = parseFloat(ref.current?.getAttribute("cy") || "0");

    // Create a new node object with the updated x and y values
    const newNode: NodeProps = {
      x: newX,
      y: newY,
      code,
      directions,
      name,
      charger,
      chute,
    };

    updateNode(newNode);

    // Swap x and y back before sending to the backend
    axios
      .put(`http://localhost:8000/api/map/nodes/${code}`, {
        ...newNode,
        x: newY,
        y: newX,
      })
      .then((response) => {})
      .catch((error) => {
        console.error("Error updating node:", error);
      });
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  // Determine the color based on the node properties
  let color = colorMapper.node || "lightblue";
  if (name) color = colorMapper[name.toLowerCase()] || "red";
  if (charger) color = colorMapper.charger || "orange";
  if (chute) color = colorMapper.chute || "yellow";

  const baseScale = 20;
  const specialScale = charger || chute ? 30 : 20;
  const arrowLength = charger || chute ? 40 : 15;
  const scaledDirectionToArrow = (length: number) => ({
    West: `M 0 ${-length * baseScale * scaleRate} L ${
      5 * baseScale * scaleRate
    } 0 L ${-5 * baseScale * scaleRate} 0 Z`,
    North: `M ${length * baseScale * scaleRate} 0 L 0 ${
      5 * baseScale * scaleRate
    } L 0 ${-5 * baseScale * scaleRate} Z`,
    East: `M 0 ${length * baseScale * scaleRate} L ${
      5 * baseScale * scaleRate
    } 0 L ${-5 * baseScale * scaleRate} 0 Z`,
    South: `M ${-length * baseScale * scaleRate} 0 L 0 ${
      5 * baseScale * scaleRate
    } L 0 ${-5 * baseScale * scaleRate} Z`,
  });

  const scaledQuarterCircle = (direction: string) => {
    const radius = specialScale * baseScale * scaleRate;
    switch (direction) {
      case "West":
        return `M ${x} ${y} m 0,-${radius} a ${radius},${radius} 0 0,1 ${radius},${radius} z`;
      case "South":
        return `M ${x} ${y} m -${radius},0 a ${radius},${radius} 0 0,1 ${radius},-${radius} z`;
      case "East":
        return `M ${x} ${y} m 0,${radius} a ${radius},${radius} 0 0,1 -${radius},-${radius} z`;
      case "North":
        return `M ${x} ${y} m ${radius},0 a ${radius},${radius} 0 0,1 -${radius},${radius} z`;
      default:
        return "";
    }
  };

  const fillColor = isSelected ? "green" : color;

  return (
    <g transform={`scale(${scaleRate})`} onClick={onClick}>
      <circle
        ref={ref}
        cx={x}
        cy={y}
        r={specialScale * baseScale * scaleRate}
        fill={fillColor}
        onMouseDown={handleMouseDown}
      >
        <title>{`Code: ${code}, Directions: ${directions?.join(", ")}`}</title>
      </circle>

      {directions?.map((direction, index) => (
        <path
          key={index}
          d={scaledDirectionToArrow(15)[direction]}
          transform={`translate(${x}, ${y})`}
          fill="black"
        />
      ))}

      {(charger || chute) &&
        [charger?.direction || chute?.direction].map((direction) => (
          <path
            key={direction}
            d={scaledQuarterCircle(direction)}
            fill="lightpurple"
            transform={`rotate(-45, ${x}, ${y})`}
          />
        ))}
    </g>
  );
};

export default Node;
