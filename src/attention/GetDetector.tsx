import React from 'react';
import {
  BrowserDetection,
  type DetectorProps,
  type MultiUserSharingProps,
} from 'thesis-library';

export function GetDetector(
  uuid: string,
  focus: React.MutableRefObject<boolean>,
  detectorProp: DetectorProps,
  MultiUserSharing: MultiUserSharingProps
) {
  return (
    <BrowserDetection
      uuid={uuid}
      focus={focus}
      dp={detectorProp}
      multiUserSharing={MultiUserSharing}
    />
  );
}
