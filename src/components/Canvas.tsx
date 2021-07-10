import React, { DetailedHTMLProps, forwardRef, useEffect, useRef } from "react";

interface CanvasProps extends DetailedHTMLProps<React.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement> {
  draw: (context: CanvasRenderingContext2D, frameCount: number) => void;
}

// Reference: https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>((props, ref) => {
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
      const context = canvas.getContext("2d");
      if (context) {
        let frameCount = 0;
        let animationFrameId: number;

        const render = async () => {
          frameCount++;
          draw(context, frameCount)
          animationFrameId = window.requestAnimationFrame(render);
        };
        render();

        return () => {
          window.cancelAnimationFrame(animationFrameId);
        };
      }
    }
  }, [draw]);

  return <canvas ref={canvasRef} {...rest} />;
});

Canvas.displayName = "Canvas";

export default Canvas;
