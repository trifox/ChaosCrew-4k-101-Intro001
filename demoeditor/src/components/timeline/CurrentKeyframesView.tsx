import { Slider } from "@mui/material"
import { useEffect, useMemo } from "react"
import { useRecordContext } from "react-admin"
import { useFormContext } from "react-hook-form"
import { TimelineKeyframe } from "./TimelineCalculator"
import { useTimelineContext } from "./TimelineContext"

export const KeyFramesListView: React.FC<{ data: any }> = ({ data }) => {
    return <></>
}

export const KeyFramesLeafView: React.FC<{ path?: string, label?: string, frames: TimelineKeyframe[] }> = ({ label, path, frames }) => {
    const { frame, maxFrames, setFrame } = useTimelineContext()
    // console.log('LEAF VIEW', path, label, frames)
    const marks = useMemo(() => {
        const result: { value: number }[] = []

        frames.forEach((item, index) => {
            result.push({ value: item.frame })
        }, [frames, maxFrames])


        return result

    }, [frames, maxFrames, frames])
    return <div>LEAF IS{path} {label}
        <Slider value={frame} max={maxFrames} marks={marks} step={null} onChange={(evt, value) => setFrame(value as number)}></Slider>
    </div>
}

function isKeyFrameLeaf(item: any) {
    const { frames } = item
    return frames !== undefined
}
const ViewKeyframes = (props: any) => {

    const { data, path } = props
    console.log('Render keyframes', data)
    const memoList = useMemo(() => {
        return Object.keys(data || {}).map((item, index) => {
            if (item !== 'KEYFRAMES') {
                if (isKeyFrameLeaf(data[item])) {
                    return (<KeyFramesLeafView key={path === '' ? item : path + + '.' + item} path={path === '' ? item : path + '.' + item} label={item} frames={data[item].frames}></KeyFramesLeafView>)

                } else {

                    // return (<div>item is{item} isLeaf?{isKeyFrameLeaf(KEYFRAMES[item]) ? 'true' : 'false'}x</div>)
                    return (<ViewKeyframes key={path + '.' + item} path={path === '' ? item : path + '.' + item} data={data[item]}></ViewKeyframes>)
                    //    return <>"RECIRE"{item}</>
                }
            }
            return null;
        })
    }, [data])
    return <>{memoList}</>

}
export const CurrentKeyframesView = () => {
    const form = useFormContext()
    const data = form.getValues()
    console.log('Data is record', data)
    return (
        <div style={{ width: '100%' }}>

            jo timeline is ${data.id}
            <ViewKeyframes data={data.KEYFRAMES} path={''}>    </ViewKeyframes>
        </div>
    )
}