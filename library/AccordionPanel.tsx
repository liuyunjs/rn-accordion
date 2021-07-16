import React from 'react';
import {
  GestureResponderEvent,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {
  AccordionKeyContext,
  AccordionToggleContext,
} from './AccordionContext';

export type AccordionPanelProps = TouchableOpacityProps;

export const AccordionPanel: React.FC<AccordionPanelProps> = (props) => {
  const key = React.useContext(AccordionKeyContext);
  const toggle = React.useContext(AccordionToggleContext);

  const onPress = (e: GestureResponderEvent) => {
    toggle(key);
    props.onPress?.(e);
  };

  return <TouchableOpacity {...props} onPress={onPress} />;
};
