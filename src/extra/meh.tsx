import Detector from './idleDetector';
import React from 'react';

export function AddDetector() {
  const uuid = self.crypto.randomUUID();
  console.log(uuid);
  Detector(uuid).then().catch();
  return <></>;
}
