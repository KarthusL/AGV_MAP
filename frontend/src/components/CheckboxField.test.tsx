import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CheckboxField from './CheckboxField';

test('CheckboxField renders correctly', () => {
  const { getByLabelText } = render(
    <CheckboxField label="Test Checkbox" name="test" />
  );
  const checkbox = getByLabelText('Test Checkbox');
  expect(checkbox).toBeInTheDocument();
});

test('CheckboxField toggles', () => {
  const { getByLabelText } = render(
    <CheckboxField label="Test Checkbox" name="test" />
  );
  const checkbox = getByLabelText('Test Checkbox');
  fireEvent.click(checkbox);
  expect(checkbox).toBeChecked();
});
