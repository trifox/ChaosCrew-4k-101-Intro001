import FragmentCanvas from "fragment-canvas";
import { useRecordContext } from "react-admin";
import { get, useController } from "react-hook-form";
import { Fragment } from "../canvas/Fragment";

export const FragmentView: React.FC<{
  source: string;
}> = (props) => {
  console.log("Source ist", props);

  const { source, ...rest } = props;
  const record = useRecordContext(props);
  const value = get(record, source);

  return (
    <div>
      Input wrapper for fragment source view
      <Fragment source={value} />
    </div>
  );
};
