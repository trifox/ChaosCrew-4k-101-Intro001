import {
  Datagrid,
  List,
  NumberField,
  ShowButton,
  TextField,
  CloneButton,
} from "react-admin";
import { KeyframePreview } from "../../components/mandelbrot/KeyframePreview";

export const V101ist = () => (
  <List perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <TextField source="description" />
      <ShowButton />
      <CloneButton />
    </Datagrid>
  </List>
);
