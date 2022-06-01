import * as React from 'react';
import {
  GestureResponderEvent,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { AccordionKeyContext, ManagerContext } from './AccordionContext';

export type AccordionPanelProps = TouchableOpacityProps;

export const AccordionPanel: React.FC<AccordionPanelProps> = (props) => {
  const key = React.useContext(AccordionKeyContext);
  const manager = React.useContext(ManagerContext);

  const onPress = (e: GestureResponderEvent) => {
    manager?.toggle(key);
    props.onPress?.(e);
  };

  return <TouchableOpacity {...props} onPress={onPress} />;
};
