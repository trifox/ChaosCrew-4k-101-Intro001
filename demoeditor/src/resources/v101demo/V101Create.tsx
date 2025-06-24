import {
  Create,
  Edit,
  FormDataConsumer,
  NumberInput,
  SimpleForm,
  TextInput,
} from "react-admin";
import ComplexNumberEdit from "../../components/inputs/ComplexNumberEdit";
import { Mandelbrot } from "../../components/mandelbrot/Mandelbrot";
import { MandelbrotRecord } from "../../components/mandelbrot/MandelbrotRecord";

import {
  Stack,
  styled,
  StackProps,
  TextField,
  Theme,
  Typography,
} from "@mui/material";
export const V101Create = () => (
  <Create>
    <SimpleForm>
      <TextInput multiline={false} source="name"></TextInput>
      <TextInput multiline={true} source="description" rows={10}></TextInput>
      <TextInput
        multiline={true}
        source="fragmentshader"
        rows={10}
        fullWidth
      ></TextInput>
      <TextInput
        fullWidth
        multiline={true}
        source="sointusoundyaml"
        rows={10}
      ></TextInput>
    </SimpleForm>
  </Create>
);
