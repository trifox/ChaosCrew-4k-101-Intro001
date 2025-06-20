export function rotateVector(vec: number[], ang: number) {
  const sina: number = Math.sin(ang)
  const cosa: number = Math.cos(ang)
  return [
    vec[0] * cosa - vec[1] * sina,
    vec[0] * sina + vec[1] * cosa
  ];
};
export function lerp(v0: number, v1: number, t: number) {
  return v0 * (1 - t) + v1 * t
}
export function lerps(v0: number[], v1: number[], t: number) {
  return v0.map((item, index) => lerp(v0[index], v1[index], t))
}
export function explerp(v0: number, v1: number, t: number) {
  return Math.exp(lerp(Math.log(v0), Math.log(v1), t));
}
export function sin3(a: number) {
  return (Math.sin(a) + Math.sin(a * 2) + Math.sin(a * 4) + Math.sin(a * .5) + Math.sin(a * .25)) / 5;
}
export function cos3(a: number) {

  return (Math.cos(a) + Math.cos(a * 2) + Math.cos(a * 4) + Math.cos(a * 0.5) + Math.cos(a * 0.25)) / 5;
}