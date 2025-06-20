
import {
    Edit, FormDataConsumer, NumberInput, ArrayInput,
    SimpleForm, TextInput, CloneButton, ReferenceArrayInput, SelectArrayInput, SimpleFormIterator, TabbedForm, FormTab
} from 'react-admin';
import ComplexNumberEdit from '../../components/inputs/ComplexNumberEdit';
import { Mandelbrot } from '../../components/mandelbrot/Mandelbrot';
import { MandelbrotRecord } from '../../components/mandelbrot/MandelbrotRecord';
import { MandelbrotRootsSelect } from '../../components/inputs/MandelbrotRootsSelect';

import { Stack, styled, StackProps, TextField, Theme, Typography } from '@mui/material';
import ComplexNumberEditArrows from '../../components/inputs/ComplexNumberEditArrows';
import ComplexNumberEditArrowsScale from '../../components/inputs/ComplexNumberEditArrowsScale';
import NumberEditArrowsScale from '../../components/inputs/NumberEditArrowsScale';
import { NumberEditSlider } from '../../components/inputs/NumberEditSlider';
import { FractalToolbar } from '../../components/Toolbar';
import { SinPhaseEdit } from '../../components/inputs/SinPhaseEdit';
import { SinPhaseEdit2d } from '../../components/inputs/SinPhaseEdit2d';
import { ExplicitMandelbrotRecord } from '../../components/mandelbrot/ExplicitMandelbrotRecord';
export const DemokeyframeEdit = () => (
    <Edit   >
        <TabbedForm>


            <FormTab label="details">
                <Container>
                    <FormDataConsumer>
                        {({ formData, ...rest }) => (
                            <ExplicitMandelbrotRecord formData={formData} />
                        )}
                    </FormDataConsumer>
                    <div style={{ padding: "2em", maxHeight: '600px', overflow: 'auto' }}>

                    <ComplexNumberEditArrows source="location" ></ComplexNumberEditArrows>
                    <NumberEditSlider source='angleStartEnd[0]' min={0} max={360}></NumberEditSlider>
                  
<NumberEditArrowsScale source="zoomStartEnd[0]" ></NumberEditArrowsScale>
                        <ArrayInput source="pertubations">
                            <SimpleFormIterator   >


                                <NumberInput fullWidth source="iteration" ></NumberInput>
                                <NumberInput fullWidth source="iterationRadius" ></NumberInput>
 
                    <ComplexNumberEditArrows source="pertubation" ></ComplexNumberEditArrows>
                            </SimpleFormIterator>
                        </ArrayInput> 
                        
                        
                        
                        </div>

                        
                </Container>

            </FormTab>
            <FormTab label="summary">

                <CloneButton></CloneButton> 
                <TextInput fullWidth multiline={true} source="name" ></TextInput>
                <TextInput fullWidth multiline={true} source="description" ></TextInput>
            </FormTab>
        </TabbedForm>
    </Edit>
);
const Container = styled('div')`
display:flex;
`