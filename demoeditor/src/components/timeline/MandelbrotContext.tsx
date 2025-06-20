import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { useAnimationFrame } from "../util/useAnimationFrame";
export const MandelbrotContext = createContext<{
  maxIterations: number;
  setMaxIterations: (number: number) => void;
}>({
  maxIterations: 250,
  setMaxIterations: () => {},
});

export const TimelineContextProvider: React.FunctionComponent<
  PropsWithChildren
> = ({ children }) => {
  const [maxIterations, setMaxIterations] = useState(250);
  return (
    <MandelbrotContext.Provider
      value={{
        maxIterations,
        setMaxIterations,
      }}
    >
      {children}
    </MandelbrotContext.Provider>
  );
};
export const useMandelbrotContext = () => {
  return useContext(MandelbrotContext);
};
