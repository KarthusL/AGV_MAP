import React, { useContext } from "react";
import { MyContext } from "../App";

// Define constants for SVG layout
const SVG_WIDTH = 200;
const SVG_HEIGHT = 200;
const CIRCLE_RADIUS = 15;
const FONT_SIZE = "12px";

const Legend: React.FC = () => {
  // Destructure colorMapper from context
  const { colorMapper } = useContext(MyContext);

  // Generate legend item
  const generateLegendItem = (
    cx: number,
    cy: number,
    fill: string,
    label: string
  ) => (
    <g>
      <circle cx={cx} cy={cy} r={CIRCLE_RADIUS} fill={fill} />
      <text
        x={cx + CIRCLE_RADIUS + 10}
        y={cy + 5}
        style={{ fontSize: FONT_SIZE }}
      >
        {label}
      </text>
    </g>
  );

  return (
    <svg width={SVG_WIDTH} height={SVG_HEIGHT}>
      <g transform="translate(20, 20)">
        {generateLegendItem(0, 0, colorMapper.node, "Node")}
        {generateLegendItem(0, 40, colorMapper.charger, "Node with Charger")}
        {generateLegendItem(0, 80, colorMapper.chute, "Node with Chute")}
        {generateLegendItem(
          0,
          120,
          colorMapper.named,
          "Node with special Name"
        )}
      </g>
    </svg>
  );
};

export default Legend;
