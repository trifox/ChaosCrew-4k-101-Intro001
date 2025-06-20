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
export type Vector2 = [number, number];
export interface MandelbrotKeyframeType {
  data:{
  speed: number, 
  amplitude: number, 
  frequency: number, 
  phase: number
  }
}




const parseToFloat = (data: any) => {
  return parseFloat(data)
}
const parseToFloats = (data: any[]) => {
  return data && data.map(parseToFloat) || [0, 0]
}
export const SineWaveRender = (props: PropsWithChildren<{ time: number, data: MandelbrotKeyframeType, globalTime: number, once: boolean, width: number, height: number }>) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [render, setRender] = useState<IKernelRunShortcut>()
  const cwidth = useCurrentWidth()
  //    console.log("CWIDTH IS ",cwidth)
  const fullscrreen = useFullscreenStatus(canvasContainerRef)[0]
  //  console.log("FULLSCREEN IS ",fullscrreen)

  const renderIt = (render: IKernelRunShortcut) => {

    // console.log(';render')
    render(
      props.globalTime  
    )
  }
  useEffect(() => {
    // console.log("FLUPPING RES",fullscrreen)
    const width = fullscrreen ? cwidth : props.width
    const height = fullscrreen ? cwidth * (9 / 16) : props.height
    // console.log('Checking initialising render kernel')
    const renderd = createGPU().createKernel(function (t: number
    ) {
      var coord =
        [
          /* @ts-ignore */
           this.thread.x / this.constants.WIDTH    ,
          /* @ts-ignore */
            this.thread.y / this.constants.HEIGHT   
        ]
 
      this.color(
      1,1,1,        1)



    }).setOutput([width, height]).setConstants({

      WIDTH: width,
      HEIGHT: height
    }).setImmutable(true)
      .setGraphical(true)


    // console.log('Checking initialising render', renderd)
    //        renderd( 1,1,[])
    setRender(() => renderd)
    if (props.once) {
      renderIt(renderd)
    }
  }, [fullscrreen])

  if (render && !props.once) {
    //console.log('render')
    renderIt(render)
  }
  useEffect(() => {
    //   console.log('Checking initialising', canvasContainerRef, render)
    if (canvasContainerRef.current && render) {
      //console.log('Appending child',canvasContainerRef.current,render.canvas)
      canvasContainerRef.current.appendChild(render.canvas)
      //  setSize({height:   canvasContainerRef.current.clientHeight,
      //   width:canvasContainerRef.current.clientWidth})

    }
    return () => {
      if (canvasContainerRef.current && render) {
        canvasContainerRef.current?.removeChild(render.canvas)
      }
    }
  }, [render])
  // render();

  // const canvas = render.canvas;
  // document.getElementsByTagName('body')[0].appendChild(canvas);

  // console.log('props are', record, rest.source)

  return (
    <ContainerDiv ref={canvasContainerRef} data-testid={Math.random()}></ContainerDiv>

  )
}

const ContainerDiv = styled('div')`
 
height:100%;
width:100%;

`