import React from 'react';
import { BrowserDetection, type FocusProps } from 'thesis-library';

export function GetDetector(fp: FocusProps, Detection = BrowserDetection) {
  return <Detection {...fp} />;
}
