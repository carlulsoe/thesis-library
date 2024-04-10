import { createContext } from 'react';
import type { ContainerSchema, IFluidContainer } from 'fluid-framework';

type Context = {
  set: Function;
  get: Function;
  container: IFluidContainer<ContainerSchema> | null;
};

export const ConnectionContext = createContext<Context | null>(null);
