import { useRef } from 'react';

type ThrottleCallback<T extends unknown[]> = (...args: T) => void;

type ThrottleOptions = {
  leading?: boolean;
  trailing?: boolean;
};

const useThrottle = <T extends unknown[]>(
  callback: ThrottleCallback<T>,
  time: number,
  options: ThrottleOptions = {}
) => {
  const isWaiting = useRef(false);
  const timerId = useRef<NodeJS.Timeout | null>(null);

  const { leading = true, trailing = true } = options;

  return (...args: T) => {
    if (!isWaiting.current && leading) {
      callback(...args);
      isWaiting.current = true;

      setTimeout(() => {
        isWaiting.current = false;
      }, time);
    }

    if (trailing) {
      if (timerId.current) clearTimeout(timerId.current);
      timerId.current = setTimeout(() => {
        callback(...args);
      }, time);
    }
  };
};

export default useThrottle;
