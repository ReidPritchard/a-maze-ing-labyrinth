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
    fixed: boolean = false,
    rotation?: number
  ) {
    this.up = up;
    this.down = down;
    this.left = left;
    this.right = right;
    this.fixed = fixed;
    if (rotation !== undefined) {
      for (let i = 0; i < rotation; i++) {
        this.rotate();
      }
      this.rotation = rotation;
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

  generateStringRepresentation(): string {
    const tile = Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () => " ")
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

  toString(): string {
    return this.generateStringRepresentation();
  }
}

export function createTile(
  type: keyof typeof tileMap,
  fixed: boolean = false,
  rotation: number = 0
): GameTile {
  const tile = tileMap[type];
  const { up, down, left, right } = tile;

  return new GameTile(up, down, left, right, fixed, rotation);
}

const tileMap = {
  line: { up: true, down: true, left: false, right: false },
  corner: { up: true, down: false, left: true, right: false },
  t: { up: true, down: false, left: true, right: true },
};

export function createTileFromType(
  type: keyof typeof tileMap,
  fixed: boolean = false,
  rotation: number = 0
): GameTile {
  return createTile(type, fixed, rotation);
}

export function createRandomFixedTile(): GameTile {
  const tileType = Object.keys(tileMap)[
    Math.floor(Math.random() * Object.keys(tileMap).length)
  ] as keyof typeof tileMap;
  const tileRotation = Math.floor(Math.random() * 4);

  const tile = createTileFromType(tileType, true, tileRotation);

  return tile;
}

export function createRandomTile(fixed: boolean = false): GameTile {
  const tileType = Object.keys(tileMap)[
    Math.floor(Math.random() * Object.keys(tileMap).length)
  ] as keyof typeof tileMap;
  const tileRotation = Math.floor(Math.random() * 4);

  return createTile(tileType, fixed, tileRotation);
}
