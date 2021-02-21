import { RangeOf } from "../types/utility";
import { between, shuffle } from "../utility/Utility";

// Possible walls combinations from 0000 to 1111, where 1 is wall and 0 is open space
// north = 0001, south = 0010, east = 0100, west = 1000 walls
export type Walls = RangeOf<0b1111>;

export const [N, S, E, W] = [0b0001, 0b0010, 0b0100, 0b1000];
const DX = { [N]: 0, [S]: 0, [E]: 1, [W]: -1 };
const DY = { [N]: -1, [S]: 1, [E]: 0, [W]: 0 };
const OPPOSITE = { [N]: S, [S]: N, [E]: W, [W]: E };

/**
 * Maze generator implemented using Recursive Backtracking.
 * Algorithm source: http://weblog.jamisbuck.org/2010/12/27/maze-generation-recursive-backtracking
 */
class Maze {
  private maze: Walls[][];

  public constructor(private readonly width: number, private readonly height: number) {
    this.width = width;
    this.height = height;
    this.maze = new Array(height).fill(null).map(() => new Array(width).fill(0));
    this.carvePassagesFrom(0, 0);
  }

  public get grid(): readonly Walls[][] {
    return this.maze;
  }

  public get size(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }

  private carvePassagesFrom(x: number, y: number) {
    const directions = shuffle([N, S, E, W]);

    for (const direction of directions) {
      const [newX, newY] = [x + DX[direction], y + DY[direction]];

      if (
        between(newY, 0, this.maze.length - 1) &&
        between(newX, 0, this.maze[newY].length - 1) &&
        this.maze[newY][newX] === 0
      ) {
        this.maze[y][x] |= direction;
        this.maze[newY][newX] |= OPPOSITE[direction];
        this.carvePassagesFrom(newX, newY);
      }
    }
  }

  public toString() {
    let maze: string = "";
    maze += " " + "_".repeat(this.width * 2 - 1) + "\n";
    for (let y = 0; y < this.height; y++) {
      maze += "|";
      for (let x = 0; x < this.width; x++) {
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
