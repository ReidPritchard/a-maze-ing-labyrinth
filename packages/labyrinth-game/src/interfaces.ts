import { Player } from './player';
import { GameTile } from './tile';
import { Treasure } from './treasure';

export interface GameStatus {
	turn: number;
	remainingTreasures: Treasure[];
	winner?: number; // Optional, will hold the player ID if there is a winner
}

export interface GameState {
	boardState: GameTile[][];
	playerState: Player[];
	gameStatus: GameStatus;
	extraTileState: GameTile;
}
