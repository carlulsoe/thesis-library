import { createContext } from 'react';
import type { ContainerSchema, IFluidContainer } from 'fluid-framework';

type eh = {
  set: Function;
  get: Function;
  container: IFluidContainer<ContainerSchema> | null;
};

export const ConnectionContext = createContext<eh | null>(null);
