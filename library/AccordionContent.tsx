import React from 'react';
import { RMotionView } from 'rmotion';
import {
  View,
  LayoutChangeEvent,
  StyleSheet,
  ViewProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { AccordionSelectedContext } from './AccordionContext';

export type AccordionContentProps = ViewProps & {
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export const AccordionContent: React.FC<AccordionContentProps> = ({
  contentContainerStyle,
  style,
  children,
  ...rest
}) => {
  const selected = React.useContext(AccordionSelectedContext);
  const initSelected = React.useRef(selected).current;
  const mountedRef = React.useRef<boolean>();
  const [height, setHeight] = React.useState(-1);
  if (selected) {
    mountedRef.current = true;
  }
  if (!mountedRef.current) return null;

  const needAnim = !initSelected || height !== -1;

  const onLayout = (e: LayoutChangeEvent) => {
    setHeight(e.nativeEvent.layout.height);
  };

  return (
    <RMotionView
      {...rest}
      style={[style, styles.overflow]}
      animate={
        needAnim
          ? {
              height: selected && height !== -1 ? height : 0,
            }
          : undefined
      }>
      <View
        style={[contentContainerStyle, needAnim && styles.float]}
        onLayout={onLayout}>
        {children}
      </View>
    </RMotionView>
  );
};

const styles = StyleSheet.create({
  float: {
    position: 'absolute',
  },
  overflow: {
    overflow: 'hidden',
  },
});
