import { isArray } from "tone"
import { lerp } from "../mandelbrot/math"
import { ease, easeInCirc, easeInCubic, easeInElastic, easeInExpo, easeInQuad, easeInQuart, easeOutBounce, easeOutCubic, EasingType } from "../util/math.easing"

export type TimelineKeyframe = {

    frame: number,
    easingOut: EasingType,
    easingIn: EasingType,
    value: number | number[]

}

export function getValueForTimelineFrame(frame: number, frames: TimelineKeyframe[] | undefined): number | number[] | undefined {
    // console.group('getValueForTimelineFrame')
    // console.log('getValueForTimelineFrame', frame, frames)
    let result
    if (frames && frames.length > 1) {
        // console.log('...hasFrames')
        let found = -1
        const firstFrame = frames.find((item, index) => {
            result = item.frame >= frame
            if (result) {
                found = index
            }
            // console.log('trying to find ', item, index, frame, result)
            return result
        }) ?? frames[frames.length - 1]
        // console.log('...firstframe is', firstFrame)
        if (!firstFrame) {
            // console.log('...hasno firstframe', found)

            /* @ts-ignore */
            result = frames.at(-1).value
        }
        let prevFrame = undefined
        // console.log('...has firstFrame found', found, firstFrame)
        prevFrame = frames[found - 1]
        // console.log('...has prevframe found it is', prevFrame)
        if (prevFrame) {
            // console.log('...has prevFrame', firstFrame, prevFrame)
            let interpol = Math.abs(frame - prevFrame.frame) / Math.abs(prevFrame.frame - firstFrame.frame)

            // apply lerp to interpolation
            interpol = ease(interpol, {
                easingIn: prevFrame.easingOut,
                easingOut: firstFrame.easingIn
            })



            if (Array.isArray(firstFrame.value) && Array.isArray(prevFrame.value)) {
                // console.log('...but is array', interpol)
                console.groupEnd()
                result = [
                    lerp(prevFrame.value[0], firstFrame.value[0], interpol),
                    lerp(prevFrame.value[1], firstFrame.value[1], interpol)
                ]
            } else {
                // console.log('...but is number', interpol)
                console.groupEnd()
                result = lerp(firstFrame.value as number, prevFrame.value as number, interpol)
            }
        } else {
            // console.log('...has no nextramexxx')
            result = firstFrame.value
        }
    }
    // console.log('Returning ', result)
    // console.groupEnd()
    return result
}