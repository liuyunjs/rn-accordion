import * as React from 'react';
import { AccordionKeyContext } from './AccordionContext';

export type AccordionItemProps = {
  id: string | number;
  children?: React.ReactNode;
};

export const AccordionItem: React.FC<
  React.PropsWithChildren<AccordionItemProps>
> = ({ id, children }) => {
  const key = id + '';
  return (
    <AccordionKeyContext.Provider value={key}>
      {children}
    </AccordionKeyContext.Provider>
  );
};
