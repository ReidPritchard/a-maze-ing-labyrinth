import { TileTypeValue, Colors } from './global-values';

// Tiles

const TileTypeList = Object.values(TileTypeValue);
export type TileType = typeof TileTypeList[number];
export type TileOrientation = 'up' | 'right' | 'down' | 'left';
export type ObjectType = number | 'startingPoint' | false;

export type Tile = {
  type: TileType;
  tileOrientation: TileOrientation;
  contents: ObjectType;
  players: Player[];
};

// Players

export type Color = typeof Colors[keyof typeof Colors];

export type Player = {
  id: number;
  name: string;
  color: Color;
  position: {
    x: number;
    y: number;
  } | undefined;
  goal: {
    id: number;
    x: number;
    y: number;
  } | undefined;
  score: number;
};
