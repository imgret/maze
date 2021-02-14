import { between, shuffle } from "../utility/Utility";

export const [N, S, E, W] = [0b0001, 0b0010, 0b0100, 0b1000];
const DX = { [N]: 0, [S]: 0, [E]: 1, [W]: -1 };
const DY = { [N]: -1, [S]: 1, [E]: 0, [W]: 0 };
const OPPOSITE = { [N]: S, [S]: N, [E]: W, [W]: E };

/**
 * Maze generator implemented using Recursive Backtracking.
 * Algorithm source: http://weblog.jamisbuck.org/2010/12/27/maze-generation-recursive-backtracking
 */
class Maze {
  private maze: number[][];

  public constructor(private readonly width: number, private readonly height: number) {
    this.width = width;
    this.height = height;
    this.maze = [[]];
  }

  public get grid(): readonly number[][] {
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

  public create() {
    this.maze = new Array(this.height).fill(null).map(() => new Array(this.width).fill(0));
    this.carvePassagesFrom(0, 0);
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

// const m = new Maze(5, 5);
// m.create();
// console.log(m.toString());

export default Maze;
