import { GPU  } from 'gpu.js';
import { sin3,lerp,rotateVector,cos3,explerp } from './math';
export function createGPU() {
    const gpu = new GPU();
    gpu.addFunction(sin3);
    gpu.addFunction(lerp);
    gpu.addFunction(rotateVector);
    gpu.addFunction(explerp);
    gpu.addFunction(cos3);
    return gpu
  }