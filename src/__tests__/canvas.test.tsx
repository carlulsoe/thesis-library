import React from 'react';
import renderer from 'react-test-renderer';
import { Canvas } from '../canvas';

test('renders correctly, no options', () => {
  const tree = renderer.create(<Canvas />).toJSON();
  expect(tree).toMatchSnapshot();
});
