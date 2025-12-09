import { Signal } from '@fyclabs/tools-fyc-react/signals';
import { useCallback, useEffect } from 'react';
import breakPoints from '../scss/exportVars.module.scss';

export const $windowSize = Signal({
  windowSize: {
    breakPoint: null,
    height: null,
  },
});

const breakPointsRules = Object.entries(breakPoints).reduce((acc, [breakPoint, value]) => {
  const valueAsInt = parseInt(`${value}`.replace('px', ''), 10);
  const { lastBP, ...rest } = acc;
  return {
    ...rest,
    [breakPoint]: {
      min: valueAsInt,
      max: Number.MAX_SAFE_INTEGER,
    },
    ...(lastBP && {
      [lastBP]: {
        min: acc[lastBP].min,
        max: valueAsInt - 1,
      },
    }),
    lastBP: breakPoint,
  };
}, {});

function getCurrBreakpoint(newInnerWidth) {
  return Object.entries(breakPointsRules)
    .filter(([, { min, max }]) => min != null && max != null && newInnerWidth >= min && newInnerWidth <= max)[0]?.[0];
}

const useWindowSize = () => {
  const { windowSize } = $windowSize.value;
  const handleResize = useCallback(() => {
    const breakPoint = getCurrBreakpoint(window.innerWidth);
    if (breakPoint === windowSize.breakPoint) {
      $windowSize.update({
        windowSize,
      });
    } else {
      $windowSize.update({
        windowSize: {
          breakPoint,
          height: window.scrollY,
        },
      });
    }
  }, [windowSize]);

  const isBreakpointUp = useCallback((breakPointName) => {
    if (!windowSize.breakPoint) return false;
    const curr = breakPointsRules[windowSize.breakPoint];
    const check = breakPointsRules[breakPointName];
    return windowSize.breakPoint === breakPointName || check.max <= curr.min;
  }, [windowSize]);

  const isBreakpoint = useCallback((breakPointName) => windowSize.breakPoint === breakPointName, [windowSize]);

  const isBreakpointDown = useCallback((breakPointName) => {
    if (!windowSize.breakPoint) return false;
    const curr = breakPointsRules[windowSize.breakPoint];
    const check = breakPointsRules[breakPointName];
    return windowSize.breakPoint === breakPointName || check.min >= curr.max;
  }, [windowSize]);

  useEffect(() => {
    window.addEventListener('resize', handleResize); // Add event listener
    handleResize();
    return () => window.removeEventListener('resize', handleResize); // Remove event listener
  }, [handleResize]);

  return { ...windowSize, isBreakpoint, isBreakpointUp, isBreakpointDown };
};

export default useWindowSize;
