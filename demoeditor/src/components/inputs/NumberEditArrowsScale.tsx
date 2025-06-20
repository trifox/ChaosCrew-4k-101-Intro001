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

const NumberEditArrowsScale: React.FC<{ source: string }> = ({ source }) => {
    const { field: field1 } = useController({ name: source });
    //console.log('Fields are',field1,field2)
    return (
        <CollapsibleView label={source}>
            <NumberInput fullWidth source={source}></NumberInput>
            <IconButton onClick={() => field1.onChange(parseFloat(field1.value) / 2)}   >
                <UpIcon />
            </IconButton>
            <IconButton onClick={() => field1.onChange(parseFloat(field1.value) * 2)}  >
                <DownIcon />
            </IconButton>
        </CollapsibleView>
    );
};
export default NumberEditArrowsScale;
