import { Datagrid, List, NumberField, NumberInput, TextField, useEditContext, useInput, useRecordContext, FormDataConsumerRenderParams, TabbedFormView } from 'react-admin';
import React, { useEffect, useState, useRef, DOMElement } from 'react'
import { GPU, IKernelRunShortcut, KernelFunction } from 'gpu.js';
import { styled } from '@mui/system';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import PlayIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import LoopIcon from '@mui/icons-material/LoopTwoTone';
export const MandelbrotRecord: React.FC<FormDataConsumerRenderParams> = (props: FormDataConsumerRenderParams) => {

    // console.log('record is',props.formData)   
    const [time, setTime] = useState(0)
    const [speed, setSpeed] = useState(20000)
    const [maxIter, setMaxIter] = useState(1024)
    const refCOntainer = useRef(0)
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

    const ctime = looping.current ? time / (10000) % 1 : time;

    return (
        <div >
            <NumberInput source="source"></NumberInput>
        </div>)
}
