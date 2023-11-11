import { GameTile, createRandomTile } from "../tile";
import { TreasureMap } from "../treasure/interfaces";
import { Board } from "./interfaces";

export class GameBoard implements Board {
  private readonly board: GameTile[];
  private readonly treasures: TreasureMap = {};

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
      const tiles = Array.from({ length: this.columns }, (_, col) =>
        this.getTile(row, col)
      );

      const tileLines = tiles.map((tile) => tile.toString().split("\n"));

      const rowStrings = tileLines[0].map((_, i) =>
        tileLines.map((tile) => tile[i]).join(" ")
      );

      output += rowStrings.join("\n") + "\n\n";
    }

    return output;
  }

  shiftBoard(
    row: number | undefined,
    column: number | undefined,
    direction: "up" | "down" | "left" | "right",
    tile: GameTile
  ): GameTile {
    if (row === undefined || column === undefined) {
      throw new Error("Row or column is not defined");
    }

    const shiftDirections = {
      up: () => this.shiftColumnUp(column, tile),
      down: () => this.shiftColumnDown(column, tile),
      left: () => this.shiftRowLeft(row, tile),
      right: () => this.shiftRowRight(row, tile),
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
