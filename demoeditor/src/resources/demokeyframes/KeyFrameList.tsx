import { Datagrid, List, NumberField, TextField,CloneButton } from 'react-admin';
import { KeyframePreview } from '../../components/mandelbrot/KeyframePreview';
import { SearchFilter } from '../SearchFilter';
import react from 'react'
export const DemokeyframeList = () => (
    <List perPage={10} filters={[<SearchFilter></SearchFilter>]} >
        <Datagrid rowClick="edit"> 
            <NumberField source="name" />  
            <NumberField source="description" />  
            <TextField source="location" />   
            <KeyframePreview   ></KeyframePreview>
            <CloneButton />
        </Datagrid>
    </List>
);