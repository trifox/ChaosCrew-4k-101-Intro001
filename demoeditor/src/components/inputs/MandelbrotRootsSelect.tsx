// in LatLongInput.js
import { useController } from "react-hook-form";
import { Labeled } from "react-admin";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  Stack,
  styled,
  StackProps,
  TextField,
  Theme,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { CollapsibleView } from "../CollapsibleView";

export const MandelbrotRootsSelect: React.FC<{ source: string }> = ({
  source,
}) => {
  const [value, setValue] = useState(0);
  const input1 = useController({ name: source + "[0]" });
  const input2 = useController({ name: source + "[1]" });
  const roots = [
    [0, 0],
    [-1.98542425305421, 0, "Needle Far Left"],
    [-1.86078252220485, 0, "Needle Not So Far Left"],
    [-1.6254137251233, 0, "Needle Near"],
    [-1.25636793006818, -0.380320963472722, "Biggest Minibrot Lower Left"],
    [-1.25636793006818, 0.380320963472722, "Biggest Minibrot Upper Left"],
    [-0.504340175446244, -0.562765761452982, "Bulb MainLeftLower"],
    [-0.504340175446244, 0.562765761452982, "Bulb MainLeftUpper"],
    [-0.0442123577040706, -0.986580976280893, "Minibrot Lower Right"],
    [-0.0442123577040706, 0.986580976280893, "Minibrot Upper Right"],
    [-0.198042099364254, -1.1002695372927, "#Deeper Minibrot Lower Left"],
    [-0.198042099364254, 1.1002695372927, "#Deeper Minibrot Upper Left"],
    [0.379513588015924, -0.334932305597498, "Bulb MainRightLower"],
    [0.379513588015924, +0.334932305597498, "Bulb MainRightUpper"],
    [0.359259224758007, -0.642513737138542, "Minibrot MainRightLower Back"],
    [0.359259224758007, 0.642513737138542, "Minibrot MainRightUpper Back"],
  ];

  return (
    // <CollapsibleView label={'Mandelbrot roots ' + source}>
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Mandelbrot Roots</InputLabel>
      <Select
        value={value}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        label="Mandelbrot Root Location"
      >
        {roots.map((item: any, index: any) => (
          <MenuItem
            key={index}
            value={index}
            onClick={() => {
              input1.field.onChange(roots[index][0]);
              input2.field.onChange(roots[index][1]);
              setValue(index);
            }}
          >
            {index}: {item[2] ?? ""} ({item[0]}+i{item[1]})
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    // </CollapsibleView>
  );
};
const Container = styled("div")`
  display: flex;
  justify-content: space-between;
`;
const Spacer = styled("span")`
  width: 1em;
`;
