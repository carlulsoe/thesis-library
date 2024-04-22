import { createContext } from 'react';
import type { SharedMap } from 'fluid-framework';

export type ConnectionContext = {
  set: Function;
  get: Function;
  sharedMap: SharedMap | null;
};

export const OptionalConnectionContext = createContext<
  ConnectionContext | null | undefined
>(null);
