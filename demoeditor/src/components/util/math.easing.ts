import { number } from "prop-types"

export type EasingType = "linear" | "cubic" | 'quart' | 'quad' | 'elastic' | 'bounce' | 'back'
export type EasingOptions = {
    easingIn: EasingType
    easingOut: EasingType
}
const easePlease = (value: number, method: EasingType): number => {
    switch (method) {
        case 'linear':
            return value
            break;
        case 'quad':
            return easeInQuad(value)
            break;
        case 'cubic':
            return easeInCubic(value)
            break;
        case 'quart':
            return easeInQuart(value)
        case 'bounce':
            return easeOutBounce(value)
        case 'back':
            return easeInBack(value)
        case 'elastic':
            return easeInElastic(value)
            break;
        default:
            return value
    }

}
export function easeOutPlease(value: number, method: EasingType) {
    return 1 - easePlease(1 - value, method)
}
export function ease(value: number, options: EasingOptions) {

    // console.log('Easing', options.easingIn, options.easingOut)
    if (value < 0.5) {

        return easePlease(value * 2, options.easingIn) * 0.5
    } else {

        return easeOutPlease((value - 0.5) * 2, options.easingOut) * .5 + 0.5
    }


}


export function easeInSine(x: number): number {
    return 1 - Math.cos((x * Math.PI) / 2);
}

export function easeInQuad(x: number): number {
    return x * x;
}

export function easeInCubic(x: number): number {
    return x * x * x;
}

export function easeOutCubic(x: number): number {
    return 1 - easeInCubic(1 - x);
}

export function easeInQuart(x: number): number {
    return x * x * x * x;
}

export function easeInQuint(x: number): number {
    return x * x * x * x * x;
}

export function easeInCirc(x: number): number {
    return 1 - Math.sqrt(1 - Math.pow(x, 2));
}

export function easeInElastic(x: number): number {
    const c4 = (2 * Math.PI) / 3;

    return x === 0
        ? 0
        : x === 1
            ? 1
            : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
}

export function easeInExpo(x: number): number {
    return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
}

export function easeInBack(x: number): number {
    const c1 = 1.70158;
    const c3 = c1 + 1;

    return c3 * x * x * x - c1 * x * x;
}

export function easeOutBounce(x: number): number {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (x < 1 / d1) {
        return n1 * x * x;
    } else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
}