import React, { FC } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

interface SliderComponentProps {
  scaleRate: number;
  setScaleRate: React.Dispatch<React.SetStateAction<number>>;
}

const SliderComponent: FC<SliderComponentProps> = ({
  scaleRate,
  setScaleRate,
}) => {
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    const value = Array.isArray(newValue) ? newValue[0] : newValue;
    setScaleRate(value);
  };

  return (
    <Box className="slider-component-container" sx={{ width: 300 }}>
      <Slider
        className="slider-component"
        defaultValue={0.15}
        value={scaleRate}
        valueLabelDisplay="auto"
        step={0.05}
        marks
        min={0.1}
        max={0.5}
        onChange={handleSliderChange}
      />
    </Box>
  );
};

export default SliderComponent;
