import React from 'react';
import renderer from 'react-test-renderer';
import { Canvas } from '../canvas';

test('renders correctly', () => {
  const tree = renderer
    .create(
      <Canvas
        setup={(ctx) => {
          ctx.save();
        }}
        size={{ width: 200, height: 200 }}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
