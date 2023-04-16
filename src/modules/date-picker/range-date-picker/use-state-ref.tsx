import { useCallback, useRef, useState } from "react";

export const useStateRef = <T,>(initialValue: T) => {
  const [val, setVal] = useState<T>(initialValue);
  const ref = useRef<T>(initialValue);

  const setter = useCallback((v: T) => {
    ref.current = v;
    setVal(v);
  }, []) as typeof setVal;

  return [val, setter, ref] as const;
};
