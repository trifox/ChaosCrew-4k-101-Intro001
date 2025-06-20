import {
  Datagrid,
  List,
  NumberField,
  TextField,
  useEditContext,
  useInput,
  useRecordContext,
  FormDataConsumerRenderParams,
  InjectedFieldProps,
  TextFieldProps,
} from "react-admin";
import React, { useEffect, useState, useRef, DOMElement } from "react";
import { GPU, IKernelRunShortcut, KernelFunction } from "gpu.js";
import { styled } from "@mui/system";
import Slider from "@mui/material/Slider";
import IconButton from "@mui/material/IconButton";
import PlayIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { Mandelbrot, MandelbrotKeyframeType } from "./mandelbrot/Mandelbrot";
import { useAnimationFrame } from "./util/useAnimationFrame";
import { SinusKeyFrameType } from "./RenderSinus";
import { cos3, sin3 } from "./mandelbrot/math";
import { useTimelineContext } from "./timeline/TimelineContext";
export const EnvelopeCanvasRender2d: React.FC<{
  data: SinusKeyFrameType;
  data2: SinusKeyFrameType;
  width: string;
  height: number;
}> = ({ data, data2, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { frequency, phase, amplitude, speed } = data;
  const {
    frequency: frequency2,
    phase: phase2,
    amplitude: amplitude2,
    speed: speed2,
  } = data2;

  const timeline = useTimelineContext();
  const time = timeline.current;
  useEffect(() => {
    //console.log("time is ", time);
    if (canvasRef.current) {
      var ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, height);

        ctx.beginPath();
        for (let i = 0; i < 1000; i++) {
          const valuex =
            sin3(
              time * speed +
                phase +
                ((i * frequency) / canvasRef.current.width) * Math.PI
            ) * amplitude;
          const valuey =
            cos3(
              time * speed2 +
                phase2 +
                ((i * frequency2) / canvasRef.current.width) * Math.PI
            ) * amplitude2;
          const x =
            canvasRef.current.width / 2 +
            valuex * (canvasRef.current.width / 2);
          const y =
            canvasRef.current.height / 2 +
            valuey * (canvasRef.current.height / 2);
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }
    }
  }, [
    width,
    height,
    phase,
    frequency,
    amplitude,
    phase2,
    frequency2,
    amplitude2,
    time,
  ]);

  return (
    /* @ts-ignore */
    <canvas
      width={width}
      height={height}
      ref={canvasRef}
      style={{
        border: "1px solid #d3d3d3",

        width,
        height,
      }}
    ></canvas>
  );
};
