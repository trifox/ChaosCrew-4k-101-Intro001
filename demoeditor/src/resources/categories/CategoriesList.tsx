import { Datagrid, List, NumberField, TextField,CloneButton } from 'react-admin';
import { KeyframePreview } from '../../components/mandelbrot/KeyframePreview';

export const CategoriesList = () => (
    <List perPage={25} >
        <Datagrid rowClick="show"> 
            <TextField source="name" />   
            <TextField source="description" />   
            {/* <KeyframePreview   ></KeyframePreview> */}
            <CloneButton />
        </Datagrid>
    </List>
);