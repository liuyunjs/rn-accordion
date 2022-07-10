import * as React from 'react';
import {
  AccordionKeyContext,
  ManagerContext,
  AccordionSelectedContext,
} from './AccordionContext';

export type AccordionItemProps = {
  id: string | number;
  children?: React.ReactNode;
};

const useSelected = (key: string) => {
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

export const AccordionItem: React.FC<
  React.PropsWithChildren<AccordionItemProps>
> = ({ id, children }) => {
  const key = id + '';
  return (
    <AccordionKeyContext.Provider value={key}>
      <AccordionSelectedContext.Provider value={useSelected(key)}>
        {children}
      </AccordionSelectedContext.Provider>
    </AccordionKeyContext.Provider>
  );
};
