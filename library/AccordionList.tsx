import React from 'react';
import {
  FlatList,
  SectionList,
  FlatListProps,
  SectionListProps,
  DefaultSectionT,
  ListRenderItemInfo,
  VirtualizedListProps,
  VirtualizedList,
} from 'react-native';
import { AccordionProvider, AccordionProviderProps } from './AccordionProvider';
import { AccordionItem } from './AccordionItem';

interface CreateAccordionList {
  <ItemT>(
    Component: React.ComponentType<FlatListProps<ItemT>>,
  ): React.ComponentType<FlatListProps<ItemT> & AccordionProviderProps>;
  <ItemT>(
    Component: React.ComponentType<VirtualizedListProps<ItemT>>,
  ): React.ComponentType<VirtualizedListProps<ItemT> & AccordionProviderProps>;
  <ItemT, SectionT = DefaultSectionT>(
    Component: React.ComponentType<SectionListProps<ItemT, SectionT>>,
  ): React.ComponentType<
    SectionListProps<ItemT, SectionT> & AccordionProviderProps
  >;
}

const createAccordionList: CreateAccordionList = (Component: any) => {
  const AccordionList = ({
    onSelected,
    selected,
    accordion,
    ...rest
  }: VirtualizedListProps<any> & AccordionProviderProps) => {
    const { keyExtractor, renderItem: renderItemInput } = rest;

    const renderItem = React.useCallback(
      (info: ListRenderItemInfo<any>) => {
        const key = keyExtractor
          ? keyExtractor(info.item, info.index)
          : info.index;

        const elem = renderItemInput ? renderItemInput(info) : null;

        return (
          <AccordionItem key={key} id={key}>
            {elem}
          </AccordionItem>
        );
      },
      [renderItemInput, keyExtractor],
    );

    return (
      <AccordionProvider
        accordion={accordion}
        onSelected={onSelected}
        selected={selected}>
        <Component {...rest} renderItem={renderItem} />
      </AccordionProvider>
    );
  };

  AccordionList.displayName = `accordion(${
    Component.displayName || Component.name || 'Component'
  })`;

  return AccordionList as any;
};

export const AccordionFlatList = createAccordionList(FlatList);
export const AccordionSectionList = createAccordionList(SectionList);
export const AccordionVirtualizedList = createAccordionList(VirtualizedList);
