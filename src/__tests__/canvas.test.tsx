import React from 'react';
import renderer from 'react-test-renderer';
import { Canvas } from '../canvas';

test('renders correctly, setup, size', () => {
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

test('renders correctly, setup', () => {
  const tree = renderer
    .create(
      <Canvas
        setup={(ctx) => {
          ctx.save();
        }}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders correctly, size', () => {
  const tree = renderer
    .create(<Canvas size={{ width: 200, height: 200 }} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders correctly, no options', () => {
  const tree = renderer.create(<Canvas />).toJSON();
  expect(tree).toMatchSnapshot();
});
