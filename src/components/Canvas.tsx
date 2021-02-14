import React, { DetailedHTMLProps, forwardRef, useEffect, useRef } from "react";

interface CanvasProps extends DetailedHTMLProps<React.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement> {
  draw?: (context: CanvasRenderingContext2D) => void;
}

const Canvas = forwardRef((props: CanvasProps, ref) => {
  const { draw, ...rest } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref) return;

    typeof ref === "function" ? ref(canvasRef.current) : (ref.current = canvasRef.current);

    return () => {
      typeof ref === "function" ? ref(null) : (ref.current = null);
    };
  }, [canvasRef, ref]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas?.getContext("2d");
      if (context) {
        draw?.(context);
      }
    }
  }, [draw]);

  return <canvas ref={canvasRef} {...rest} />;
});

Canvas.displayName = "Canvas";

export default Canvas;
