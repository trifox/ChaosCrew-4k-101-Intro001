import { Box, Paper, Slider } from "@mui/material"
import { useTimelineContext } from "./TimelineContext"
export function padWithZero(num: any, targetLength: number) {
    return String(num).padStart(targetLength, '0')
}

export function getFormattedTimeForFrameAndFps(frame: number, fps: number) {

    const hour = Math.floor(frame / (fps * 60 * 60))
    const minute = Math.floor(frame / (fps * 60))
    const sek = Math.floor(frame / fps)
    const milis = Math.floor(((frame / fps) % 1) * 1000)
    return `${padWithZero(hour, 2)}:${padWithZero(minute, 2)}:${padWithZero(sek, 2)}:${padWithZero(milis, 4)}`
}
export const TimeView: React.FC<{ frame: number, fps: number }> = ({ frame, fps }) => {

    return <Paper  >
        {getFormattedTimeForFrameAndFps(frame, fps)}
    </Paper>
}