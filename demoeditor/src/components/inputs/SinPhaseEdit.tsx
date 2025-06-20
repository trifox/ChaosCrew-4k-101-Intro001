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

export const SinPhaseEdit: React.FC<{ source: string }> = ({ source }) => {
  const { field: field1 } = useController({ name: source });
  return (
    <Grid container>
      <Grid item xs={12}>
        <SinusCanvasRender
          data={field1.value as SinusKeyFrameType}
          width={"475px"}
          height={40}
        ></SinusCanvasRender>
      </Grid>
      <Grid item xs={6}>
        <NumberInput defaultValue={0} source={source + ".phase"}></NumberInput>
      </Grid>
      <Grid item xs={6}>
        <NumberInput
          defaultValue={0.1}
          source={source + ".amplitude"}
        ></NumberInput>
      </Grid>
      <Grid item xs={6}>
        <NumberInput
          defaultValue={1}
          source={source + ".frequency"}
        ></NumberInput>
      </Grid>
      <Grid item xs={6}>
        <NumberInput defaultValue={1} source={source + ".speed"}></NumberInput>
      </Grid>
    </Grid>
  );
};
