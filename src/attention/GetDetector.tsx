import React from 'react';
import {
  Detector,
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
    <Detector
      uuid={uuid}
      focus={focus}
      dp={detectorProp}
      multiUserSharing={MultiUserSharing}
    />
  );
}
