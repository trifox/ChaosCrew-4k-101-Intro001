
import { ArrayInput, Edit, ReferenceInput, SelectInput, SimpleForm, SimpleFormIterator, TextInput } from 'react-admin';

export const DemosEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" />
            <TextInput source="waveFormUrl" helperText="A valid url of an audio file to play for testing"  />
            <ArrayInput source="keyframes"><SimpleFormIterator>
                <TextInput source="frame" helperText="The frame number this keyframe shall start playing    " />
                <ReferenceInput source="keyframeId" reference="demokeyframes" helperText="The Keyframe definition to use">
                    <SelectInput optionText="description" /></ReferenceInput>
            </SimpleFormIterator></ArrayInput>
        </SimpleForm>
    </Edit>
);