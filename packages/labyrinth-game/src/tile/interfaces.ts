/**
 * Map of tile types to their properties
 */
export const tileMap = {
  line: { up: true, down: true, left: false, right: false },
  corner: { up: true, down: false, left: true, right: false },
  t: { up: true, down: false, left: true, right: true },
} as const;

/**
 * Interface for a single tile
 * @interface Tile
 */
export interface Tile {
  /**
   * If the tile has a path on the top
   * @type {boolean}
   */
  up: boolean;
  /**
   * If the tile has a path on the bottom
   * @type {boolean}
   */
  down: boolean;
  /**
   * If the tile has a path on the left
   * @type {boolean}
   */
  left: boolean;
  /**
   * If the tile has a path on the right
   * @type {boolean}
   */
  right: boolean;
  /**
   * If the tile is fixed to the board
   * @type {boolean}
   * @default false
   */
  fixed: boolean;
  /**
   * Rotation of the tile
   * @type {number}
   * @default 0
   * @min 0
   * @max 3
   * @step 1
   * @description
   * 0 = 0°
   * 1 = 90°
   * 2 = 180°
   * 3 = 270°
   * The rotation is clockwise.
   * The up/down/left/right properties are relative to the rotation.
   * If the tile is fixed, the rotation is still applied.
   */
  rotation: number;
}
