
import { Create, Edit, FormDataConsumer, NumberInput, SimpleForm, TextInput,ReferenceArrayInput,SelectArrayInput } from 'react-admin'; 
import ComplexNumberEdit from '../../components/inputs/ComplexNumberEdit';
import { Mandelbrot } from '../../components/mandelbrot/Mandelbrot';
import { MandelbrotRecord } from '../../components/mandelbrot/MandelbrotRecord';

import { Stack, styled,StackProps,TextField, Theme, Typography } from '@mui/material'; 
export const DemokeyframeCreate = () => (
    <Create>
        <SimpleForm> 
            <TextInput   source="name" ></TextInput>
            <ReferenceArrayInput   source="category_ids" reference="categories"><SelectArrayInput optionText="name" />
</ReferenceArrayInput>
            <TextInput multiline={true}   source="description" ></TextInput> 
            <ComplexNumberEdit source="seedShift" ></ComplexNumberEdit>
            <ComplexNumberEdit source="location" ></ComplexNumberEdit>
            <ComplexNumberEdit source="zoomStartEnd" ></ComplexNumberEdit>
            <ComplexNumberEdit source="sinFactStartEnd" ></ComplexNumberEdit>
            <ComplexNumberEdit source="startEndIterationA" ></ComplexNumberEdit>
            <ComplexNumberEdit source="startEndIterationB" ></ComplexNumberEdit>
            <ComplexNumberEdit source="angleStartEnd" ></ComplexNumberEdit> 
            
        </SimpleForm>
    </Create>
); 