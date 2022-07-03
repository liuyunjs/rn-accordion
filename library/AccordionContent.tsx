import * as React from 'react';
import { LegacyCollapsible, CollapsibleProps } from './LegacyCollapsible';
import { Collapsible, CollapsibleV2Props } from './Collapsible';
import { ManagerContext, AccordionKeyContext } from './AccordionContext';

export type AccordionContentProps =
  | (Omit<CollapsibleProps, 'collapsed'> & { useV2?: false })
  | (Omit<CollapsibleV2Props, 'collapsed'> & { useV2: boolean } & {});

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

export const AccordionContent: React.FC<
  React.PropsWithChildren<AccordionContentProps>
> = (props) => {
  const selected = useSelected();
  const Component = props.useV2 ? Collapsible : LegacyCollapsible;

  return <Component {...(props as any)} collapsed={!selected} />;
};
