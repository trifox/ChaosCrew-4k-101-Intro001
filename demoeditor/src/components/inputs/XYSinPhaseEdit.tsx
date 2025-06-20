// in LatLongInput.js
import { useController } from 'react-hook-form';
import { Labeled,NumberInput } from 'react-admin'
import { Stack, styled, StackProps, TextField, Theme, Typography } from '@mui/material';
import { SinPhaseEdit } from './SinPhaseEdit';
 
export const XYSinPhaseEdit: React.FC<{ source: string }> = ({ source }) => { 
console.log('Source is ',source)
    return (
        <Container> 
            <SinPhaseEdit source={source+'.x'}></SinPhaseEdit>
            <SinPhaseEdit source={source+'.y'}></SinPhaseEdit>
        </Container>
    );
}; 
const Container = styled('div')`
display:flex;
justify-content: space-between; 
 `
const Spacer = styled('span')`
width:1em;
 `