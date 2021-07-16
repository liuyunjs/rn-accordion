import React from 'react';

// @ts-ignore
export const AccordionKeyContext = React.createContext<string>(null);
export const AccordionSelectedContext = React.createContext<boolean>(false);

export const AccordionToggleContext =
  // @ts-ignore
  React.createContext<(key: string) => void>(null);

export const AccordionContext = React.createContext<Record<string, 1>>({});
