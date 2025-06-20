import { Datagrid, List, NumberField, TextField, useEditContext, useInput, useRecordContext, FormDataConsumerRenderParams, TabbedFormView } from 'react-admin';
import React, { useEffect, useState, useRef, DOMElement } from 'react'
import { GPU, IKernelRunShortcut, KernelFunction } from 'gpu.js';
import { styled } from '@mui/system';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import PlayIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import LoopIcon from '@mui/icons-material/LoopTwoTone';
import { Mandelbrot } from './Mandelbrot';
import { FOCUSABLE_SELECTOR } from '@testing-library/user-event/dist/utils';
import { useAnimationFrame } from '../util/useAnimationFrame';
import FFTFun from '../fft/FFTFun';
export const MandelbrotRecord: React.FC<FormDataConsumerRenderParams> = (props: FormDataConsumerRenderParams) => {

    // console.log('record is',props.formData)   
    const [time, setTime] = useState(0)
    const [speed, setSpeed] = useState(20000)
    const [maxIter, setMaxIter] = useState(1024)
    const [playing, setPlaying] = useState(false)
    const looping = useRef(false)
    const stateRef = useRef(0);
    const stateRefPlaying = useRef(playing);
    const fullscreenContainerRef = useRef<HTMLDivElement>();

    // make stateRef always have the current count
    // your "fixed" callbacks can refer to this object whenever
    // they need the current value.  Note: the callbacks will not
    // be reactive - they will not re-run the instant state changes,
    // but they *will* see the current value whenever they do run
    stateRef.current = time;
    stateRefPlaying.current = playing

    useAnimationFrame((deltaTime) => {
        //   console.log('p0laying',playing,stateRef.current)
        if (stateRefPlaying.current) {
            setTime(time => stateRef.current + deltaTime)
        }

    })

    return (
        <div >

            <IconButton onClick={(evt) => fullscreenContainerRef.current?.requestFullscreen()}  >
                <FullscreenIcon></FullscreenIcon>
            </IconButton>

            <Slider
                onChange={(evt: any) => setMaxIter(evt.target.value)}
                max={1000} min={1} value={maxIter}
            ></Slider>{maxIter}



            {/* @ts-ignore  */}
            <div ref={fullscreenContainerRef} >
                <Mandelbrot maxIterations={maxIter} data={props.formData} globalTime={time / speed} once={false} width={800} height={450} />
            </div>

        </div>)
}
