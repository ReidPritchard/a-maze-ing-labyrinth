import { GameTile } from "./tile";

export interface Player {
  position: [number, number]; // Position as an array [x, y]
  color: string;
  treasures: TreasureCard[];
}

export interface TreasureCard {
  id: number;
  name: string;
  imageUrl: string;
}

export interface GameStatus {
  turn: number;
  remainingTreasures: TreasureCard[];
  winner?: number; // Optional, will hold the player ID if there is a winner
}

export interface GameState {
  boardState: GameTile[][];
  playerState: Player[];
  gameStatus: GameStatus;
  extraTileState: GameTile;
}
