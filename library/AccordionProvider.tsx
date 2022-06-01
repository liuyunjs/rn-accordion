import * as React from 'react';
import { useWillMount } from '@liuyunjs/hooks/lib/useWillMount';
import { ManagerContext } from './AccordionContext';
import { AccordionManager } from './AccordionManager';

type DefaultProviderProps = {
  selected?: string[];
  onSelected?: (selected: string[]) => void;
  accordion?: false;
};

type TAccordionProviderProps = {
  selected?: string;
  onSelected?: (selected?: string) => void;
  accordion: true;
};

export type AccordionProviderProps =
  | TAccordionProviderProps
  | DefaultProviderProps;

export const AccordionProvider: React.FC<AccordionProviderProps> = ({
  accordion,
  onSelected,
  selected,
  children,
}) => {
  const manager = useWillMount(() => new AccordionManager());

  manager.subscribe(onSelected);
  manager.accordion(accordion);

  React.useMemo(() => manager.setSelected(selected), [manager, selected]);

  return (
    <ManagerContext.Provider value={manager}>
      {children}
    </ManagerContext.Provider>
  );
};

AccordionProvider.defaultProps = {
  accordion: false,
  selected: [],
};
