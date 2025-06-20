// in LatLongInput.js
import { useController } from 'react-hook-form';
import { Labeled, useEditContext, NumberInput } from 'react-admin'
import { Stack, styled, StackProps, TextField, Theme, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import PlayIcon from '@mui/icons-material/PlayArrow';
import UpIcon from '@mui/icons-material/ArrowCircleUp';
import DownIcon from '@mui/icons-material/ArrowCircleDown';
import LeftIcon from '@mui/icons-material/ArrowCircleLeft';
import RightIcon from '@mui/icons-material/ArrowCircleRight';
import PauseIcon from '@mui/icons-material/Pause';
import { CollapsibleView } from '../CollapsibleView';

const NumberEditArrows: React.FC<{ source: string }> = ({ source }) => {
    const { field: field1 } = useController({ name: source });
    const { field: zoomScale } = useController({ name: 'zoomStartEnd[0]' });
    //  console.log('Fields are',field1,field2,zoomScale)
    return (
        <CollapsibleView label={'Number Edit Arrows' + source}>
            <NumberInput source={source}></NumberInput>
            <IconButton onClick={() => field1.onChange(parseFloat(field1.value) - 1 * (0.25 * zoomScale.value))}  >
                <LeftIcon />
            </IconButton>
            <IconButton onClick={() => field1.onChange(parseFloat(field1.value) + 1 * (0.25 * zoomScale.value))}   >
                <RightIcon />
            </IconButton>
        </CollapsibleView>
    );
};
export default NumberEditArrows;
