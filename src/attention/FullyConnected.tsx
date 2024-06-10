import {
  type ConnectionContext,
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
  if (!ownSharedContext?.sharedMap) return <></>;
  if (!receiving || !sending) return <></>;
  // To avoid infinite loops
  let ownJustUpdated: Bool = { val: false };
  let sharedJustUpdated: Bool = { val: false };

  const updateContext = (
    thisJustUpdated: Bool,
    thisSharedContext: ConnectionContext,
    otherJustUpdated: Bool,
    otherSharedContext: ConnectionContext,
    key: string,
    developerFunction: Function
  ) => {
    if (thisJustUpdated.val) {
      thisJustUpdated.val = false;
      return;
    }
    otherJustUpdated.val = true;
    thisSharedContext.set(key, otherSharedContext.get(key));
    developerFunction(thisSharedContext);
  };

  sharedContext.sharedMap.on('valueChanged', (changed) => {
    updateContext(
      ownJustUpdated,
      ownSharedContext,
      sharedJustUpdated,
      sharedContext,
      changed.key,
      receiving
    );
  });

  sharedContext.sharedMap?.on('valueChanged', (changed) => {
    updateContext(
      sharedJustUpdated,
      sharedContext,
      ownJustUpdated,
      ownSharedContext,
      changed.key,
      sending
    );
  });
  return <></>;
};

// Custom type makes it pass by reference
interface Bool {
  val: boolean;
}
