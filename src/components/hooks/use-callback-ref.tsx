import { useCallback, useEffect, useRef } from "react";

export const useCallbackRef = <T extends (...args: any[]) => any>(callback: T) => {
  const ref = useRef<T>(callback);

  useEffect(() => {
    ref.current = callback;
  });

  const cb = useCallback((...args: Parameters<T>): ReturnType<T> => {
    return ref.current(...args);
  }, []);

  return cb;
};
