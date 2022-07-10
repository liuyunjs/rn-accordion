import * as React from 'react';
import { ManagerContext, AccordionKeyContext } from './AccordionContext';

export const useSelected = () => {
  const key = React.useContext(AccordionKeyContext);
  const manager = React.useContext(ManagerContext);
  const [selected, setSelected] = React.useState(() => manager.isSelected(key));

  React.useEffect(() => {
    const subscribe = () => {
      setSelected(manager.isSelected(key));
    };

    manager.on('update', subscribe);

    return () => {
      manager.off('update', subscribe);
    };
  }, [key, manager]);

  return selected;
};
