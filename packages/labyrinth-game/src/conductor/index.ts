import { Coordinate } from '../board/interfaces';
import { Direction, GameBoard, Player } from '../index';
import { GameConductorOptions, PlayerAction } from './interfaces';

export class GameConductor {
	private _gameActive = false;
	private persistPlayers = false;

	private gameBoard: GameBoard | null = null;
	private gameBoardOptions: GameConductorOptions['gameBoardOptions'] | null = null;

	private players: Player[] = [];

	private playersTurn = 0;
	private treasuresLeft = 0;

	private score: Record<string, number> = {};

	/**
	 * Create a new game conductor.
	 * @param options The options for the game conductor.
	 */
	constructor(options: GameConductorOptions) {
		const { gameBoard, gameBoardOptions, persistPlayers } = options;

		this.gameBoard = gameBoard ?? null;
		this.gameBoardOptions = gameBoardOptions ?? null;

		this.persistPlayers = persistPlayers ?? false;
	}

	private set gameActive(value: boolean) {
		this._gameActive = value;

		if (value) {
			const playerCount = this.gameBoard?.playerCount ?? this.gameBoardOptions?.playerCount ?? 4;
			this.playersTurn = Math.floor(Math.random() * playerCount);
			this.treasuresLeft = this.gameBoard?.treasureCount ?? this.gameBoardOptions?.treasureCount ?? 0;
		} else {
			// Reset the game
			this.resetGame();
		}
	}

	/**
	 * Reset the game.
	 */
	resetGame(): void {
		this._gameActive = false;
		const currentPlayers = this.gameBoard?.getAllPlayers() ?? [];

		this.gameBoard = null;
		this.players = [];
		this.playersTurn = 0;
		this.treasuresLeft = 0;

		// Save the players
		if (this.persistPlayers) {
			this.players = currentPlayers;
		} else {
			this.score = {};
		}
	}

	/**
	 * Start the game.
	 */
	startGame(): void {
		if (this._gameActive) {
			throw new Error('Game is already active');
		}

		if (this.gameBoardOptions) {
			const { rows, columns, treasureCount, playerCount } = this.gameBoardOptions;
			this.gameBoard = new GameBoard(rows, columns, treasureCount, playerCount);
		}

		this._gameActive = true;
	}

	stopGame(): void {
		this.gameActive = false;
	}

	private nextTurn(): void {
		this.playersTurn = (this.playersTurn + 1) % this.players.length;
	}

	private validateMove(player: Player, move: (Coordinate | null)[]): boolean {
		const startingPosition = move[0];
		const endingPosition = move[move.length - 1];

		// Ensure the player's starting position is correct
		if (!startingPosition || !player.position.equals(startingPosition)) {
			return false;
		}

		// Follwing the path, ensure each move is valid (the tiles connect)
		for (let i = 1; i < move.length; i++) {
			const previous = move[i - 1];
			const current = move[i];

			const currentTile = this.gameBoard?.getTile(current.row, current.column);
			const previousTile = this.gameBoard?.getTile(previous.row, previous.column);

			if (!currentTile || !previousTile) {
				return false;
			}

			// Using the cords determine which direction the player moved
			const directions: Record<Direction, number> = {
				up: current.row - previous.row,
				down: previous.row - current.row,
				left: current.column - previous.column,
				right: previous.column - current.column,
			};

			const direction = Object.keys(directions).find(key => directions[key as Direction] === 1) as Direction;

			if (!currentTile.isConnectedTo(previousTile, direction)) {
				return false;
			}
		}
	}

	/**
	 * This is a public method called for the current player to take their turn.
	 * The provided arguments describe both the shift and move actions and their order.
	 * @param action The player's action for their turn.
	 */
	playerTurn(action: PlayerAction): void {
		const { move, shift, order } = action;
		const currentPlayer = this.players[this.playersTurn];

		// Determine the order of the actions
		switch (order) {
			case 'move-first':
				// this.movePlayer(currentPlayer, move);
				// this.shiftBoard(shift.direction, shift.index);
				break;
			case 'shift-first':
				// this.shiftBoard(shift.direction, shift.index);
				// this.movePlayer(currentPlayer, move);
				break;
		}
	}
}

export function createGameConductor(options: GameConductorOptions): GameConductor {
	return new GameConductor(options);
}
