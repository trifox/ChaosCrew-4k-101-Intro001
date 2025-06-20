// in LatLongInput.js
import { useController, useForm } from "react-hook-form";
import { Labeled, useEditContext, NumberInput } from "react-admin";
import {
  Stack,
  styled,
  StackProps,
  TextField,
  Theme,
  Typography,
  Grid,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import PlayIcon from "@mui/icons-material/PlayArrow";
import UpIcon from "@mui/icons-material/ArrowCircleUp";
import DownIcon from "@mui/icons-material/ArrowCircleDown";
import LeftIcon from "@mui/icons-material/ArrowCircleLeft";
import RightIcon from "@mui/icons-material/ArrowCircleRight";
import PauseIcon from "@mui/icons-material/Pause";
import ComplexNumberEdit from "./ComplexNumberEdit";
import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { CollapsibleView } from "../CollapsibleView";

const ComplexNumberEditArrows: React.FC<{ source: string }> = ({ source }) => {
  const useScale = true;
  const { trigger } = useForm();
  const [count, setCount] = useState(0);
  const { field: field } = useController({ name: source });
  const { field: field1 } = useController({ name: source + ".0" });
  const { field: field2 } = useController({ name: source + ".1" });
  const field1Value = field1.value;
  const field2Value = field2.value;
  const { field: zoomScale } = useController({ name: "zoomStartEnd.0" });
  // console.log('Fields are', field1, field2, zoomScale)

  const mouseDown = useRef(false);
  const mouseDownLocation = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const mouseMoveHandler = useCallback(
    (e: MouseEvent) => {
      // console.log('mousemove', field1, field2, { left: e.pageX, top: e.pageY }, elementRef.current?.getBoundingClientRect());
      const relx = mouseDownLocation.current.x - e.pageX;
      const rely = e.pageY - mouseDownLocation.current.y;
      const val = [
        mouseDownLocation.current.ox + (relx / 100) * zoomScale.value || 0,
        mouseDownLocation.current.oy + (rely / 100) * zoomScale.value || 0,
      ];
      //   console.log(
      //     "mousemove relative set value",
      //     field,
      //     mouseDownLocation.current,
      //     relx,
      //     rely,
      //     val
      //   );

      // field1.onBlur()
      // field1.onChange(val[0])
      // field2.onBlur()
      // field1.onChange(val[0])
      // field2.onChange(val[1])
      //   field.onChange(val );
      field1.onChange(val[0]);
      field2.onChange(val[1]);

      // trigger()
      //   setState( {left: e.pageX, top: e.pageY });
      e.preventDefault();
      e.stopPropagation();
    },
    [field1, field2, zoomScale.value, mouseDownLocation.current]
  );

  const mouseDownHandler = useCallback(
    (e: MouseEvent) => {
      // console.log('mousedown')
      const rect = elementRef.current?.getBoundingClientRect();
      if (rect) {
        mouseDownLocation.current.x = e.pageX;
        mouseDownLocation.current.y = e.pageY;
        mouseDownLocation.current.ox = field1.value;
        mouseDownLocation.current.oy = field2.value;
        mouseDown.current = true;

        const mouseUpHandler = (e: MouseEvent) => {
          //   console.log("mouseup");
          document.removeEventListener("mousemove", mouseMoveHandler);
          document.removeEventListener("mouseup", mouseUpHandler);
          e.preventDefault();
          mouseDown.current = false;
          e.stopPropagation();
          setCount(count + 1);
        };
        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mouseup", mouseUpHandler);
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [mouseMoveHandler, count, field1, field2, field1Value, field2Value]
  );

  return (
    <CollapsibleView label={source}>
      <Grid container>
        <Grid item xs={8}>
          <ComplexNumberEdit source={source}></ComplexNumberEdit>
        </Grid>

        <Grid item xs={4}>
          <ClickDiv
            ref={elementRef}
            /* @ts-ignore */
            onMouseDown={mouseDownHandler as MouseEventHandler}
          >
            {" "}
          </ClickDiv>

          <IconButton
            onClick={() =>
              field1.onChange(
                parseFloat(field1.value) - 1 * (0.25 * zoomScale.value)
              )
            }
          >
            <LeftIcon />
          </IconButton>
          <IconButton
            onClick={() =>
              field1.onChange(
                parseFloat(field1.value) + 1 * (0.25 * zoomScale.value)
              )
            }
          >
            <RightIcon />
          </IconButton>

          <IconButton
            onClick={() =>
              field2.onChange(
                parseFloat(field2.value) + 1 * (0.25 * zoomScale.value)
              )
            }
          >
            <UpIcon />
          </IconButton>
          <IconButton
            onClick={() =>
              field2.onChange(
                parseFloat(field2.value) - 1 * (0.25 * zoomScale.value)
              )
            }
          >
            <DownIcon />
          </IconButton>
        </Grid>
      </Grid>
    </CollapsibleView>
  );
};
export default ComplexNumberEditArrows;
const ClickDiv = styled("div")`
  background-color: red;
  width: 100px;
  height: 100px;
`;

const Container = styled("div")`
  display: flex;
`;
