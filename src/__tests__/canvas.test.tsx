import React from 'react';
import renderer from 'react-test-renderer';
import { Canvas } from '../canvas';

test('renders correctly', () => {
  const tree = renderer
    .create(
      <Canvas
        configureSetup={(ctx) => {
          ctx.save();
        }}
        height={200}
        width={200}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
