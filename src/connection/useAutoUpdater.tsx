import React, { useContext } from 'react';
import { ConnectionContext } from './ConnectionContext';

export function useAutoUpdater(key: string): [string, Function] {
  const Context = useContext(ConnectionContext);
  const [value, setValue] = React.useState('');
  React.useEffect(() => {
    if (Context == null || Context.container == null) return;
    const sharedMap = Context.container.initialObjects.sharedMap;

    const update = () => setValue(Context.get(key));
    update();
    sharedMap.on('valueChanged', update);
    return () => {
      sharedMap.off('valueChanged', update);
    };
  });
  if (!Context?.container) return ['', () => null];
  return [value, (v: string) => Context?.set(key, v)];
}
