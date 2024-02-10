import { logMessage, LogLevel } from '@shared/utils';

import { Coordinate } from '../board/interfaces';
import { Treasure } from '../treasure';
import { PlayerPiece, playerPieceColors } from './interfaces';

/**
 * Represents a player in the game
 * A player has a name, color, treasures found,
 * current treasure, and position
 */
export class Player {
	static playerCount = 0;
	id = Player.playerCount++;

	private _playerPiece: PlayerPiece;

	private _treasuresFound: number = 0;
	private _previousTreasures: Treasure[] = [];
	private _currentTreasure: Treasure | null = null;
	private _previousPosition: Coordinate | null = null;

	constructor(readonly name: string, readonly color: keyof typeof playerPieceColors, private _position: Coordinate) {
		logMessage(`Player "${name}" created`, LogLevel.INFO);

		this._playerPiece = {
			color: playerPieceColors[color],
			shape: 'heart', // TODO: Allow for custom shapes
		};
	}

	get treasuresFound(): number {
		return this._treasuresFound;
	}

	get currentTreasure() {
		return this._currentTreasure;
	}

	get position(): Coordinate {
		return this._position;
	}

	get piece(): PlayerPiece {
		return this._playerPiece;
	}

	/**
	 * Used to draw the player's path on the board
	 */
	get previousPosition(): Coordinate | null {
		return this._previousPosition;
	}

	move(row: number, column: number): void {
		logMessage(`Player "${this.name}" moved from ${JSON.stringify(this._position)} to ${JSON.stringify({ row, column })}`, LogLevel.INFO);

		this._previousPosition = this._position;
		this._position = { row, column };
	}

	findTreasure(nextTreasure?: Treasure): void {
		logMessage(`Player "${this.name}" found a treasure: ${nextTreasure?.id}`, LogLevel.INFO);

		this._treasuresFound++;
		this._previousTreasures.push(this._currentTreasure!);
		this._currentTreasure = nextTreasure || null;
	}

	dropTreasure(): void {
		this._currentTreasure = null;
	}
}

export class PlayerMap {
	private readonly players: Map<string, Player> = new Map();

	/**
	 * A derrived property that maps coordinates to players
	 */
	private coordinateToPlayerMap: {
		[coordinate: string]: Player[];
	} = {};

	private coordinateToKey(coordinate: Coordinate): string {
		return `${coordinate.row},${coordinate.column}`;
	}

	addPlayer(player: Player): void {
		logMessage(`Adding player "${player.name}" to the game`, LogLevel.INFO);

		this.players.set(player.name, player);
		this.updateCoordinateMap();

		logMessage(`Players in the game: ${this.inspect()}`, LogLevel.DEBUG);
	}

	updatePlayer(player: Player): void {
		this.players.set(player.name, player);
		this.updateCoordinateMap();
	}

	removePlayer(player: Player): void {
		logMessage(`Removing player "${player.name}" from the game`, LogLevel.INFO);
		this.players.delete(player.name);
		this.updateCoordinateMap();
	}

	getPlayer(name: string): Player | undefined {
		return this.players.get(name);
	}

	getPlayers(): Player[] {
		return Array.from(this.players.values());
	}

	getPlayersAtPosition(coordinate: Coordinate): Player[] {
		const players = this.coordinateToPlayerMap[this.coordinateToKey(coordinate)];

		if (players) {
			logMessage(`Players at ${JSON.stringify(coordinate)}: ${players.map(player => `"[${player.color}]${player.name}"`).join(', ')}`, LogLevel.DEBUG);
		}

		return players || [];
	}

	movePlayer(player: Player, row: number, column: number): void {
		logMessage(`Moving player "${player.name}" to ${JSON.stringify({ row, column })}`, LogLevel.INFO);
		player.move(row, column);
		this.updateCoordinateMap();
	}

	updateCoordinateMap(): void {
		this.coordinateToPlayerMap = Array.from(this.players.values()).reduce((map, player) => {
			const coordinate = player.position;
			const key = this.coordinateToKey(coordinate);
			const players = map[key] || [];
			players.push(player);
			map[key] = players;
			return map;
		}, {} as { [coordinate: string]: Player[] });
	}

	inspect(): string {
		return Array.from(this.players.values())
			.map(player => player.name)
			.join(', ');
	}
}
