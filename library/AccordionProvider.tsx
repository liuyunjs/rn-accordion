import React from 'react';
import { useMemoize } from '@liuyunjs/hooks/lib/useMemoize';
import { useReactCallback } from '@liuyunjs/hooks/lib/useReactCallback';
import { AccordionContext, AccordionToggleContext } from './AccordionContext';

export type AccordionProviderProps = {
  selected: string[] | string | number | number[];
  onSelected: (selected: string[]) => void;
  accordion?: boolean;
};
export const AccordionProvider: React.FC<AccordionProviderProps> = ({
  accordion = true,
  onSelected,
  selected = [],
  children,
}) => {
  const [ctx, setCtx] = React.useState<{ selected: Record<string, 1> }>({
    selected: {},
  });

  useMemoize(
    () => {
      const arr =
        selected != null
          ? Array.isArray(selected)
            ? selected
            : [selected]
          : [];
      ctx.selected = {};
      arr.forEach((item) => {
        const key = item + '';
        ctx.selected[key] = 1;
      });
    },
    selected,
    1,
  );

  const onToggle = useReactCallback((key: string) => {
    const newCtx = { selected: { ...ctx.selected } };
    if (newCtx.selected[key]) {
      delete newCtx.selected[key];
    } else {
      if (accordion) {
        newCtx.selected = {};
      }
      newCtx.selected[key] = 1;
    }
    setCtx(newCtx);
    onSelected?.(Object.keys(newCtx.selected));
  });

  return (
    <AccordionToggleContext.Provider value={onToggle}>
      <AccordionContext.Provider value={ctx.selected}>
        {children}
      </AccordionContext.Provider>
    </AccordionToggleContext.Provider>
  );
};
