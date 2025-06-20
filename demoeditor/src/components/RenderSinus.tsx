import { Datagrid, LabelPrefixContext, List, NumberField, TextField, useEditContext } from 'react-admin';
import React, { useEffect, useState, useRef, DOMElement, PropsWithChildren, useLayoutEffect } from 'react'
import { GPU, IKernelRunShortcut, KernelFunction } from 'gpu.js';
import { styled } from '@mui/system';
import { number } from 'prop-types';
import { useCurrentWidth } from './util/useCurrentWidth';
import useFullscreenStatus from './util/useFullscreenStatus';
import { renderIntoDocument } from 'react-dom/test-utils';

function rotateVector(vec: number[], ang: number) {
  const sina: number = Math.sin(ang)
  const cosa: number = Math.cos(ang)
  return [
    vec[0] * cosa - vec[1] * sina,
    vec[0] * sina + vec[1] * cosa
  ];
};
function lerp(v0: number, v1: number, t: number) {
  return v0 * (1 - t) + v1 * t
}
function lerps(v0: number[], v1: number[], t: number) {
  return v0.map((item, index) => lerp(v0[index], v1[index], t))
}
function explerp(v0: number, v1: number, t: number) {
  return Math.exp(lerp(Math.log(v0), Math.log(v1), t));
}

function createGPU() {
  const gpu = new GPU();
  gpu.addFunction(function sin3(a: number) {
    return (Math.sin(a) + Math.sin(a * 2) + Math.sin(a * 4) * Math.sin(a * 8) + Math.sin(a * .5) + Math.sin(a * .25)) / 6;
  });
  gpu.addFunction(lerp);
  gpu.addFunction(rotateVector);
  gpu.addFunction(explerp);
  gpu.addFunction(function cos3(a: number) {
    return (Math.cos(a) + Math.cos(a * 2) + Math.cos(a * 4) + Math.cos(a * 8) + Math.cos(a * 0.5) + Math.cos(a * 0.25)) / 5;
  });
  return gpu
}
const gpu = createGPU(); 
export interface SinusKeyFrameType {
 amplitude:number, // amplitude has no unit
speed:number, // speed is how many seconds for one full turn
phase:number; // range of 2*PI
frequency:number; // how many turns per speed quasi
 
}




const parseToFloat = (data: any) => {
  return parseFloat(data)
}
const parseToFloats = (data: any[]) => {
  return data && data.map(parseToFloat) || [0, 0]
}
export const RenderSinus = (props: PropsWithChildren<{  data: SinusKeyFrameType,  width: number, height: number }>) => {
 const {speed,frequency,amplitude,phase}=props.data 
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [sinCount, setSinCount] = useState<IKernelRunShortcut>()
  const [render, setRender] = useState<{render:IKernelRunShortcut}>()
   
  const cwidth = useCurrentWidth()
  //    console.log("CWIDTH IS ",cwidth)
  const fullscrreen = useFullscreenStatus(canvasContainerRef)[0]
  //  console.log("FULLSCREEN IS ",fullscrreen)

  const { data } = props  
  const renderIt = (renderParam: IKernelRunShortcut) => {
     
      // console.log('cwidth', cwidth)
      // console.log("JUST BEFORE RENDER CALL: sinscount",render?.sineCount,sineWaves2Length,sinPhase)
      console.log('rendering sinus',   amplitude,
      speed,
      phase,
      frequency)
    renderParam(
      amplitude??0,
speed??0,
phase??0,
frequency??0
 
    )
  }
  useEffect(() => {
    // console.log("FLUPPING RES",fullscrreen)
    const width =  props.width
    const height = props.height
    // console.log('Checking initialising render kernel')
    const renderd = createGPU().createKernel(function ( amplitude:number,speed:number,phase:number,frequency:number    ) {
      var coord =
      [
        /* @ts-ignore */
         this.thread.x / this.constants.WIDTH    ,
        /* @ts-ignore */
          this.thread.y / this.constants.HEIGHT   
      ]

        /* @ts-ignore */     
           this.color(sin3(coord[0]*frequency)*0.5-0.5,0,1,1)
 
         
    }).setOutput([width , height  ]).setConstants({ 
      WIDTH: width ,
      HEIGHT: height 
    }) 
    // .setDynamicArguments(true)
      .setGraphical(true)
    // console.log('Expect sines', props.data.sineWaves2?.length ?? 0)

    // console.log('Checking initialising render', renderd)
    //        renderd( 1,1,[])
    // setSinCount
    setRender({ render: renderd})
   
  }, [fullscrreen])

  if (render ) {
    //console.log('render')
    renderIt(render.render)
  }
  useEffect(() => {
    //   console.log('Checking initialising', canvasContainerRef, render)
    if (canvasContainerRef.current && render?.render) {
      //console.log('Appending child',canvasContainerRef.current,render.canvas)
      canvasContainerRef.current.appendChild(render.render.canvas)
      //  setSize({height:   canvasContainerRef.current.clientHeight,
      //   width:canvasContainerRef.current.clientWidth})

    }
    return () => {
      if (canvasContainerRef.current && render) {
        canvasContainerRef.current?.removeChild(render.render.canvas)
      }
    }
  }, [render])
  // render();

  // const canvas = render.canvas;
  // document.getElementsByTagName('body')[0].appendChild(canvas);

  // console.log('props are', record, rest.source)

  return (
    <ContainerDiv ref={canvasContainerRef}  ></ContainerDiv>

  )
}

const ContainerDiv = styled('div')`
 
height:100%;
width:100%;
> canvas {
  transform: scale(1);
  transform-origin: top left;
}

`