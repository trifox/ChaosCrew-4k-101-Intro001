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
import { useMandelbrotContext as useMandelbrotContext } from "./timeline/MandelbrotContext";
type SineTable = {
  x: SinusKeyFrameType;
  y: SinusKeyFrameType;
  iterationStart: number;
  iterationEnd: number;
};
export const makeSinTableList = ({
  time,
  maxIterations,
  data,
  interpols,
}: {
  time: number;
  maxIterations: number;
  data: SineTable[];
  interpols: number[];
}): [number, number][] => {
  const values = data.map(({ x, y, iterationEnd, iterationStart }, index) =>
    makeSinTableXY({
      time,
      x,
      y,
      iterationEnd,
      iterationStart,
      maxIterations,
      interpol: interpols[index],
    })
  );
  // then we add them out again and render :)
  if (values.length > 0) {
    for (let j = 0; j < values[0].length; j++) {
      for (let k = 1; k < values.length; k++) {
        values[0][j][0] += values[k][j][0];
        values[0][j][1] += values[k][j][1];
      }
      // values[0][j][0] = values[0][j][0] / values.length;
      // values[0][j][1] = values[0][j][1] / values.length;
    }
    return values[0];
  }
  return [];
};

export const makeSinTableXY = ({
  time,
  x,
  y,
  iterationStart,
  iterationEnd,
  maxIterations,
  interpol,
}: {
  time: number;
  x: SinusKeyFrameType;
  y: SinusKeyFrameType;
  iterationStart: number;
  iterationEnd: number;
  maxIterations: number;
  interpol: number;
}) => {
  time /= 1000;
  const { frequency, phase, amplitude, speed } = x;
  const {
    frequency: frequency2,
    phase: phase2,
    amplitude: amplitude2,
    speed: speed2,
  } = y;
  const result = Array(maxIterations).fill([0, 0]);
  console.log("sintable size is", maxIterations, result.length);
  for (let i = iterationStart; i < iterationEnd && i < maxIterations; i++) {
    const normalizedIteration = i / maxIterations;
    var range = (i - iterationStart) / (iterationEnd - iterationStart);
    range = Math.sin(Math.PI * range); // blend in/out simple using sine
    // console.log("range is ", i, range);
    const valuex =
      range *
      sin3(time * speed + phase + normalizedIteration * frequency * Math.PI) *
      amplitude;
    const valuey =
      range *
      cos3(time * speed + phase2 + normalizedIteration * frequency2 * Math.PI) *
      amplitude2;
    result[i] = [valuex * interpol, valuey * interpol];
  }
  console.log("sintable size is2", maxIterations, result.length);
  return result;
};
export const makeSinTablezzz = ({
  time,
  x,
  iterationStart,
  iterationEnd,
  maxIterations,
  interpol,
}: {
  time: number;
  x: SinusKeyFrameType;
  y: SinusKeyFrameType;
  iterationStart: number;
  iterationEnd: number;
  maxIterations: number;
  interpol: number;
}) => {
  time /= 1000;
  const { frequency, phase, amplitude, speed } = x;

  const result = Array(maxIterations).fill([0, 0]);
  for (let i = iterationStart; i < iterationEnd || i < maxIterations; i++) {
    const normalizedIteration = i / maxIterations;
    var range = (i - iterationStart) / (iterationEnd - iterationStart);
    range = Math.sin(Math.PI * range); // blend in/out simple using sine
    // console.log("range is ", i, range);
    const valuex =
      range *
      sin3(time * speed + phase + normalizedIteration * frequency * Math.PI) *
      amplitude;

    result[i] = valuex * interpol;
  }
  return result;
};

export const SinusCanvasRender2d: React.FC<{
  data: SinusKeyFrameType;
  data2: SinusKeyFrameType;
  iterationStart: number;
  iterationEnd: number;
  width: string;
  height: number;
}> = ({ data, data2, width, height, iterationStart, iterationEnd }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { frequency, phase, amplitude, speed } = data;
  const {
    frequency: frequency2,
    phase: phase2,
    amplitude: amplitude2,
    speed: speed2,
  } = data2;

  const mandelbrot = useMandelbrotContext();

  const timeline = useTimelineContext();
  const time = timeline.current;
  useEffect(() => {
    const sinus = makeSinTableXY({
      time,
      x: data,
      y: data2,
      iterationEnd,
      iterationStart,
      maxIterations: mandelbrot.maxIterations,
      interpol: 1,
    });
    const maxAmp = Math.max(data.amplitude, data2.amplitude) * 2;
    //console.log("time is ", time);
    if (canvasRef.current) {
      var ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, height);
        // console.log("maxiterations are", mandelbrot);
        ctx.beginPath();
        for (let i = 0; i < sinus.length; i++) {
          if (i === 0) {
            ctx.moveTo(
              (sinus[i][0] / maxAmp) * canvasRef.current.width +
                canvasRef.current.width / 2,
              (sinus[i][1] / maxAmp) * height + canvasRef.current.height / 2
            );
          } else {
            ctx.lineTo(
              (sinus[i][0] / maxAmp) * canvasRef.current.width +
                canvasRef.current.width / 2,
              (sinus[i][1] / maxAmp) * height + canvasRef.current.height / 2
            );
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
