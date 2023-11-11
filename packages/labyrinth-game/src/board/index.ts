import { GameTile, createRandomTile } from "../tile";
import { TreasureMap } from "../treasure";
import { Board } from "./interfaces";

export class GameBoard implements Board {
  private readonly board: GameTile[];
  private readonly treasureMap: TreasureMap = new TreasureMap();

  readonly rows: number;
  readonly columns: number;

  readonly treasureCount: number;

  constructor(rows: number, columns: number, treasureCount: number) {
    this.rows = rows;
    this.columns = columns;
    this.treasureCount = treasureCount;

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

  private fillTreasureMap(): void {
    // Add this.treasureCount treasures to the treasure map
    // The treasures should be randomly placed on the board
    // Technically, some tiles always have a treasure,
    // but we'll ignore that for now
    // We will make sure that no two treasures are placed on the same tile
    // or that a treasure is placed in any of the corners of the board
    // since these are the starting positions for the players

    let treasureCount = 0;
    while (treasureCount < this.treasureCount) {
      const row = Math.floor(Math.random() * this.rows);
      const column = Math.floor(Math.random() * this.columns);

      if (this.treasureMap.hasTreasure({ row, column })) {
        continue;
      }

      const startingPositions = [
        { row: 0, column: 0 },
        { row: 0, column: this.columns - 1 },
        { row: this.rows - 1, column: 0 },
        { row: this.rows - 1, column: this.columns - 1 },
      ];

      if (
        startingPositions.some(
          (position) => position.row === row && position.column === column
        )
      ) {
        continue;
      }

      this.treasureMap.addTreasure({ row, column });
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

export function createBoard(size: number, treasureCount?: number): GameBoard {
  treasureCount = treasureCount || Math.floor(size * size * 0.1);
  return new GameBoard(size, size, treasureCount);
}
