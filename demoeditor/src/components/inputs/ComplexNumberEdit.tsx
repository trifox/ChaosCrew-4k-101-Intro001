// in LatLongInput.js
import { useController } from 'react-hook-form';
import { Labeled } from 'react-admin'
import { Stack, styled, StackProps, TextField, Theme, Typography, Grid } from '@mui/material';
import { NumberInput } from 'react-admin';
import { KeyframeNumberEdit } from '../timeline/KeyframeNumberEdit';
import { KeyframeComplexNumberEdit } from '../timeline/KeyframeComplexNumberEdit';
import { CollapsibleView } from '../CollapsibleView';

const ComplexNumberEdit: React.FC<{ source: string, defaultValue?: number[] }> = ({ source, defaultValue }) => {
    const defs = defaultValue || [0, 0]
    return (

        <Grid container>
            <Grid item xs={12}>
                <NumberInput fullWidth source={source + '.0'} label={source + 'x'} defaultValue={defs[0]} ></NumberInput>

            </Grid>
            <Grid item xs={12}>
                <NumberInput fullWidth source={source + '.1'} label={source + 'y'} defaultValue={defs[1]} ></NumberInput>

            </Grid>
            {/* <KeyframeComplexNumberEdit source={source}  ></KeyframeComplexNumberEdit> */}

        </Grid>
    );
};
export default ComplexNumberEdit