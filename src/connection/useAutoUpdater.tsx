import React, { useContext } from 'react';
import { OptionalConnectionContext } from '../extra';

export function useAutoUpdater(key: string): [string, Function] {
  const Context = useContext(OptionalConnectionContext);
  const [value, setValue] = React.useState('');
  React.useEffect(() => {
    if (Context == null || Context.sharedMap == null) return;
    const sharedMap = Context.sharedMap;

    const update = () => setValue(Context.get(key));
    update();
    sharedMap.on('valueChanged', update);
    return () => {
      sharedMap.off('valueChanged', update);
    };
  });
  if (!Context?.sharedMap) return ['', () => null];
  return [value, (v: string) => Context?.set(key, v)];
}
