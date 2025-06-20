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
import { lerp } from "./math";

const gpu = createGPU();
export type Vector2 = [number, number];
export interface ExplicitMandelbrotKeyframeType {
  id: string;
  seedShift: Vector2;
  zoomStartEnd: Vector2;
  location: Vector2;
  startEndIterationA: Vector2;
  startEndIterationB: Vector2;
  angleStartEnd: Vector2;
  destription: string;
  pertubations: {
    iteration: number;
    iterationRadius: number;
    pertubation: number[];
  }[];
}

const parseToFloat = (data: any) => {
  return parseFloat(data);
};
const parseToFloats = (data: any[]) => {
  return (data && data.map(parseToFloat)) || [0, 0];
};
export const ExplicitMandelbrotKeyframes = (
  props: PropsWithChildren<{
    time: number;
    maxIterations: number;
    data: ExplicitMandelbrotKeyframeType;
    globalTime: number;
    once: boolean;
    width: number;
    height: number;
  }>
) => {
  const ITERS = Math.floor(props.maxIterations);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [sinCount, setSinCount] = useState<IKernelRunShortcut>();
  const [render, setRender] = useState<{ render: IKernelRunShortcut }>();
  const cwidth = useCurrentWidth();
  //    console.log("CWIDTH IS ",cwidth)
  const fullscrreen = useFullscreenStatus(canvasContainerRef)[0];
  //  console.log("FULLSCREEN IS ",fullscrreen)

  const { data } = props;
  const renderIt = (renderParam: IKernelRunShortcut) => {
    /**
     *  before rendering we create the pertubation array to be used for each iteration
     *  */
    const pertubations = Array(ITERS * 2).fill(0);
    // console.log('input pertubations are', data.pertubations)

    const project = function gauss(x: number, pos: number, width: number) {
      return x * Math.sin((pos / width) * Math.PI);
    };

    if (data.pertubations) {
      data.pertubations.forEach((pertubation) => {
        for (let i = 0; i < pertubation.iterationRadius * 2; i++) {
          pertubations[
            2 * (pertubation.iteration - pertubation.iterationRadius + i)
          ] = project(
            pertubation.pertubation[0],
            i,
            pertubation.iterationRadius * 2
          );
          pertubations[
            2 * (pertubation.iteration - pertubation.iterationRadius + i) + 1
          ] = project(
            pertubation.pertubation[1],
            i,
            pertubation.iterationRadius * 2
          );
        }
      });
    }
    // console.log('pertubations are', pertubations)
    renderParam(
      props.globalTime,
      parseToFloat(props.data.zoomStartEnd[0]),
      parseToFloats(props.data.location),
      (props.data.angleStartEnd[0] / 180) * Math.PI,
      ITERS,
      pertubations
    );
  };
  useEffect(() => {
    // console.log("FLUPPING RES",fullscrreen)
    const width = fullscrreen ? cwidth : props.width;
    const height = fullscrreen ? cwidth * (9 / 16) : props.height;
    // console.log('Checking initialising render kernel')
    const renderd = createGPU()
      .createKernel(function (
        t: number,
        scale: number,
        location: number[],
        angle: number,
        maxIterations: number,
        pertubations: number[]
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
        var iter = 0;
        /* @ts-ignore */
        for (let i = 0; i < maxIterations; i++) {
          z = [z[0] * z[0] - z[1] * z[1], 2.0 * z[0] * z[1]];
          z[0] += coord[0];
          z[1] += coord[1];

          z[0] += pertubations[i * 2];
          z[1] += pertubations[i * 2 + 1];

          //         if(i>startIteration&& i<endIteration){
          //         sins+=data.sinSpeed;
          //         z+=vec2(sin3(sins[0]),cos3(sins[1]))*mix(data.sinFactStartEnd[0],data.sinFactStartEnd[1],(i-startIteration)/size );
          // }
          if (z[0] * z[0] + z[1] * z[1] > 16) break;
          //            l += 1.0;
          iter++;
        }
        const color1 = [0, 0.35, 0.5];
        const color2 = [1, 0.95, 0.1];
        /* @ts-ignore */
        const normalizedIter = iter / maxIterations;
        const hugi = 1 - normalizedIter;
        /* @ts-ignore */
        this.color(
          iter / maxIterations,
          iter / maxIterations,
          iter / maxIterations,
          0
        );
        if (iter === maxIterations) {
          this.color(color1[0], color1[1], color1[2], 1);
        } else {
          /* @ts-ignore */
          //this.color(sin3(13*iter/1024),cos3(34*iter/1024), sin3(15*iter/1024), 1)

          if (iter % 2 === 0) {
            this.color(
              lerp(color2[0], color1[0], (hugi * 4) % 1),
              lerp(color2[1], color1[1], (hugi * 4) % 1),
              lerp(color2[2], color1[2], (hugi * 4) % 1),
              1
            );
          } else {
            this.color(
              lerp(color1[0], color2[0], (hugi * 4) % 1),
              lerp(color1[1], color2[1], (hugi * 4) % 1),
              lerp(color1[2], color2[2], (hugi * 4) % 1),
              1
            );
          }
        }
      })
      .setOutput([width, height])
      .setConstants({
        WIDTH: width,
        HEIGHT: height,
      })
      // .setDynamicArguments(true)
      .setGraphical(true);
    //.setTactic('precision')
    // console.log('Expect sines', props.data.sineWaves2?.length ?? 0)

    // console.log('Checking initialising render', renderd)
    //        renderd( 1,1,[])
    // setSinCount
    setRender({ render: renderd });
    if (props.once) {
      renderIt(renderd);
    }
  }, [fullscrreen]);

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
