import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { useAnimationFrame } from "../util/useAnimationFrame";
export const TimelineContext = createContext({
  frame: 0,
  maxFrames: 1,
  current: 0,
  fps: 25,
  isPlaying: false,
  range: [0, 0],
  setFrame: (i: number) => {},
  setMaxFrames: (i: number) => {},
  setFps: (i: number) => {},
  play: () => {},
  pause: () => {},
  stop: () => {},
});
export const TimelineContextProvider: React.FunctionComponent<
  PropsWithChildren
> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [frame, setFrame] = useState(1);
  const [maxFrames, setMaxFrames] = useState(1000);
  const [range, setRange] = useState([100, 500]);
  const [fps, setFps] = useState(30);
  const playRef = useRef(false);
  const [timeCountRef, setTimeCountRef] = useState(0);

  const play = useCallback(() => {
    setIsPlaying(true);
    playRef.current = true;
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
    playRef.current = false;
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    playRef.current = false;

    setFrame(0);
  }, []);
  useAnimationFrame((deltaTime) => {
    //   console.log('p0laying',playing,stateRef.current)
    if (playRef.current) {
      setTimeCountRef((timeCountRef) => timeCountRef + deltaTime);
      //   if (timeCountRef.current > Math.floor(1000 / fps)) {
      //     timeCountRef.current -= Math.floor(1000 / fps);

      //     setFrame((frame) => {
      //       if (frame + 1 > maxFrames) {
      //         return frame + 1 - maxFrames;
      //       } else {
      //         return frame + 1;
      //       }
      //     });
      //   }
    }
  });
  return (
    <TimelineContext.Provider
      value={{
        fps,
        isPlaying,
        frame,
        maxFrames,
        setFrame,
        setMaxFrames,
        range,
        setFps,
        play,
        pause,
        stop,
        current: timeCountRef,
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
};
export const useTimelineContext = () => {
  return useContext(TimelineContext);
};
