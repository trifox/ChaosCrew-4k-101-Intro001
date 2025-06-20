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
import { sin3 } from "./mandelbrot/math";
import { useTimelineContext } from "./timeline/TimelineContext";
export type CoordinateSystem = {
  center: number[];
  xAxis: number[];
  yAxis: number[];
};
export const drawCoordinateSystem = (
  canvas: HTMLCanvasElement,
  corrds: CoordinateSystem
) => {
  var ctx = canvas.getContext("2d");
  if (ctx) {
    const centerx = Math.round(canvas.width / 2);
    const centery = Math.round(canvas.height / 2);
    ctx.strokeStyle = "lightblue";
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      ctx.moveTo(0, i * Math.round(canvas.height / 10));
      ctx.lineTo(canvas.width, i * Math.round(canvas.height / 10));

      ctx.moveTo(i * Math.round(canvas.width / 10), 0);
      ctx.lineTo(i * Math.round(canvas.width / 10), canvas.height);
    }

    ctx.stroke();
    ctx.strokeStyle = "blue";

    ctx.beginPath();
    ctx.moveTo(0, centery);
    ctx.lineTo(canvas.width, centery);

    ctx.moveTo(centerx, 0);
    ctx.lineTo(centerx, canvas.height);
    ctx.stroke();
    ctx.fillText("x: " + corrds?.xAxis[0], 0, centery);
    ctx.fillText(
      "x: " +
        (corrds.xAxis[0] + corrds.xAxis[1]) / 2 +
        " y: " +
        (corrds.yAxis[0] + corrds.yAxis[1]) / 2,
      centerx,
      centery
    );
  }
};
export const SinusCanvasRender: React.FC<{
  data: SinusKeyFrameType;
  width: string;
  height: number;
}> = ({ data, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { frequency, phase, amplitude, speed } = data;
  const { current: currentTime } = useTimelineContext();
  useEffect(() => {
    // get max scale of sine
    const scaleFac = 1 / amplitude;
    if (canvasRef.current) {
      var ctx = canvasRef.current.getContext("2d");

      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, height);

        ctx.strokeStyle = "black";
        ctx.beginPath();
        for (let i = 0; i < canvasRef.current.width; i++) {
          const value =
            sin3(
              (currentTime / 1000) * speed +
                phase +
                ((i * frequency) / canvasRef.current.width) * Math.PI
            ) *
            ((amplitude * canvasRef.current.height) / 2) *
            scaleFac;
          ctx.moveTo(i, canvasRef.current.height / 2);
          ctx.lineTo(i, canvasRef.current.height / 2 + value);
        }

        ctx.stroke();
        drawCoordinateSystem(canvasRef.current, {
          center: [0, 0],
          xAxis: [0, frequency],
          yAxis: [-scaleFac, scaleFac],
        });
      }
    }
  }, [width, height, phase, frequency, amplitude, currentTime]);

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
