import { Toolbar, SaveButton,ShowButton,DeleteButton,CloneButton,TopToolbar } from 'react-admin';

export const FractalToolbar = () => (
    <TopToolbar> 
        <SaveButton label="Save" />
        <CloneButton label="Clone" />
        <ShowButton label="Show" />
        <DeleteButton label="Delete" />
    </TopToolbar >
);
