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
  TabbedForm,
  FormTab,
  BooleanInput,
  TopToolbar,
  ShowButton,
  ListButton,
} from "react-admin";
import react from "react";
import ComplexNumberEdit from "../../components/inputs/ComplexNumberEdit";
import { Mandelbrot } from "../../components/mandelbrot/Mandelbrot";
import { MandelbrotRecord } from "../../components/mandelbrot/MandelbrotRecord";
import { MandelbrotRootsSelect } from "../../components/inputs/MandelbrotRootsSelect";

import {
  Stack,
  styled,
  Box,
  Grid,
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
import { SinPhaseEdit2d } from "../../components/inputs/SinPhaseEdit2d";
import { ColorInput } from "../../components/inputs/ColorInput";
import { FFTView } from "../../components/fft/FFTView";
import { TimelineView } from "../../components/timeline/TimelineView";
import { CollapsibleView } from "../../components/CollapsibleView";
import { CurrentKeyframesView } from "../../components/timeline/CurrentKeyframesView";

// import { KeyframeComplexNumberEdit } from "../../components/timeline/KeyframeComplexNumberEdit";

const PostEditActions = () => (
  <TopToolbar>
    <ShowButton />
    {/* Add your custom actions */}
    <ListButton />
    <CloneButton />
  </TopToolbar>
);

export const DemokeyframeEdit = () => (
  <Edit actions={<PostEditActions />}>
    <TabbedForm>
      <FormTab label="details">
        <Grid container>
          <Grid item xs={6}>
            <TimelineView></TimelineView>
            <ComplexNumberEditArrows source="location"></ComplexNumberEditArrows>
            <FormDataConsumer>
              {({ formData, ...rest }) => (
                <MandelbrotRecord formData={formData} {...rest} />
              )}
            </FormDataConsumer>

            <NumberEditArrowsScale source="zoomStartEnd[0]"></NumberEditArrowsScale>
            <NumberEditSlider
              source="angleStartEnd[0]"
              min={0}
              max={360}
            ></NumberEditSlider>
            <MandelbrotRootsSelect
              sourceLoc="location"
              sourceZoom="zoomStartEnd[0]"
            ></MandelbrotRootsSelect>
            {/* <BooleanInput
              source="julia"
              title={`When using Julia mode, use a pertubation covering the whole iteration
                        which behaves like the julia seed then`}
            ></BooleanInput> */}

            <CollapsibleView label="Colors">
              <ColorInput source="color1"></ColorInput>
              <ColorInput source="color2"></ColorInput>
              <ColorInput source="color3"></ColorInput>
            </CollapsibleView>
          </Grid>
          <Grid item xs={6}>
            <Box component="div" sx={{ overflow: "auto", height: "80vh" }}>
              {/* <CurrentKeyframesView></CurrentKeyframesView> */}
              {/* <FFTView></FFTView> */}
              {/* <div style={{ padding: "2em", maxHeight: "600px", overflow: "auto" }}> */}

              {/* <KeyframeComplexNumberEdit source="location"></KeyframeComplexNumberEdit> */}

              {/* <ComplexNumberEditArrowsScale source="zoomStartEnd" ></ComplexNumberEditArrowsScale> */}
              {/* <ComplexNumberEditArrowsScale source="sinFactStartEnd"></ComplexNumberEditArrowsScale> */}
              {/* <ComplexNumberEdit source="sinSpeed" ></ComplexNumberEdit>
            <ComplexNumberEdit source="sinInitSpeed" ></ComplexNumberEdit>*/}
              {/* <ComplexNumberEdit source="startEndIteration"></ComplexNumberEdit> */}

              <ArrayInput source="sineWaves2" defaultValue={[]}>
                <SimpleFormIterator>
                  <SinPhaseEdit2d source=""></SinPhaseEdit2d>
                </SimpleFormIterator>
              </ArrayInput>
              <ArrayInput source="pertubations">
                <SimpleFormIterator>
                  <NumberInput
                    defaultValue={10}
                    fullWidth
                    source="iteration"
                  ></NumberInput>
                  <NumberInput
                    defaultValue={1}
                    fullWidth
                    source="iterationRadius"
                  ></NumberInput>

                  <ComplexNumberEditArrows source="pertubation"></ComplexNumberEditArrows>
                </SimpleFormIterator>
              </ArrayInput>
              {/* </div> */}
            </Box>
          </Grid>
        </Grid>
      </FormTab>
      <FormTab label="summary">
        <CloneButton></CloneButton>
        <ReferenceArrayInput source="category_ids" reference="categories">
          <SelectArrayInput fullWidth optionText="name" />
        </ReferenceArrayInput>

        <TextInput fullWidth multiline={true} source="name"></TextInput>
        <TextInput fullWidth multiline={true} source="description"></TextInput>
      </FormTab>
    </TabbedForm>
  </Edit>
);
const Container = styled("div")`
  display: flex;
`;
