import { Datagrid, List, NumberField, TextField,CloneButton } from 'react-admin';
import { KeyframePreview } from '../../components/mandelbrot/KeyframePreview';

export const DemokeyframeList = () => (
    <List perPage={10} >
        <Datagrid rowClick="edit"> 
            <NumberField source="description" />  
            <TextField source="name" />    
            <CloneButton />
        </Datagrid>
    </List>
);