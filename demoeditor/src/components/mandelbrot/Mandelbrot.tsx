import {
  Datagrid,
  LabelPrefixContext,
  List,
  NumberField,
  TextField,
  useEditContext,
} from "react-admin";
import React, {
  useEffect,
  useState,
  useRef,
  DOMElement,
  PropsWithChildren,
  useLayoutEffect,
} from "react";
import { GPU, IKernelRunShortcut, KernelFunction } from "gpu.js";
import { styled } from "@mui/system";
import { number } from "prop-types";
import { useCurrentWidth } from "../util/useCurrentWidth";
import useFullscreenStatus from "../util/useFullscreenStatus";
import { renderIntoDocument } from "react-dom/test-utils";
import { createGPU } from "./gpu";
import { cos3, lerp, lerps, sin3 } from "./math";
import { FFT } from "tone";
import { Tone } from "tone/build/esm/core/Tone";
import FFTFun from "../fft/FFTFun";
import { getValueForTimelineFrame } from "../timeline/TimelineCalculator";
import { useTimelineContext } from "../timeline/TimelineContext";
import { makeSinTableList } from "../SinusCanvasRender2d";
import { ease } from "../util/math.easing";
function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
      ]
    : [0, 0, 0];
}

const gpu = createGPU();
export type Vector2 = [number, number];

export interface SineWave {
  speed: number;
  amplitude: number;
  frequency: number;
  phase: number;
}
export interface SineWave2D {
  iterationStart: number;
  iterationEnd: number;
  x: SineWave;
  y: SineWave;
}
export interface Pertubation {
  iteration: number;
  iterationRadius: number;
  pertubation: number[];
}
export interface MandelbrotKeyframeType {
  id: string;
  color1: string;
  color2: string;
  color3: string;
  frame: number;
  zoomStartEnd: Vector2;
  location: Vector2;
  sinSpeed: Vector2;
  sinInitSpeed: Vector2;
  startEndIterationA: Vector2;
  startEndIterationB: Vector2;
  angleStartEnd: Vector2;
  destription: string;
  sineWaves2?: SineWave2D[];
  pertubations: Pertubation[];
  KEYFRAMES: any;
  julia: boolean;
}

const project = function gauss(x: number, pos: number, width: number) {
  return x * Math.sin((pos / width) * Math.PI);
};

