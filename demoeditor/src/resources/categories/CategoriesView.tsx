
import { Edit, SimpleShowLayout, NumberInput, SimpleForm,TextField,ReferenceArrayField, TextInput,Show,CloneButton,ShowButton,ReferenceManyField ,Datagrid} from 'react-admin'; 
import ComplexNumberEdit from '../../components/inputs/ComplexNumberEdit';
import { Mandelbrot } from '../../components/mandelbrot/Mandelbrot';
import { MandelbrotRecord } from '../../components/mandelbrot/MandelbrotRecord';
import { MandelbrotRootsSelect } from '../../components/inputs/MandelbrotRootsSelect';

import { Stack, styled,StackProps, Theme, Typography } from '@mui/material'; 
import ComplexNumberEditArrows from '../../components/inputs/ComplexNumberEditArrows';
import ComplexNumberEditArrowsScale from '../../components/inputs/ComplexNumberEditArrowsScale';
export const CategoriesShow  = () => (
    <Show  >
       <SimpleShowLayout>
            <TextField   source="name" ></TextField> 
            <TextField source="description" ></TextField> 

              
            <CloneButton /> </SimpleShowLayout>
    </Show>
);
const Container=styled('div')`
display:flex;
`