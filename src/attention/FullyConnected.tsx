import {
  type FullyConnectedProps,
  OptionalConnectionContext,
} from 'thesis-library';
import React, { useContext } from 'react';

export const FullyConnected = ({
  ownSharedContext,
  sending,
  receiving,
}: FullyConnectedProps) => {
  const sharedContext = useContext(OptionalConnectionContext);
  if (!sharedContext?.sharedMap) return <></>;
  if (!receiving || !sending) return <></>;
  // To avoid infinite loops
  let ownJustUpdated = false;
  let sharedJustUpdated = false;

  sharedContext.sharedMap.on('valueChanged', (changed) => {
    if (ownJustUpdated) {
      ownJustUpdated = false;
      return;
    }
    sharedJustUpdated = true;
    ownSharedContext.sharedMap?.set(
      changed.key,
      sharedContext.sharedMap?.get(changed.key)
    );
    receiving(ownSharedContext);
  });

  ownSharedContext.sharedMap?.on('valueChanged', (changed) => {
    if (sharedJustUpdated) {
      sharedJustUpdated = false;
      return;
    }
    ownJustUpdated = true;
    sharedContext.sharedMap?.set(
      changed.key,
      ownSharedContext.get(changed.key)
    );
    sending(sharedContext);
  });
  return <></>;
};
