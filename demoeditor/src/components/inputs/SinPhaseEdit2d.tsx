// in LatLongInput.js
import { useController } from "react-hook-form";
import { Labeled, NumberInput } from "react-admin";
import { SineWaveRender } from "../SinewaveRender";
import { RenderSinus, SinusKeyFrameType } from "../RenderSinus";
import { SinusCanvasRender } from "../SinusCanvasRender";
import {
  Stack,
  styled,
  StackProps,
  TextField,
  Theme,
  Typography,
  Grid,
} from "@mui/material";
import { SinPhaseEdit } from "./SinPhaseEdit";
import { SinusCanvasRender2d } from "../SinusCanvasRender2d";
import { CollapsibleView } from "../CollapsibleView";

export const SinPhaseEdit2d: React.FC<{ source: string }> = ({ source }) => {
  const { field: field1 } = useController({ name: source });
  return (
    <CollapsibleView label="Sine Edit">
      <Grid container>
        <Grid item xs={12}>
          <SinusCanvasRender2d
            data={field1.value.x as SinusKeyFrameType}
            data2={field1.value.y as SinusKeyFrameType}
            width={"475px"}
            height={400}
            iterationStart={field1.value.iterationStart}
            iterationEnd={field1.value.iterationEnd}
          />
        </Grid>
        <NumberInput
          source={source ? source + ".iterationStart" : "iterationStart"}
          defaultValue={0}
        ></NumberInput>
        <NumberInput
          source={source ? source + ".iterationEnd" : "iterationEnd"}
          defaultValue={400}
        ></NumberInput>
        <SinPhaseEdit source={source ? source + ".x" : "x"}></SinPhaseEdit>
        <SinPhaseEdit source={source ? source + ".y" : "y"}></SinPhaseEdit>
      </Grid>
    </CollapsibleView>
  );
};
