import { Tile } from "../tile/interfaces";

/**
 * Interface for a board of tiles
 * @interface Board
 * @extends {Array<Array<Tile>>}
 * @description
 * The board is a 2D array of tiles.
 * The first dimension is the row.
 * The second dimension is the column.
 * The top left tile is at board[0][0].
 * The bottom right tile is at board[n][n].
 */
export interface Board {
  /**
   * The number of rows in the board
   * @type {number}
   * @readonly
   * @description
   * This is the length of the first dimension of the board.
   * This is the number of rows in the board.
   */
  readonly rows: number;
  /**
   * The number of columns in the board
   * @type {number}
   * @readonly
   * @description
   * This is the length of the second dimension of the board.
   * This is the number of columns in the board.
   */
  readonly columns: number;
  /**
   * Get the tile at the given row and column
   * @param {number} row The row of the tile
   * @param {number} column The column of the tile
   * @returns {Tile} The tile at the given row and column
   */
  getTile(row: number, column: number): Tile;
  /**
   * Set the tile at the given row and column
   * @param {number} row The row of the tile
   * @param {number} column The column of the tile
   * @param {Tile} tile The tile to set
   * @returns {void}
   */
  setTile(row: number, column: number, tile: Tile): void;
  /**
   * Shift the tiles in the given row or column
   * @param {number} row The row to shift
   * @param {number} column The column to shift
   * @param {"up" | "down" | "left" | "right"} direction The direction to shift
   * @param {Tile} tile The tile to set at the end of the row or column
   * @returns {Tile} The tile that was shifted off the board
   * @description
   * If the row or column is out of bounds, an error is thrown.
   * If the row or column is fixed, an error is thrown.
   */
  shiftBoard(
    row: number | undefined,
    column: number | undefined,
    direction: "up" | "down" | "left" | "right",
    tile: Tile
  ): Tile;
}

/**
 * Interface for a coordinate on the board
 */
export interface Coordinate {
  /**
   * The row of the coordinate
   */
  row: number;
  /**
   * The column of the coordinate
   */
  column: number;
}
