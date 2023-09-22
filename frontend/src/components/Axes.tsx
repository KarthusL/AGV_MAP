import React, { FC } from "react";
import { AxesProps } from "../interfaces/interface";

// Constants to improve readability
const AXIS_PADDING = 0; // Padding for all sides of the axis
const TICK_LENGTH = 5; // Length of the tick lines
const UNIT_MM = 500; // 1 unit = 500mm

const Axes: FC<AxesProps> = ({ svgWidth, svgHeight, scaleRate }) => {
  // Function to create tick marks and labels
  const renderTicks = (axis: "x" | "y") => {
    const length = axis === "x" ? svgWidth : svgHeight;
    const ticks = Array.from(
      { length: Math.floor((length - AXIS_PADDING) / scaleRate / UNIT_MM) },
      (_, i) => i * UNIT_MM * scaleRate + AXIS_PADDING
    );

    return ticks.map((pos, i) => {
      if (i === 0) return null; // Skip the 0mm label
      return (
        <g key={`${axis}-tick-${i}`}>
          <line
            x1={axis === "x" ? pos : AXIS_PADDING}
            y1={axis === "x" ? AXIS_PADDING : pos}
            x2={axis === "x" ? pos : AXIS_PADDING + TICK_LENGTH}
            y2={axis === "x" ? AXIS_PADDING + TICK_LENGTH : pos}
          />
          <text
            x={axis === "x" ? pos : AXIS_PADDING + TICK_LENGTH + 10}
            y={axis === "x" ? AXIS_PADDING + TICK_LENGTH + 10 : pos}
            textAnchor={axis === "x" ? "middle" : "start"}
            dy={axis === "y" ? "0.35em" : undefined}
            fontSize={100 * scaleRate}
          >
            {`${i * UNIT_MM} mm`}
          </text>
        </g>
      );
    });
  };

  return (
    <g stroke="black">
      <line
        x1={AXIS_PADDING}
        y1={AXIS_PADDING}
        x2={svgWidth}
        y2={AXIS_PADDING}
      />
      <line
        x1={AXIS_PADDING}
        y1={AXIS_PADDING}
        x2={AXIS_PADDING}
        y2={svgHeight}
      />


      {renderTicks("x")}
      {renderTicks("y")}
    </g>
  );
};

export default Axes;
