
import { Create, Edit, FormDataConsumer, NumberInput, SimpleForm, TextInput, ReferenceArrayInput, SelectArrayInput } from 'react-admin';
import ComplexNumberEdit from '../../components/inputs/ComplexNumberEdit';
import { Mandelbrot } from '../../components/mandelbrot/Mandelbrot';
import { MandelbrotRecord } from '../../components/mandelbrot/MandelbrotRecord';

import { Stack, styled, StackProps, TextField, Theme, Typography } from '@mui/material';
import { ColorInput } from '../../components/inputs/ColorInput';
export const DemokeyframeCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" ></TextInput>
            <ReferenceArrayInput source="category_ids" reference="categories"><SelectArrayInput optionText="name" />
            </ReferenceArrayInput>
            <TextInput multiline={true} source="description" ></TextInput>
            <ColorInput source="color1" defaultValue={'#ff0000'} ></ColorInput>
            <ColorInput source="color2" defaultValue={'#00ffff'}></ColorInput>
            <ComplexNumberEdit source="seedShift" ></ComplexNumberEdit>
            <ComplexNumberEdit source="location" defaultValue={[0, 0]}></ComplexNumberEdit>
            <NumberInput source="zoomStartEnd[0]" defaultValue={1} ></NumberInput>
            <ComplexNumberEdit source="sinFactStartEnd" ></ComplexNumberEdit>
            <ComplexNumberEdit source="startEndIterationA" ></ComplexNumberEdit>
            <ComplexNumberEdit source="startEndIterationB" ></ComplexNumberEdit>
            <ComplexNumberEdit source="angleStartEnd" ></ComplexNumberEdit>

        </SimpleForm>
    </Create>
); 