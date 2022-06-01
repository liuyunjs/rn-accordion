import * as React from 'react';
import { Collapsible, CollapsibleProps } from './Collapsible';
import { ManagerContext, AccordionKeyContext } from './AccordionContext';

export type AccordionContentProps = Omit<CollapsibleProps, 'collapsed'> & {};

const useSelected = () => {
  const manager = React.useContext(ManagerContext);
  const key = React.useContext(AccordionKeyContext);
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

export const AccordionContent: React.FC<AccordionContentProps> = (props) => {
  const selected = useSelected();

  return <Collapsible {...props} collapsed={!selected} />;
};
