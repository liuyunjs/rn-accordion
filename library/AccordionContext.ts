import * as React from 'react';
import { AccordionManager } from './AccordionManager';

// @ts-ignore
export const AccordionKeyContext = React.createContext<string>();

// @ts-ignore
export const ManagerContext = React.createContext<AccordionManager>();

export const AccordionSelectedContext = React.createContext(false);
