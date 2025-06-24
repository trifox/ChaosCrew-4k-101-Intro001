import {
  Edit,
  FormDataConsumer,
  NumberInput,
  SimpleForm,
  TextField,
  TextInput,
  CloneButton,
  ShowButton,
  ReferenceManyField,
  Datagrid,
} from "react-admin";
import ComplexNumberEdit from "../../components/inputs/ComplexNumberEdit";
import { Mandelbrot } from "../../components/mandelbrot/Mandelbrot";
import { MandelbrotRecord } from "../../components/mandelbrot/MandelbrotRecord";
import { MandelbrotRootsSelect } from "../../components/inputs/MandelbrotRootsSelect";

import { Stack, styled, StackProps, Theme, Typography } from "@mui/material";
import ComplexNumberEditArrows from "../../components/inputs/ComplexNumberEditArrows";
import ComplexNumberEditArrowsScale from "../../components/inputs/ComplexNumberEditArrowsScale";
export const V101Edit = () => (
  <Edit actions={<CloneButton />}>
    <SimpleForm>
      <TextInput multiline={false} source="name"></TextInput>
      <TextInput multiline={true} source="description"></TextInput>
      <TextInput multiline={true} source="fragmentshader" fullWidth></TextInput>
      <TextInput multiline={true} source="sointusoundyaml"></TextInput>
    </SimpleForm>
  </Edit>
);
const Container = styled("div")`
  display: flex;
`;
