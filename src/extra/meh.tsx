import Detector from './idleDetector';
import React from 'react';

export function AddDetector() {
  Detector().then().catch();
  return <></>;
}
