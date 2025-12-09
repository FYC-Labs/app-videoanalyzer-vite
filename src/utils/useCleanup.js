import { useEffect } from 'react';

const useCleanup = signals => {
  useEffect(
    () => {
      if (Array.isArray(signals)) {
        signals.forEach(signal => signal.reset());
      } else {
        signals.reset?.();
      }
    },
    [signals],
  );
};

export default useCleanup;
