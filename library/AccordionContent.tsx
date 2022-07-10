import * as React from 'react';
import { Collapsible, CollapsibleProps } from './Collapsible';
import { useSelected } from './useSelected';

export type AccordionContentProps = Omit<CollapsibleProps, 'collapsed'>;

export const AccordionContent: React.FC<
  React.PropsWithChildren<AccordionContentProps>
> = (props) => {
  const selected = useSelected();

  return <Collapsible {...(props as any)} collapsed={!selected} />;
};
