import React from 'react';
import renderer from 'react-test-renderer';
import PhotoApp from '../App';

test('renders correctly', () => {
  const tree = renderer.create(<PhotoApp />).toJSON();
  expect(tree).toMatchSnapshot();
});
