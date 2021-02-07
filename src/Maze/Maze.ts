import { between, shuffle } from "../utility/Utility";

const [N, S, E, W] = [0b0001, 0b0010, 0b0100, 0b1000];
const DX = { [N]: 0, [S]: 0, [E]: 1, [W]: -1 };
const DY = { [N]: -1, [S]: 1, [E]: 0, [W]: 0 };
const OPPOSITE = { [N]: S, [S]: N, [E]: W, [W]: E };

/**
 * Maze generator implemented using Recursive Backtracking.
 * Algorithm source: http://weblog.jamisbuck.org/2010/12/27/maze-generation-recursive-backtracking
 */
class Maze {
  private grid: number[][];

  public constructor(private readonly width: number, private readonly height: number) {
    this.width = width;
    this.height = height;
    this.grid = [[]];
  }

  public get maze(): number[][] {
    return this.grid.map((row) => [...row]);
  }

  private carvePassagesFrom(x: number, y: number) {
    const directions = shuffle([N, S, E, W]);

    for (const direction of directions) {
      const [newX, newY] = [x + DX[direction], y + DY[direction]];

      if (
        between(newY, 0, this.grid.length - 1) &&
        between(newX, 0, this.grid[newY].length - 1) &&
        this.grid[newY][newX] === 0
      ) {
        this.grid[y][x] |= direction;
        this.grid[newY][newX] |= OPPOSITE[direction];
        this.carvePassagesFrom(newX, newY);
      }
    }
  }

  public create() {
    this.grid = new Array(this.height).fill(null).map(() => new Array(this.width).fill(0));
    this.carvePassagesFrom(0, 0);
  }

  public toString() {
    let maze: string = "";
    maze += " " + "_".repeat(this.width * 2 - 1) + "\n";
    for (let y = 0; y < this.height; y++) {
      maze += "|";
      for (let x = 0; x < this.width; x++) {
        maze += (this.grid[y][x] & S) !== 0 ? " " : "_";
        if ((this.grid[y][x] & E) !== 0) {
          maze += ((this.grid[y][x] | this.grid[y][x + 1]) & S) !== 0 ? " " : "_";
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
