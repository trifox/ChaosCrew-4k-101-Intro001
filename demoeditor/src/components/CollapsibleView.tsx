import { Button, IconButton, Collapse } from "@mui/material";
import React, { ReactNode, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/Add";
import MinusCircleOutlineIcon from "@mui/icons-material/Remove";
export const CollapsibleView: React.FC<{
  children: ReactNode;
  label: string;
}> = ({ children, label }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outlined" fullWidth onClick={() => setOpen(!open)}>
        {!open ? <AddCircleOutlineIcon /> : <MinusCircleOutlineIcon />}
        {label}
      </Button>
      <Collapse in={open}>{children}</Collapse>
    </>
  );
};
