import { Tile } from "./interfaces";

export class GameTile implements Tile {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  fixed: boolean = false;
  rotation: number = 0;

  constructor(
    up: boolean,
    down: boolean,
    left: boolean,
    right: boolean,
    fixed?: boolean,
    rotation?: number,
  ) {
    this.up = up;
    this.down = down;
    this.left = left;
    this.right = right;
    if (fixed !== undefined) {
      this.fixed = fixed;
    }
    if (rotation !== undefined) {
      this.rotation = rotation;

      // Rotate the tile to the correct rotation
      for (let i = 0; i < rotation; i++) {
        this.rotate();
      }
    }
  }

  rotate(clockwise: boolean = true): void {
    // Don't rotate if the tile is fixed
    if (this.fixed) {
      return;
    }

    if (clockwise) {
      this.rotation = (this.rotation + 1) % 4;
    } else {
      this.rotation = (this.rotation + 3) % 4; // +3 is equivalent to -1 in modulo 4
    }

    const { up, down, left, right } = this;
    if (clockwise) {
      this.right = up;
      this.down = right;
      this.left = down;
      this.up = left;
    } else {
      this.right = down;
      this.up = right;
      this.left = up;
      this.down = left;
    }
  }

  toString(): string {
    const tile = Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () => " "),
    );

    const tileMap = {
      up: { row: 0, col: 1, symbol: "█" },
      down: { row: 2, col: 1, symbol: "█" },
      left: { row: 1, col: 0, symbol: "█" },
      right: { row: 1, col: 2, symbol: "█" },
    };

    Object.entries(tileMap).forEach(([direction, { row, col, symbol }]) => {
      if (this[direction as keyof typeof tileMap]) {
        tile[row][col] = symbol;
      }
    });

    tile[1][1] = "█"; // Set the center of the tile to a solid block

    return tile.map((row) => row.join("")).join("\n");
  }
}

export function createTile(
  up: boolean,
  down: boolean,
  left: boolean,
  right: boolean,
  fixed?: boolean,
  rotation?: number,
): GameTile {
  return new GameTile(up, down, left, right, fixed, rotation);
}

// const tileMap = {
//   line: {
//     column: { up: true, down: true, left: false, right: false },
//     row: { up: false, down: false, left: true, right: true },
//   },
//   corner: {
//     upLeft: { up: true, down: false, left: true, right: false },
//     upRight: { up: true, down: false, left: false, right: true },
//     downLeft: { up: false, down: true, left: true, right: false },
//     downRight: { up: false, down: true, left: false, right: true },
//   },
//   t: {
//     up: { up: true, down: false, left: true, right: true },
//     down: { up: false, down: true, left: true, right: true },
//     left: { up: true, down: true, left: true, right: false },
//     right: { up: true, down: true, left: false, right: true },
//   },
// };

const tileMap = {
  line: { up: true, down: true, left: false, right: false },
  corner: { up: true, down: false, left: true, right: false },
  t: { up: true, down: false, left: true, right: true },
};

export function createTileFromType(
  type: keyof typeof tileMap,
  fixed: boolean = false,
  rotation: number = 0,
): GameTile {
  const tile = tileMap[type];
  const { up, down, left, right } = tile;

  const newTile = createTile(up, down, left, right, fixed, rotation);

  return newTile;
}

export function createRandomFixedTile(): GameTile {
  const tileType = Object.keys(tileMap)[
    Math.floor(Math.random() * Object.keys(tileMap).length)
  ] as keyof typeof tileMap;
  const tileRotation = Math.floor(Math.random() * 4);

  const tile = createTileFromType(tileType, true, tileRotation);

  return tile;
}

export function createRandomTile(): GameTile {
  const tileType = Object.keys(tileMap)[
    Math.floor(Math.random() * Object.keys(tileMap).length)
  ] as keyof typeof tileMap;
  const tileRotation = Math.floor(Math.random() * 4);

  const tile = createTileFromType(tileType, false, tileRotation);

  return tile;
}
