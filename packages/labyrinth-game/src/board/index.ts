import { GameTile, createRandomTile } from "../tile";
import { Board } from "./interfaces";

export class GameBoard implements Board {
  private readonly board: GameTile[];
  readonly rows: number;
  readonly columns: number;

  constructor(rows: number, columns: number) {
    this.rows = rows;
    this.columns = columns;
    this.board = new Array(rows * columns).fill(null);
    this.fillBoard();
  }

  private fillBoard(): void {
    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        this.setTile(row, column, createRandomTile());
      }
    }
  }

  private index(row: number, column: number): number {
    return row * this.columns + column;
  }

  getTile(row: number, column: number): GameTile {
    return this.board[this.index(row, column)];
  }

  setTile(row: number, column: number, tile: GameTile): void {
    this.board[this.index(row, column)] = tile;
  }

  inspect(): string {
    let output = "";
    for (let row = 0; row < this.rows; row++) {
      // get all tiles in the row
      const tiles = Array.from({ length: this.columns }, (_, col) =>
        this.getTile(row, col),
      );

      // get each tile's string representation (an array of 3 lines)
      const tileLines = tiles.map((tile) => tile.toString().split("\n"));

      // join corresponding lines from each tile with '|', and join all lines with '\n'
      const rowStrings = Array.from({ length: 3 }, (_, i) =>
        tileLines.map((tile) => tile[i]).join(" "),
      );

      // add the row string to the output, with an additional '\n' for spacing
      output += rowStrings.join("\n") + "\n\n";
    }

    return output;
  }

  shiftBoard(
    row: number | undefined,
    column: number | undefined,
    direction: "up" | "down" | "left" | "right",
    tile: GameTile,
  ): GameTile {
    const shiftDirections = {
      up: () => this.shiftColumnUp(column as number, tile),
      down: () => this.shiftColumnDown(column as number, tile),
      left: () => this.shiftRowLeft(row as number, tile),
      right: () => this.shiftRowRight(row as number, tile),
    };

    return shiftDirections[direction]();
  }

  private shiftRowLeft(row: number, tile: GameTile): GameTile {
    const displacedTile = this.getTile(row, 0);
    for (let col = 0; col < this.columns - 1; col++) {
      this.setTile(row, col, this.getTile(row, col + 1));
    }
    this.setTile(row, this.columns - 1, tile);
    return displacedTile;
  }

  private shiftRowRight(row: number, tile: GameTile): GameTile {
    const displacedTile = this.getTile(row, this.columns - 1);
    for (let col = this.columns - 1; col > 0; col--) {
      this.setTile(row, col, this.getTile(row, col - 1));
    }
    this.setTile(row, 0, tile);
    return displacedTile;
  }

  private shiftColumnUp(column: number, tile: GameTile): GameTile {
    const displacedTile = this.getTile(0, column);
    for (let row = 0; row < this.rows - 1; row++) {
      this.setTile(row, column, this.getTile(row + 1, column));
    }
    this.setTile(this.rows - 1, column, tile);
    return displacedTile;
  }

  private shiftColumnDown(column: number, tile: GameTile): GameTile {
    const displacedTile = this.getTile(this.rows - 1, column);
    for (let row = this.rows - 1; row > 0; row--) {
      this.setTile(row, column, this.getTile(row - 1, column));
    }
    this.setTile(0, column, tile);
    return displacedTile;
  }
}

export function createBoard(size: number): GameBoard {
  return new GameBoard(size, size);
}
