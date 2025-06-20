import { ArrayInput } from "react-admin";
import { UserMedia, FFT, Synth } from "tone";
import { lerp } from "../mandelbrot/math";

var running = false
export const FFT_SIZE = 64
const mic = new UserMedia();
const micFFT = new FFT(FFT_SIZE);
mic.connect(micFFT);
var defaultFFT = Array(FFT_SIZE).fill(0)
//create a synth and connect it to the main output (your speakers) 

//play a middle 'C' for the duration of an 8th note

export default {
    getFFTSize: () => FFT_SIZE,
    getFFT: () => {
        if (!running) return defaultFFT

        return micFFT.getValue()

    },
    getFFTSmoothed: () => {
        if (!running) return defaultFFT

        const temp = micFFT.getValue()
        for (let i = 0; i < FFT_SIZE; i++) {
            if (defaultFFT[i] < temp[i]) {
                defaultFFT[i] = lerp(defaultFFT[i], temp[i], .25)
            } else {

                defaultFFT[i] = lerp(defaultFFT[i], temp[i], 0.15)
            }
        }
        return defaultFFT

    },
    start: () => {
        defaultFFT = Array(FFT_SIZE).fill(0)
        //create a synth and connect it to the main output (your speakers)
        const synth = new Synth().toDestination();

        //play a middle 'C' for the duration of an 8th note
        synth.triggerAttackRelease("C4", "8n");
        mic.open().then(() => {
            // synth.triggerAttackRelease("C4", "8n");
            // promise resolves when input is available
            console.log("mic open");
            running = true
            // print the incoming mic levels in decibels
            // setInterval(() => console.log(meter.getValue()), 100);
        }).catch(e => {
            // promise is rejected when the user doesn't have or allow mic access
            console.log("mic not open");
        });
    }

}