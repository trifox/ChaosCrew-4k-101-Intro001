// in LatLongInput.js
import { useController, useForm } from 'react-hook-form';
import { Labeled, useEditContext, NumberInput, ArrayInput, SimpleFormIterator, BooleanInput } from 'react-admin'
import { Stack, styled, StackProps, TextField, Theme, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import PlayIcon from '@mui/icons-material/PlayArrow';
import UpIcon from '@mui/icons-material/ArrowCircleUp';
import DownIcon from '@mui/icons-material/ArrowCircleDown';
import LeftIcon from '@mui/icons-material/ArrowCircleLeft';
import RightIcon from '@mui/icons-material/ArrowCircleRight';
import PauseIcon from '@mui/icons-material/Pause';
import { useTimelineContext } from './TimelineContext';
import { useState } from 'react';
import { getValueForTimelineFrame, TimelineKeyframe } from './TimelineCalculator';
import ComplexNumberEditArrows from '../inputs/ComplexNumberEditArrows';
import { JumpFrameButton } from './JumpFrameButton';
import { InputEasing } from './InputEasing';

export const KeyframeComplexNumberEdit: React.FC<{ source: string }> = ({ source }) => {
    //  console.log('Fields are',field1,field2,zoomScale)
    const fieldName = "KEYFRAMES." + source + ".frames"
    const [stateKey, setStateKey] = useState(0)
    const { field: sourceField } = useController({ name: source, defaultValue: [] });
    const { field: field1 } = useController({ name: fieldName, defaultValue: [] });
    const { register, unregister } = useForm()
    const { frame, setFrame } = useTimelineContext()
    // const { field: fieldCurrent } = useController({ name: fieldName + `${frame}`, defaultValue: { frame: 0, value: [0, 0] } });
    let framee: any
    // console.log('field1 is', field1,)
    if (field1.value?.find) {
        framee = field1.value.find((item: any) => item.frame === frame)
    }


    const sortFunc = (a: TimelineKeyframe, b: TimelineKeyframe) => {
        return a.frame - b.frame
    }
    // const useEffect(() => { }, [frame])
    const val: number[] = getValueForTimelineFrame(frame, field1.value) as number[] || sourceField.value
    return (
        <div>


            KEYFRAME EDIT KEYFRAME IS{fieldName}
            VALUE IS<br /> {val[0]}<br />
            {val[1]}<br />


            {framee ? <><div onClick={() => {

                field1.onBlur()
                field1.onChange(field1.value.filter((item: any) => item !== framee).sort(sortFunc))
                setStateKey(stateKey + 1)
            }}>DELETE KEYFRAME</div>
            </> : <div onClick={() => {

                field1.onBlur()
                field1.onChange([...field1.value, { frame: frame, value: val }].sort(sortFunc))
                setStateKey(stateKey + 1)
            }}>create keyframe</div>
            }

            <ArrayInput key={'arr-' + stateKey} source={fieldName} defaultValue={[]}>
                <SimpleFormIterator   >
                    <JumpFrameButton source="frame" />
                    <NumberInput source="frame" disabled></NumberInput>
                    {/* <NumberInput source="value[0]" label="X"></NumberInput>
                    <NumberInput source="value[1]" label="Y"></NumberInput> */}
                    <ComplexNumberEditArrows source="value" ></ComplexNumberEditArrows>
                    <InputEasing source="easingIn"></InputEasing>
                    <InputEasing source="easingOut"></InputEasing>
                    <BooleanInput source="isExponential"></BooleanInput>
                </SimpleFormIterator>
            </ArrayInput>
        </div >
    );
}; 
