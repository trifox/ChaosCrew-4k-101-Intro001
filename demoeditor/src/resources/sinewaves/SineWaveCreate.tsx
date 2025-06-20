
import {
    Create, ArrayInput, SimpleFormIterator,
    Edit, FormDataConsumer, NumberInput, SimpleForm, TextInput, ReferenceArrayInput, SelectArrayInput
} from 'react-admin';
import ComplexNumberEdit from '../../components/inputs/ComplexNumberEdit';
import { Mandelbrot } from '../../components/mandelbrot/Mandelbrot';
import { MandelbrotRecord } from '../../components/mandelbrot/MandelbrotRecord';

import { Stack, styled, StackProps, TextField, Theme, Typography } from '@mui/material';
import { XYSinPhaseEdit } from '../../components/inputs/XYSinPhaseEdit';
export const DemokeyframeCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" ></TextInput>

            <TextInput multiline={true} source="description" ></TextInput>
            <ArrayInput source="sineWaves">
                <SimpleFormIterator   >
                    <XYSinPhaseEdit source="wave"></XYSinPhaseEdit>
                </SimpleFormIterator>
            </ArrayInput>
        </SimpleForm>
    </Create>
); 