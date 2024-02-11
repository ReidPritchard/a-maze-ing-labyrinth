import { GameBoard } from '..';

/**
 * Options for the game conductor.
 * These will be passed to the game conductor when it is created.
 */
export interface GameConductorOptions {
	/**
	 * The game board.
	 */
	gameBoard?: GameBoard;

	/**
	 * Game Board Options
	 */
	gameBoardOptions?: {
		rows: number;
		columns: number;
		treasureCount: number;
		playerCount: number;
	};

	/**
	 * Persist players between games
	 */
	persistPlayers?: boolean;
}
