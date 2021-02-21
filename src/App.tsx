import React, { useState } from "react";
import "./App.css";
import Canvas from "./components/Canvas";
import useWindowSize from "./hooks/useWindowSize";
import Maze, { N, S, E, W } from "./Maze/Maze";

interface Cell {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  walls: number;
  size: number;
}

function App() {
  const [mazeWidth, setMazeWidth] = useState(10);
  const [mazeHeight, setMazeHeight] = useState(10);

  const [maze, setMaze] = useState(new Maze(mazeWidth, mazeHeight));

  const windowSize = useWindowSize();

  const isWall = (cell: number, direction: number) => (cell & direction) === 0;

  const drawCellSide = (ctx: CanvasRenderingContext2D, isWall: boolean, toX: number, toY: number) => {
    isWall ? ctx.lineTo(toX, toY) : ctx.moveTo(toX, toY);
  };

  const drawCell = (ctx: CanvasRenderingContext2D, cell: Cell) => {
    // Start cell drawing at cell's NW corner and move through NE -> SE -> SW -> NW
    ctx.moveTo(cell.x0, cell.y0);

    drawCellSide(ctx, isWall(cell.walls, N), cell.x1, cell.y0);
    drawCellSide(ctx, isWall(cell.walls, E), cell.x1, cell.y1);
    drawCellSide(ctx, isWall(cell.walls, S), cell.x0, cell.y1);
    drawCellSide(ctx, isWall(cell.walls, W), cell.x0, cell.y0);

    // Duplicate north wall to get appropriate lineJoin in NW corner
    if (isWall(cell.walls, N)) ctx.lineTo(cell.x1, cell.y0);
  };

  const drawMaze = (ctx: CanvasRenderingContext2D) => {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    const cell: Cell = {
      // Length of cell wall is min(cellWidth, cellHeight)
      size: Math.min(Math.floor(canvasWidth / maze.size.width), Math.floor(canvasHeight / maze.size.height)),
      x0: 0,
      y0: 0,
      x1: 0,
      y1: 0,
      walls: 0,
    };

    // Calculate offset from top left corner of canvas (later used to center maze in canvas)
    // Shift right by 1 bit to divide by 2 without remainder
    const offsetX = (canvasWidth - cell.size * maze.size.width) >> 1;
    const offsetY = (canvasHeight - cell.size * maze.size.height) >> 1;

    // Clear canvas before drawing
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.lineJoin = "bevel";

    // Draw every cell of maze grid
    for (let row = 0; row < maze.grid.length; row++) {
      cell.y0 = row * cell.size + offsetY;
      cell.y1 = cell.y0 + cell.size;
      for (let column = 0; column < maze.grid[row].length; column++) {
        cell.x0 = column * cell.size + offsetX;
        cell.x1 = cell.x0 + cell.size;
        cell.walls = maze.grid[row][column];

        drawCell(ctx, cell);
      }
    }

    ctx.stroke();
  };

  return (
    <div className="App">
      <Canvas width={windowSize.width} height={windowSize.height} draw={drawMaze} />
      <button
        onClick={() => {
          setMaze(new Maze(36, 25));
        }}
      >
        New maze
      </button>
    </div>
  );
}

export default App;
