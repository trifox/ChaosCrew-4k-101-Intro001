import { Datagrid, List, NumberField, TextField,CloneButton } from 'react-admin';
import { ExplicitKeyframePreview } from '../../components/mandelbrot/ExplicitKeyframePreview';
import { KeyframePreview } from '../../components/mandelbrot/KeyframePreview';

export const DemokeyframeList = () => (
    <List perPage={10} >
        <Datagrid rowClick="edit"> 
            <NumberField source="name" />  
            <NumberField source="description" />   
            <ExplicitKeyframePreview/>
            <CloneButton />
        </Datagrid>
    </List>
);