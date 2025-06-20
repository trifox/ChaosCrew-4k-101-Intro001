import {
  Edit,
  FormDataConsumer,
  NumberInput,
  ArrayInput,
  SimpleForm,
  TextInput,
  CloneButton,
  ReferenceArrayInput,
  SelectArrayInput,
  SimpleFormIterator,
} from "react-admin";
import ComplexNumberEdit from "../../components/inputs/ComplexNumberEdit";
import { Mandelbrot } from "../../components/mandelbrot/Mandelbrot";
import { MandelbrotRecord } from "../../components/mandelbrot/MandelbrotRecord";
import { MandelbrotRootsSelect } from "../../components/inputs/MandelbrotRootsSelect";

import {
  Stack,
  styled,
  StackProps,
  TextField,
  Theme,
  Typography,
} from "@mui/material";
import ComplexNumberEditArrows from "../../components/inputs/ComplexNumberEditArrows";
import ComplexNumberEditArrowsScale from "../../components/inputs/ComplexNumberEditArrowsScale";
import NumberEditArrowsScale from "../../components/inputs/NumberEditArrowsScale";
import { NumberEditSlider } from "../../components/inputs/NumberEditSlider";
import { FractalToolbar } from "../../components/Toolbar";
import { SinPhaseEdit } from "../../components/inputs/SinPhaseEdit";
import { XYSinPhaseEdit } from "../../components/inputs/XYSinPhaseEdit";
import { SinPhaseEdit2d } from "../../components/inputs/SinPhaseEdit2d";
import {
  SinusCanvasRender2dFull,
  SinusRenderFull,
} from "../../components/SinusCanvasRender2dFull";
export const DemokeyframeEdit = () => (
  <Edit>
    <SimpleForm>
      <Container>
        <TextInput source="name"></TextInput>

        <TextInput multiline={true} source="description"></TextInput>
      </Container>

      <Container>
        <SinusRenderFull source="sineWaves" />
      </Container>

      <Container>
        <ArrayInput source="sineWaves">
          <SimpleFormIterator>
            <SinPhaseEdit2d source=""></SinPhaseEdit2d>
          </SimpleFormIterator>
        </ArrayInput>
        {/* <FormDataConsumer>
                    {({ formData, ...rest }) => ( 
                        <MandelbrotRecord formData={formData} />
                    )}
                </FormDataConsumer> */}
      </Container>
    </SimpleForm>
  </Edit>
);
const Container = styled("div")`
  display: flex;
`;
