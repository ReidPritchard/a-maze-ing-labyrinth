import { GameBoard, Player } from '../index';
import { GameConductorOptions } from './interfaces';

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
}
