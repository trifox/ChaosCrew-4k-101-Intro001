import { useState } from "react"
import { Tone } from "tone/build/esm/core/Tone"
import FFTFun from "./FFTFun"

export const FFTView = () => {
    const [x, setX] = useState(0)
    console.log(FFTFun.getFFT())
    return <><div onClick={() => { FFTFun.start(); setX(x + 1) }}>'START FFT'</div></>
} 