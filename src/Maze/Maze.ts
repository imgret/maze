import { RangeOf } from "../types/utility";
import { between, shuffle } from "../utility/Utility";

// Possible walls combinations from 0000 to 1111, where 1 is wall and 0 is open space
// north = 0001, south = 0010, east = 0100, west = 1000 walls
export type Walls = RangeOf<0b1111>;

export const [N, S, E, W] = [0b0001, 0b0010, 0b0100, 0b1000];
const MOVE_COL = { [N]: 0, [S]: 0, [E]: 1, [W]: -1 };
const MOVE_ROW = { [N]: -1, [S]: 1, [E]: 0, [W]: 0 };
const OPPOSITE = { [N]: S, [S]: N, [E]: W, [W]: E };

/**
 * Maze generator implemented using Recursive Backtracking.
 * Algorithm source: http://weblog.jamisbuck.org/2010/12/27/maze-generation-recursive-backtracking
 */
class Maze {
  private maze: Walls[][];

  public constructor(private readonly cols: number, private readonly rows: number) {
    this.cols = cols;
    this.rows = rows;
    this.maze = new Array(rows).fill(null).map(() => new Array(cols).fill(0));
  }

  public get grid(): readonly Walls[][] {
    return this.maze;
  }

  public get size(): { width: number; height: number } {
    return { width: this.cols, height: this.rows };
  }

  public reset() {
    this.maze = new Array(this.rows).fill(null).map(() => new Array(this.cols).fill(0))
  }

  public generateMazeFrom(col: number, row: number) {
    const directions = shuffle([N, S, E, W]);

    for (const direction of directions) {
      const [newCol, newRow] = [col + MOVE_COL[direction], row + MOVE_ROW[direction]];

      if (
        between(newRow, 0, this.maze.length - 1) &&
        between(newCol, 0, this.maze[newRow].length - 1) &&
        this.maze[newRow][newCol] === 0
      ) {
        this.maze[row][col] |= direction;
        this.maze[newRow][newCol] |= OPPOSITE[direction];
        this.generateMazeFrom(newCol, newRow);
      }
    }
  }

  public * mazeGeneratorFrom(col: number, row: number): Generator<void, void, void> {
    const directions = shuffle([N, S, E, W]);

    for (const direction of directions) {
      const [newCol, newRow] = [col + MOVE_COL[direction], row + MOVE_ROW[direction]];

      if (
        between(newRow, 0, this.maze.length - 1) &&
        between(newCol, 0, this.maze[newRow].length - 1) &&
        this.maze[newRow][newCol] === 0
      ) {
        this.maze[row][col] |= direction;
        this.maze[newRow][newCol] |= OPPOSITE[direction];
        yield;
        yield * this.mazeGeneratorFrom(newCol, newRow);
      }
    }
  }

  public toString() {
    let maze: string = "";
    maze += " " + "_".repeat(this.cols * 2 - 1) + "\n";
    for (let y = 0; y < this.rows; y++) {
      maze += "|";
      for (let x = 0; x < this.cols; x++) {
        maze += (this.maze[y][x] & S) !== 0 ? " " : "_";
        if ((this.maze[y][x] & E) !== 0) {
          maze += ((this.maze[y][x] | this.maze[y][x + 1]) & S) !== 0 ? " " : "_";
        } else {
          maze += "|";
        }
      }
      maze += "\n";
    }
    return maze;
  }
}

export default Maze;
