// in LatLongInput.js
import { useController } from 'react-hook-form';
import { Labeled, NumberInput, useEditContext } from 'react-admin'
import { Stack, styled, StackProps, TextField, Theme, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import PlayIcon from '@mui/icons-material/PlayArrow';
import UpIcon from '@mui/icons-material/ArrowCircleUp';
import DownIcon from '@mui/icons-material/ArrowCircleDown';
import LeftIcon from '@mui/icons-material/ArrowCircleLeft';
import RightIcon from '@mui/icons-material/ArrowCircleRight';
import PauseIcon from '@mui/icons-material/Pause';

import Slider from '@mui/material/Slider';
import { useState } from 'react';
import { CollapsibleView } from '../CollapsibleView';
export const NumberEditSlider: React.FC<{ source: string, min: number, max: number }> = ({ source, min, max }) => {
    const { field: field1 } = useController({ name: source });

    //  console.log('Fields are',field1,field2,zoomScale)
    const [value, setValue] = useState<number>(field1.value);

    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number);
        field1.onChange(newValue)
    };
    return (
        <CollapsibleView label={"Slider" + source}>
            <NumberInput fullWidth source={source}></NumberInput>
            <Slider aria-label="Value" value={value} onChange={handleChange} min={min} max={max} />


        </CollapsibleView>
    );
}; 
