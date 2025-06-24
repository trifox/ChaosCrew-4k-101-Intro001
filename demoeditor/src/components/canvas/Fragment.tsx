import FragmentCanvas from "fragment-canvas";
import { useCallback, useRef } from "react";

export const Fragment: React.FC<{ source: string }> = ({ source }) => {
  var refRender = useRef<FragmentCanvas>();
  var frag = `
  precision mediump float;
    uniform float iTime;
    void main()
    {
    
        gl_FragColor = vec4(1.3,0.5,0.8, 1.0);
}
  
  `;
  var fragBase = `#version 300 es
  precision mediump float;
  `;

  const ref = useCallback((node: any) => {
    if (node !== null && refRender.current == null) {
      console.log("Starting shader", source);
      refRender.current = new FragmentCanvas(node, {
        fragmentShader: fragBase + source.replaceAll(/#version 130/g, ""),
        uniforms: {
          iTime: (gl, location, time) => {
            console.log("saomething is happennig", location, time);
            gl.uniform1f(location, time);
          },
        },
      });
      if (node === null && refRender.current != null) {
      }
    }
  }, []);

  return (
    <div>
      <canvas style={{ width: "100px", height: "100px" }} ref={ref} />
    </div>
  );
};
