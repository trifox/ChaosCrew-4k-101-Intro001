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
import { useController } from "react-hook-form";
import { makeSinTableXY } from "./SinusCanvasRender2d";
type SinusTypeXY = {
  x: SinusKeyFrameType;
  y: SinusKeyFrameType;
  iterationStart: number;
  iterationEnd: number;
};
export const SinusCanvasRender2dFull: React.FC<{
  data: SinusTypeXY[];
  width: string;
  height: number;
}> = ({ data, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mandelbrot = useMandelbrotContext();

  const timeline = useTimelineContext();
  const time = timeline.current;
  useEffect(() => {
    // okay here all sin values are calculated

    const values = data.map(({ x, y, iterationEnd, iterationStart }) =>
      makeSinTableXY({
        time,
        x,
        y,
        iterationEnd,
        iterationStart,
        maxIterations: mandelbrot.maxIterations,
        interpol: 1,
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
      const sinus = values[0];
      // console.log("time is ", time, sinus);
      if (canvasRef.current) {
        var ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, height);
          // console.log("maxiterations are", mandelbrot);
          ctx.beginPath();
          for (let i = 0; i < sinus.length; i++) {
            if (i === 0) {
              ctx.moveTo(
                sinus[i][0] * canvasRef.current.width +
                  canvasRef.current.width / 2,
                sinus[i][1] * height + canvasRef.current.height / 2
              );
            } else {
              ctx.lineTo(
                sinus[i][0] * canvasRef.current.width +
                  canvasRef.current.width / 2,
                sinus[i][1] * height + canvasRef.current.height / 2
              );
            }
          }

          ctx.stroke();
        }
      }
    }
  }, [width, height, data, time]);

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

export const SinusRenderFull: React.FC<{
  source: string;
}> = ({ source }) => {
  const { field: field1 } = useController({ name: source });
  return (
    <SinusCanvasRender2dFull
      data={field1.value as SinusTypeXY[]}
      width="400px"
      height={400}
    />
  );
};
