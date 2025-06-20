import { useTimelineContext } from "./TimelineContext"

export const TimelineKeyframeSlider = () => {
    const { frame, maxFrames } = useTimelineContext()
    return (<>
        this is a single keyframe timeline{frame}</>)

}