import React, { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import Canvas from "./components/Canvas";
import Maze, { N, S, E, W } from "./Maze/Maze";

interface Cell {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  walls: number;
  width: number;
  height: number;
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [maze, setMaze] = useState(new Maze(5, 5));

  const drawCanvasBorder = (ctx: CanvasRenderingContext2D) => {
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.lineWidth = 1;
  };

  const isWall = (cell: number, direction: number) => (cell & direction) === 0;

  const drawCellSide = (ctx: CanvasRenderingContext2D, isWall: boolean, toX: number, toY: number) => {
    if (isWall) {
      ctx.lineTo(toX, toY);
    } else {
      ctx.moveTo(toX, toY);
    }
  };

  const drawCell = useCallback((ctx: CanvasRenderingContext2D, cell: Cell) => {
    drawCellSide(ctx, isWall(cell.walls, N), cell.x1, cell.y0);
    drawCellSide(ctx, isWall(cell.walls, E), cell.x1, cell.y1);
    drawCellSide(ctx, isWall(cell.walls, S), cell.x0, cell.y1);
    drawCellSide(ctx, isWall(cell.walls, W), cell.x0, cell.y0);
  }, []);

  const drawMaze = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const canvasWidth = ctx.canvas.width;
      const canvasHeight = ctx.canvas.height;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      drawCanvasBorder(ctx);

      ctx.beginPath();

      const cell: Cell = {
        width: canvasWidth / maze.size.width,
        height: canvasHeight / maze.size.height,
        x0: 0,
        y0: 0,
        x1: 0,
        y1: 0,
        walls: 0,
      };

      for (let row = 0; row < maze.grid.length; row++) {
        cell.y0 = row * cell.height;
        cell.y1 = cell.y0 + cell.height;
        for (let column = 0; column < maze.grid[row].length; column++) {
          cell.x0 = column * cell.width;
          cell.x1 = cell.x0 + cell.width;
          cell.walls = maze.grid[row][column];

          ctx.moveTo(cell.x0, cell.y0);

          drawCell(ctx, cell);
        }
      }
      ctx.moveTo(canvasWidth, canvasHeight);
      ctx.closePath();
      ctx.stroke();
    },
    [drawCell, maze]
  );

  useEffect(() => {
    maze.create();

    const context = canvasRef.current?.getContext("2d");
    context && drawMaze(context);
  }, [maze, drawMaze]);

  return (
    <div className="App">
      <Canvas ref={canvasRef} width={800} height={800} />
      <button
        onClick={() => {
          const newMaze = new Maze(25, 25);
          setMaze(newMaze);
        }}
      >
        New maze
      </button>
    </div>
  );
}

export default App;
