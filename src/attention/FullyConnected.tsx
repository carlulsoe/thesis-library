import { OptionalConnectionContext } from 'thesis-library';
import React, { useContext } from 'react';

export const FullyConnected = ({ ownContext, sending, receiving }: any) => {
  const sharedContext = useContext(OptionalConnectionContext);
  if (!sharedContext?.sharedMap) return <></>;
  let ownJustUpdated = false;
  let sharedJustUpdated = false;

  sharedContext.sharedMap.on('valueChanged', () => {
    if (ownJustUpdated) {
      ownJustUpdated = false;
      return;
    }
    sharedJustUpdated = true;
    ownContext.sharedMap?.set('time', sharedContext.sharedMap?.get('time'));
    receiving(ownContext);
  });
  ownContext.sharedMap.on('valueChanged', () => {
    if (sharedJustUpdated) {
      sharedJustUpdated = false;
      return;
    }
    ownJustUpdated = true;
    sharedContext.sharedMap?.set('time', ownContext.get('time'));
    sending(sharedContext);
  });
  return <></>;
};
