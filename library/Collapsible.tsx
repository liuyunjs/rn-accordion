import * as React from 'react';
import { StyleProp, ViewStyle, EasingFunction } from 'react-native';
import Animated, {
  EntryAnimationsValues,
  ExitAnimationsValues,
  withTiming,
  EntryExitAnimationFunction,
  AnimateStyle,
  useSharedValue,
  useAnimatedStyle,
  LayoutAnimationFunction,
  WithTimingConfig,
} from 'react-native-reanimated';

interface CollapsibleInternalProps {
  initial: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  easing: EasingFunction;
  align: 'top' | 'center' | 'bottom';
  duration: number;
  collapsed: boolean;
}

export type CollapsibleProps = Partial<
  Omit<CollapsibleInternalProps, 'initial'>
>;

const CollapsibleInternal: React.FC<
  React.PropsWithChildren<CollapsibleInternalProps>
> = ({
  children,
  easing,
  align,
  style,
  contentContainerStyle,
  duration,
  initial,
  collapsed,
}) => {
  const height = useSharedValue(initial ? 0 : 'auto');

  const animate = (from: number, to: number) => {
    'worklet';

    const elementHeight = Math.max(from, to);

    const initialValues: ViewStyle = {
      height: elementHeight,
    };

    const animations: AnimateStyle<ViewStyle> = {
      height: elementHeight,
    };

    height.value = from;

    if (from !== to) {
      const config: WithTimingConfig = { duration };
      if (easing) {
        config.easing = easing;
      }
      height.value = withTiming(to, config);

      if (align !== 'top') {
        initialValues.transform = [
          { translateY: align === 'center' ? to / -2 : -to },
        ];
        animations.transform = [
          {
            translateY: withTiming(
              align === 'center' ? from / -2 : -from,
              config,
            ),
          },
        ];
      }
    }

    return {
      initialValues,
      animations,
    };
  };

  const entering: EntryExitAnimationFunction = (
    targetValues: EntryAnimationsValues,
  ) => {
    'worklet';

    return animate(0, targetValues.targetHeight);
  };

  const exiting: EntryExitAnimationFunction = (
    targetValues: ExitAnimationsValues,
  ) => {
    'worklet';
    return animate(targetValues.currentHeight, 0);
  };

  const heightStyle = useAnimatedStyle(() => ({ height: height.value }));

  const layout: LayoutAnimationFunction = (targetValues) => {
    'worklet';
    return animate(targetValues.targetHeight, targetValues.targetHeight);
  };

  return (
    <Animated.View style={[style, { overflow: 'hidden' }, heightStyle]}>
      {!collapsed && (
        <Animated.View
          layout={layout}
          style={[contentContainerStyle, initial && { position: 'absolute' }]}
          entering={initial ? entering : undefined}
          exiting={exiting}>
          {children}
        </Animated.View>
      )}
    </Animated.View>
  );
};

export const Collapsible: React.FC<CollapsibleInternalProps> = (props) => {
  const { collapsed } = props;
  const initialRef = React.useRef<boolean>();
  initialRef.current = initialRef.current || collapsed;
  return (
    <CollapsibleInternal {...(props as any)} initial={initialRef.current} />
  );
};

Collapsible.defaultProps = {
  align: 'top',
  collapsed: true,
  duration: 300,
};
