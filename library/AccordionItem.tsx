import React from 'react';
import {
  AccordionSelectedContext,
  AccordionKeyContext,
  AccordionContext,
} from './AccordionContext';

export type AccordionItemProps = {
  id: string | number;
  children?: React.ReactNode;
};

export const AccordionItem = React.memo<AccordionItemProps>(
  function AccordionItem({ id, children }) {
    const selected = React.useContext(AccordionContext);
    const key = id + '';
    return (
      <AccordionKeyContext.Provider value={key}>
        <AccordionSelectedContext.Provider value={!!selected[key]}>
          {children}
        </AccordionSelectedContext.Provider>
      </AccordionKeyContext.Provider>
    );
  },
);
