// in LatLongInput.js
import { useController } from 'react-hook-form';
import { Labeled, useEditContext, NumberInput, ArrayInput, SimpleFormIterator } from 'react-admin'
import { Stack, styled, StackProps, TextField, Theme, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import PlayIcon from '@mui/icons-material/PlayArrow';
import UpIcon from '@mui/icons-material/ArrowCircleUp';
import DownIcon from '@mui/icons-material/ArrowCircleDown';
import LeftIcon from '@mui/icons-material/ArrowCircleLeft';
import RightIcon from '@mui/icons-material/ArrowCircleRight';
import PauseIcon from '@mui/icons-material/Pause';
import { useTimelineContext } from './TimelineContext';

export const KeyframeNumberEdit: React.FC<{ source: string }> = ({ source }) => {
    //  console.log('Fields are',field1,field2,zoomScale)
    const fieldName = "KEYFRAMES." + source + ".frames"
    const { field: field1 } = useController({ name: fieldName });
    const { frame } = useTimelineContext()
    const framee = field1.value.find((item: any) => item.frame === frame)
    return (
        <div>KEYFRAME EDIT
            {field1 ? "FIELD FOUND" : "NO FIELD EXISTING"}

            {framee ? <> <NumberInput source={source}></NumberInput>DELETE KLEYFRAME</> : <div>create keyframe</div>}

            < ArrayInput source={fieldName}>
                <SimpleFormIterator   >
                    <NumberInput source="frame"></NumberInput>
                    <NumberInput source="value"></NumberInput>
                </SimpleFormIterator>
            </ArrayInput>
        </div >
    );
}; 
