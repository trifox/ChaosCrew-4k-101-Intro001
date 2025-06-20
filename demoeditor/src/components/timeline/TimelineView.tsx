import { Box, IconButton, Paper, Slider, Checkbox } from "@mui/material";
import { useTimelineContext } from "./TimelineContext";
import {
  getFormattedTimeForFrameAndFps,
  padWithZero,
  TimeView,
} from "./TimeView";

import PlayIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import RewindIcon from "@mui/icons-material/FirstPage";
import { useEffect, useState } from "react";
export const TimelineView = () => {
  const {
    frame,
    fps,
    maxFrames,
    isPlaying,
    range,
    pause,
    play,
    stop,
    setFps,
    setFrame,
    setMaxFrames,
  } = useTimelineContext();
  const [marks, setMarks] = useState<{ value: number; label?: string }[]>([]);
  const [snap, setSnap] = useState<boolean>(true);
  useEffect(() => {
    const markies = [];
    for (let i = 0; i < maxFrames; i += fps) {
      markies.push({ value: i });
    }
    setMarks(markies);
  }, [maxFrames, fps]);

  return (
    <Paper sx={{ width: "100%" }}>
      {/* Current Frame {padWithZero(frame, 6)} / {padWithZero(maxFrames, 6)} */}
      FPS: {padWithZero(fps, 4)}
      {/* <IconButton onClick={() => setFrame(0)}  >
            <RewindIcon />
        </IconButton> */}
      <IconButton onClick={() => (isPlaying ? pause() : play())}>
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </IconButton>
      {/* <Checkbox checked={snap} onClick={() => setSnap(!snap)} />Snap Frame
        <TimeView frame={frame} fps={fps}></TimeView>
        <Slider
            onChange={(evt, value) => setFrame(value as number)}
            min={0}
            max={maxFrames}
            valueLabelDisplay={'on'}
            value={frame}
            track='normal'
            step={snap ? null : 1}
            valueLabelFormat={(data => {
                return 'frame ' + data + ': ' + getFormattedTimeForFrameAndFps(data, fps)
            })}
            marks={marks}
        />
        <Slider
            min={0}
            max={maxFrames}
            value={range}
            track='normal'
            marks={marks}
        /> */}
    </Paper>
  );
};
