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
import { Mandelbrot, MandelbrotKeyframeType } from "./Mandelbrot";
import { useAnimationFrame } from "../util/useAnimationFrame";
export const KeyframePreview: React.FC<{}> = (props: any) => {
  const record = useRecordContext(props);

  return (
    <div>
      <Mandelbrot
        maxIterations={128}
        data={record as MandelbrotKeyframeType}
        globalTime={0}
        once={true}
        width={160}
        height={90}
      />
    </div>
  );
};