const parseToFloat = (data: any) => {
  return parseFloat(data);
};
const parseToFloats = (data: any[]) => {
  return (data && data.map(parseToFloat)) || [0, 0];
};
let beat = new Audio("/soundeffect.wav");
let gong = new Audio("/gong.wav");
let tick = new Audio("/tick.wav");
let currentTick = 0;
export const Mandelbrot = (
  props: PropsWithChildren<{
    maxIterations: number;
    data: MandelbrotKeyframeType;
    globalTime: number;
    once: boolean;
    width: number;
    height: number;
  }>
) => {
  const ITERS = Math.floor(props.maxIterations || 128);
  // const FFTT = FFTFun.getFFT();
  //  console.log("FFT IS",FFTT)
  console.log("PROPS ARE", props);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [sinCount, setSinCount] = useState<IKernelRunShortcut>();
  const [render, setRender] = useState<{
    sineCount: number;
    render: IKernelRunShortcut;
  }>();
  const cwidth = useCurrentWidth();
  //    console.log("CWIDTH IS ",cwidth)
  const fullscrreen = useFullscreenStatus(canvasContainerRef)[0];
  //  console.log("FULLSCREEN IS ",fullscrreen)
  const { frame, current: currentTime } = useTimelineContext();
  const { data } = props;
  const { sineWaves2, color1, color2, color3 } = data;
  const sineWaves2Length = sineWaves2?.length ?? 0;
  const renderIt = (renderParam: IKernelRunShortcut) => {
    // console.log('using render params', data)
    // const pertubations = Array(ITERS * 2).fill(0);
    // const fft = FFTFun.getFFTSmoothed();
    for (let i = 0; i < 64; i++) {
      // pertubations[i + 300] = fft[i] * 0.0025
    }
    var pertubations: number[] = Array(props.maxIterations * 2).fill(0);
    // KEYFRAMES.pertubations.0.pertubation.framesFIELD FOUND
    if (data.pertubations) {
      data.pertubations.forEach((pertubation: Pertubation, index) => {
        for (let i = 0; i < pertubation.iterationRadius * 2; i++) {
          // console.log('data is', data)
          let value: number[] = pertubation.pertubation;
          // console.log("VALYE IS", value)
          pertubations[
            2 * (pertubation.iteration - pertubation.iterationRadius + i)
          ] += project(value[0], i, pertubation.iterationRadius * 2);
          pertubations[
            2 * (pertubation.iteration - pertubation.iterationRadius + i) + 1
          ] += project(value[1], i, pertubation.iterationRadius * 2);
        }
      });
    }

    const intervalAnim = 1000;
    // funky anim
    let interpols = Array(sineWaves2Length).fill(1);
    const tcalc =
      (currentTime / 2) %
      (intervalAnim * 2 + sineWaves2Length * intervalAnim + 1000);
    if (tcalc < intervalAnim * 2) {
      gong.pause();
      gong.currentTime = 0;
      beat.pause();
      beat.currentTime = 0;
    }
    // console.log(tcalc, Math.floor(tcalc));
    for (let k = 0; k < sineWaves2Length; k++) {
      if (
        tcalc >= intervalAnim * 2 + k * intervalAnim &&
        tcalc < intervalAnim * 2 + (k + 1) * intervalAnim
      ) {
        if (k == 0) {
          if (gong.currentTime == 0) {
            setTimeout(() => gong.play(), 500);
          }
        } else if (k == sineWaves2Length - 1) {
          if (beat.currentTime == 0) {
            setTimeout(() => beat.play(), 750);
          }
        } else {
          if (currentTick != k) {
            tick.play();
            currentTick = k;
          }
        }
        interpols[k] =
          1 -
          ease(
            ((tcalc - (intervalAnim + k * intervalAnim)) / intervalAnim) % 1,
            {
              easingIn: k < sineWaves2Length - 1 ? "quad" : "quad",
              easingOut: k < sineWaves2Length - 1 ? "back" : "elastic",
            }
          );
      } else if (tcalc > intervalAnim * 2 + k * intervalAnim) {
        interpols[k] = 0;
      } else {
        interpols[k] = 1;
      }
    }
    // console.log("interpols", tcalc, interpols);
    var sineAdds: [number, number][] = Array(props.maxIterations).fill([0, 0]);

    if (props.data.sineWaves2 && props.data.sineWaves2.length > 0) {
      /**
       * build iteration pertubations from sinus inputs
       */
      sineAdds = makeSinTableList({
        time: currentTime,
        maxIterations: ITERS,
        data: props.data.sineWaves2,
        interpols,
      });
      // console.log("XXX", ITERS);
    }

    sineAdds = sineAdds.map((item, index) => [
      item[0] + (pertubations[index] || 0),
      item[1] + (pertubations[index] || 0),
    ]);
    // console.log("render are", sineAdds.flat());
    // console.log("JUST BEFORE RENDER CALL: sinscount", sineAdds.flat(), ITERS);
    let location: number[] = data.location;
    renderParam(
      parseToFloat(props.data.zoomStartEnd[0]),
      parseToFloats(location),
      (props.data.angleStartEnd[0] / 180) * Math.PI,
      ITERS,

      sineAdds.flat(),
      data.julia ?? false
    );
  };

  useEffect(() => {
    // console.log("FLUPPING RES",fullscrreen)
    const width = fullscrreen ? cwidth : props.width;
    const height = fullscrreen ? cwidth * (9 / 16) : props.height;
    // console.log('Checking initialising render kernel')
    const renderd = createGPU()
      .createKernel(function (
        scale: number,
        location: number[],
        angle: number,
        maxIterations: number,
        pertubations: number[],
        julia: boolean
      ) {
        var coord = [
          /* @ts-ignore */
          ((this.thread.x / this.constants.WIDTH) * 2 - 1) * scale,
          /* @ts-ignore */
          ((this.thread.y / this.constants.HEIGHT) * 2 - 1) * scale,
        ];
        /* @ts-ignore */
        coord = rotateVector(coord, angle);
        coord[0] += location[0];
        coord[1] += location[1];
        // const sines2 = [0, 0, 0, 0]
        // for (let i = 0; i < this.constants.NUMBER_OF_SINES; i++) {
        //   sines2[i * 2] = sin2Phase[i * 2 + 0] + t * sin2Speed[i * 2]
        //   sines2[i * 2 + 1] = sin2Phase[i * 2 + 1] + t * sin2Speed[i * 2 + 1]
        // }

        var z = [0, 0];
        if (julia) {
          z = [coord[0], coord[1]];
          coord = [0, 0];
        }
        var iter = 0;
        var sqx = 0;
        var sqy = 0;
        /* @ts-ignore */
        for (let i = 0; i < maxIterations; i++) {
          sqx = z[0] * z[0];
          sqy = z[1] * z[1];
          z = [
            sqx - sqy + coord[0] + pertubations[i * 2],
            2.0 * z[0] * z[1] + coord[1] + pertubations[i * 2 + 1],
          ];

          if (sqx + sqy > 16) break;
          //            l += 1.0;
          iter++;
        }

        /* @ts-ignore */
        const normalizedIter = iter / maxIterations;
        const hugi = 1 - normalizedIter;
        // /* @ts-ignore */
        // this.color(
        //   iter / maxIterations,
        //   iter / maxIterations,
        //   iter / maxIterations,
        //   0
        // );
        if (iter === maxIterations) {
          /* @ts-ignore */
          this.color(
            /* @ts-ignore */
            this.constants.COLOR1[0] * (1 - Math.abs(z[0])),
            /* @ts-ignore */
            this.constants.COLOR1[1] * (1 - Math.abs(z[0])),
            /* @ts-ignore */
            this.constants.COLOR1[2] * (1 - Math.abs(z[0])),
            1
          );
        } else {
          /* @ts-ignore */
          //this.color(sin3(13*iter/1024),cos3(34*iter/1024), sin3(15*iter/1024), 1)

          this.color(
            /* @ts-ignore */
            lerp(
              /* @ts-ignore */
              this.constants.COLOR2[0],
              /* @ts-ignore */
              this.constants.COLOR3[0],
              (hugi * 1) % 1
            ),
            lerp(
              /* @ts-ignore */
              this.constants.COLOR2[1],
              /* @ts-ignore */
              this.constants.COLOR3[1],
              /* @ts-ignore */
              (hugi * 1) % 1
            ),
            lerp(
              /* @ts-ignore */
              this.constants.COLOR2[2],
              /* @ts-ignore */
              this.constants.COLOR3[2],
              (hugi * 1) % 1
            ),
            /* @ts-ignore */
            1
          );
        }
        // }
        // this.color(Math.sin(hugi * Math.PI), Math.sin(hugi * Math.PI * 10), Math.sin(hugi * Math.PI),)
        // this.color(
        //   cos3(hugi * Math.PI * 14) * 0.5 + 0.5,
        //   Math.cos(hugi * Math.PI * 23) * 0.5 + 0.5,
        //   Math.sin(hugi * Math.PI * 2) * 0.5 + 0.5,
        //   1
        // );
        // }
      })
      .setOutput([width, height])
      .setConstants({
        WIDTH: width,
        COLOR1: hexToRgb(color1),
        COLOR2: hexToRgb(color2),
        COLOR3: hexToRgb(color3),
        HEIGHT: height,
        NUMBER_OF_SINES: props.data.sineWaves2?.length ?? 0,
      })
      // .setDynamicArguments(true)
      .setGraphical(true)
      // console.log('color is', hexToRgb(data.color2))
      //      .setPrecision("single")
      .setTactic("precision");
    // console.log('Expect sines', props.data.sineWaves2?.length ?? 0)

    // console.log('Checking initialising render', renderd)
    //        renderd( 1,1,[])
    // setSinCount
    setRender({ sineCount: sineWaves2Length, render: renderd });
    if (props.once) {
      renderIt(renderd);
    }
  }, [fullscrreen, sineWaves2Length, color1, color2]);

  if (render && !props.once) {
    //console.log('render')
    renderIt(render.render);
  }
  useEffect(() => {
    //   console.log('Checking initialising', canvasContainerRef, render)
    if (canvasContainerRef.current && render?.render) {
      //console.log('Appending child',canvasContainerRef.current,render.canvas)
      canvasContainerRef.current.appendChild(render.render.canvas);
      //  setSize({height:   canvasContainerRef.current.clientHeight,
      //   width:canvasContainerRef.current.clientWidth})
    }
    return () => {
      if (canvasContainerRef.current && render) {
        canvasContainerRef.current?.removeChild(render.render.canvas);
      }
    };
  }, [render]);
  // render();

  // const canvas = render.canvas;
  // document.getElementsByTagName('body')[0].appendChild(canvas);

  // console.log('props are', record, rest.source)

  return <ContainerDiv ref={canvasContainerRef}></ContainerDiv>;
};

const ContainerDiv = styled("div")`
  height: 100%;
  width: 100%;
  > canvas {
    transform: scale(1);
    transform-origin: top left;
  }
`;
