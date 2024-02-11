import { GameBoard } from '..';
import { Coordinate } from '../board/interfaces';

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

/**
 * An interface used to describe a player's full "action" during their turn.
 * This includes the player's move and board shift as well as the order in which they occur.
 * This is used to describe the player's turn to the game conductor.
 * The game conductor will then use this information to update the game board and player scores.
 */
export interface PlayerAction {
	/**
	 * The player's move action.
	 * This is the full path the player takes on the game board.
	 * The first element is the player's starting position and the last element is the player's ending position.
	 *
	 * We won't assume this is a valid path, the game conductor will validate it before updating the game board.
	 */
	move: (Coordinate | null)[];

	/**
	 * The player's board shift action.
	 * This is the direction the player shifts the game board
	 * and which row or column they are shifting.
	 */
	shift: {
		direction: 'up' | 'down' | 'left' | 'right';
		index: number;
	};

	/**
	 * The order in which the player's move and shift actions occur.
	 * This is used to determine which action to perform first.
	 */
	order: 'move-first' | 'shift-first';
}
