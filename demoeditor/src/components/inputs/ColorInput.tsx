// in LatLongInput.js
import { useController } from 'react-hook-form';
import { Labeled, NumberInput, useEditContext, TextField, TextInput } from 'react-admin'
import { Stack, styled, StackProps, Theme, Typography, Grid, Input } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import PlayIcon from '@mui/icons-material/PlayArrow';
import UpIcon from '@mui/icons-material/ArrowCircleUp';
import DownIcon from '@mui/icons-material/ArrowCircleDown';
import LeftIcon from '@mui/icons-material/ArrowCircleLeft';
import RightIcon from '@mui/icons-material/ArrowCircleRight';
import PauseIcon from '@mui/icons-material/Pause';

import { ColorField, ColorInput as OrigColorInput } from 'react-admin-color-picker';
import Slider from '@mui/material/Slider';
import { useState } from 'react';
export const ColorInput: React.FC<{ source: string, defaultValue?: string }> = ({ source, defaultValue }) => {
    const { field: field1 } = useController({ name: source, defaultValue: defaultValue || '#123456' });


    return (
        <Grid container sx={{ bgcolor: field1.value }}>


            <Grid item xs={12}>
                <OrigColorInput source={source} />
            </Grid>
        </Grid>
    );
}; 
