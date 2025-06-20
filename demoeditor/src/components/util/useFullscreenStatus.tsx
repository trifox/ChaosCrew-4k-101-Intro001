import React from "react";

export default function useFullscreenStatus(elRef:any) {
    const [isFullscreen, setIsFullscreen] = React.useState(
      false
    );
  
    const setFullscreen = () => {
      if (elRef.current == null) return;
  
      elRef.current
        .requestFullscreen()
        .then(() => {
            /* @ts-ignore */
          setIsFullscreen(true);
        })
        .catch(() => {
          setIsFullscreen(false);
        });
    };
  
    React.useLayoutEffect(() => {
      document.onfullscreenchange = () =>
      /* @ts-ignore */
        setIsFullscreen(document[getBrowserFullscreenElementProp()] != null);
  
          /* @ts-ignore */
      return () => (document.onfullscreenchange = undefined);
    });
  
    return [isFullscreen, setFullscreen];
  }
  
  function getBrowserFullscreenElementProp() {
    if (typeof document.fullscreenElement !== "undefined") {
      return "fullscreenElement";
      /* @ts-ignore */
    } else if (typeof document.mozFullScreenElement !== "undefined") {
      return "mozFullScreenElement";
      /* @ts-ignore */
    } else if (typeof document.msFullscreenElement !== "undefined") {
      return "msFullscreenElement";
      /* @ts-ignore */
    } else if (typeof document.webkitFullscreenElement !== "undefined") {
      return "webkitFullscreenElement";
    } else {
      throw new Error("fullscreenElement is not supported by this browser");
    }
  }