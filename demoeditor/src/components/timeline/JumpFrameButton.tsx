import IconButton from '@mui/material/IconButton';
import PlayIcon from '@mui/icons-material/PlayArrow';
import UpIcon from '@mui/icons-material/ArrowCircleUp';
import DownIcon from '@mui/icons-material/ArrowCircleDown';
import LeftIcon from '@mui/icons-material/ArrowCircleLeft';
import RightIcon from '@mui/icons-material/ArrowCircleRight';
import PauseIcon from '@mui/icons-material/Pause';
import { useTimelineContext } from './TimelineContext';
import { useController } from 'react-hook-form';

export const JumpFrameButton: React.FC<{ source: string }> = ({ source }) => {

    const { field: sourceField } = useController({ name: source });
    const { frame, setFrame } = useTimelineContext()
    // console.log('Jumpframebutton field', source, sourceField)
    return <IconButton title="Jump to Frame of this keyframe on main timeline" color={frame === sourceField.value ? 'success' : 'warning'} onClick={() => {
        setFrame(sourceField.value)
    }

    }><RightIcon /></IconButton>

}