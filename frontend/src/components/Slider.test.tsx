import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Slider from './Slider';

test('SliderComponent renders correctly', () => {
  const { getByRole } = render(
    <Slider scaleRate={0.15} setScaleRate={() => {}} />
  );
  const slider = getByRole('slider');
  expect(slider).toBeInTheDocument();
});
