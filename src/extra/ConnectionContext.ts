import { createContext } from 'react';
import type { SharedMap } from 'fluid-framework';

export type Context = {
  set: Function;
  get: Function;
  sharedMap: SharedMap | null;
};

export const ConnectionContext = createContext<Context | null>(null);
