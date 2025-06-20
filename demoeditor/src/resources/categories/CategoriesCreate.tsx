
import { Create, Edit, FormDataConsumer, NumberInput, SimpleForm, TextInput } from 'react-admin'; 
import ComplexNumberEdit from '../../components/inputs/ComplexNumberEdit';
import { Mandelbrot } from '../../components/mandelbrot/Mandelbrot';
import { MandelbrotRecord } from '../../components/mandelbrot/MandelbrotRecord';

import { Stack, styled,StackProps,TextField, Theme, Typography } from '@mui/material'; 
export const CategoriesCreate = () => (
    <Create>
        <SimpleForm> 
          
            <TextInput multiline={false} source="name" ></TextInput> 
            <TextInput multiline={true} source="description" ></TextInput> 
        </SimpleForm>
    </Create>
); 