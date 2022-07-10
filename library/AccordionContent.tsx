import * as React from 'react';
import { Collapsible, CollapsibleProps } from './Collapsible';
import { AccordionSelectedContext } from './AccordionContext';

export type AccordionContentProps = Omit<CollapsibleProps, 'collapsed'>;

export const AccordionContent: React.FC<
  React.PropsWithChildren<AccordionContentProps>
> = (props) => {
  const selected = React.useContext(AccordionSelectedContext);
  return <Collapsible {...(props as any)} collapsed={!selected} />;
};
