import * as React from 'react';
import Animated, {
  block,
  Clock,
  clockRunning,
  cond,
  EasingNode,
  interpolateNode,
  not,
  set,
  startClock,
  stopClock,
  timing,
  Value,
  Extrapolate,
  and,
  neq,
  call,
  Easing as _Easing,
  interpolate as _interpolate,
} from 'react-native-reanimated';
import { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';
import { useConst } from '@liuyunjs/hooks/lib/useConst';
import { useWillMount } from '@liuyunjs/hooks/lib/useWillMount';
import { useForceUpdate } from '@liuyunjs/hooks/lib/useForceUpdate';

const Easing = EasingNode || _Easing;
const interpolate = interpolateNode || _interpolate;

export interface CollapsibleInternalProps {
  initial: boolean;
  collapsed: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  easing: (t: Animated.Adaptable<number>) => Animated.Node<number>;
  align: 'top' | 'center' | 'bottom';
  duration: number;
}

export type CollapsibleProps = Partial<
  Omit<CollapsibleInternalProps, 'initial'>
>;

type Context = ReturnType<typeof useInitializer>;

const useInitializer = () => {
  const forceUpdate = useForceUpdate();

  return useWillMount(() => ({
    height: new Value<number>(0),
    toValue: new Value<number>(0),
    animating: new Value<number>(0),
    clock: new Clock(),
    finished: new Value<number>(0),
    time: new Value<number>(0),
    frameTime: new Value<number>(0),
    isAnimating: false,
    forceUpdate,
    ready: false,
    contentHeight: 0,
    collapsed: false,
  }));
};

const useHeight = (
  { easing, duration }: CollapsibleInternalProps,
  ctx: Context,
) =>
  React.useMemo(() => {
    return block([
      cond(
        ctx.animating,
        [
          timing(
            ctx.clock,
            {
              position: ctx.height,
              time: ctx.time,
              frameTime: ctx.frameTime,
              finished: ctx.finished,
            },
            {
              easing,
              duration,
              toValue: ctx.toValue,
            },
          ),
          cond(
            and(not(clockRunning(ctx.clock)), neq(ctx.height, ctx.toValue)),
            startClock(ctx.clock),
          ),
          cond(ctx.finished, [
            stopClock(ctx.clock),
            set(ctx.animating, 0),
            call([ctx.animating], () => {
              ctx.isAnimating = false;
              ctx.forceUpdate();
            }),
          ]),
        ],
        stopClock(ctx.clock),
      ),
      ctx.height,
    ]);
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, easing]);

const useContentTranslate = (
  ctx: Context,
  align: CollapsibleInternalProps['align'],
) => {
  const height = ctx.contentHeight;
  return React.useMemo(() => {
    if (align === 'top' || !height) {
      return 0;
    }
    return interpolate(ctx.height, {
      inputRange: [0, height],
      outputRange: [align === 'center' ? height / -2 : -height, 0],
      extrapolate: Extrapolate.CLAMP,
    });
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, align]);
};

const useHandleLayout = (
  { initial, collapsed }: CollapsibleInternalProps,
  ctx: Context,
  animateTo: (to: number) => void,
) => {
  React.useLayoutEffect(() => {
    if (ctx.ready && !initial) {
      ctx.height.setValue(ctx.contentHeight);
    }
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.ready]);

  const handleLayout = React.useCallback(
    (e: LayoutChangeEvent) => {
      const layoutHeight = e.nativeEvent.layout.height;
      if (layoutHeight === ctx.contentHeight || ctx.isAnimating) return;
      ctx.contentHeight = layoutHeight;

      if (!ctx.ready) {
        ctx.ready = true;
        ctx.forceUpdate();
        if (initial) {
          animateTo(layoutHeight);
        } else {
          ctx.height.setValue(layoutHeight);
        }
      } else if (!collapsed) {
        ctx.height.setValue(layoutHeight);
      }
    },
    //  eslint-disable-next-line react-hooks/exhaustive-deps
    [collapsed],
  );

  return ctx.isAnimating ? undefined : handleLayout;
};

const useAnimate = ({ collapsed }: CollapsibleInternalProps, ctx: Context) => {
  const animateTo = (to: number) => {
    ctx.time.setValue(0);
    ctx.frameTime.setValue(0);
    ctx.finished.setValue(0);
    ctx.toValue.setValue(to);
    ctx.animating.setValue(1);
  };

  React.useMemo(() => {
    ctx.isAnimating = collapsed || ctx.contentHeight !== 0;
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed]);

  React.useLayoutEffect(() => {
    if (ctx.isAnimating) {
      animateTo(collapsed ? 0 : ctx.contentHeight);
    }
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed]);

  return animateTo;
};

const CollapsibleInternal: React.FC<CollapsibleInternalProps> = (props) => {
  const { initial, style, contentContainerStyle, children, align } = props;
  const ctx = useInitializer();
  const height = useHeight(props, ctx);
  const animateTo = useAnimate(props, ctx);
  const handleLayout = useHandleLayout(props, ctx, animateTo);
  const translateY = useContentTranslate(ctx, align);
  const isReady = initial || ctx.ready;

  return (
    <Animated.View
      style={[style, isReady && { height }, { overflow: 'hidden' }]}>
      <Animated.View
        onLayout={handleLayout}
        style={[
          contentContainerStyle,
          { transform: [{ translateY }] },
          isReady && { position: 'absolute' },
        ]}>
        {children}
      </Animated.View>
    </Animated.View>
  );
};

export const Collapsible: React.FC<React.PropsWithChildren<CollapsibleProps>> =
  ({
    children,
    style,
    contentContainerStyle,
    collapsed,
    easing,
    duration,
    align,
  }) => {
    const initial = useConst(collapsed!);
    const mountedRef = React.useRef<boolean>();
    mountedRef.current = mountedRef.current || !collapsed;
    if (!mountedRef.current) return null;

    return (
      <CollapsibleInternal
        initial={initial}
        collapsed={collapsed!}
        style={style}
        contentContainerStyle={contentContainerStyle}
        easing={easing!}
        duration={duration!}
        align={align!}>
        {children}
      </CollapsibleInternal>
    );
  };

Collapsible.defaultProps = {
  align: 'top',
  collapsed: true,
  duration: 300,
  easing: Easing.out(Easing.cubic),
};
