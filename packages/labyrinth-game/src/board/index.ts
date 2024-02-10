import { Player, PlayerMap } from '../player';
import { GameTile, createRandomTile } from '../tile';
import { Treasure, TreasureMap } from '../treasure';
import { Board, Coordinate } from './interfaces';

export class GameBoard implements Board {
	private readonly startingPositions: Coordinate[] = [];

	private readonly board: GameTile[];
	private readonly treasureMap: TreasureMap = new TreasureMap();
	private readonly playerMap: PlayerMap = new PlayerMap();

	readonly rows: number;
	readonly columns: number;

	readonly treasureCount: number;
	readonly playerCount: number;

	constructor(rows: number, columns: number, treasureCount: number, playerCount: number) {
		this.rows = rows;
		this.columns = columns;
		this.treasureCount = treasureCount;
		this.playerCount = playerCount;

		this.startingPositions = defaultStartingPositions(rows, columns);

		this.board = new Array(rows * columns).fill(null);
		this.fillBoard();
		this.fillTreasureMap();
		this.fillPlayerMap();
	}

	private fillBoard(): void {
		for (let row = 0; row < this.rows; row++) {
			for (let column = 0; column < this.columns; column++) {
				// Every other column and row should be fixed (ex. [0,0], [0,2], [2, 0], [2, 2], ...)
				const isFixed = row % 2 === 0 && column % 2 === 0;
				this.setTile(row, column, createRandomTile(isFixed));
			}
		}
	}

	private fillTreasureMap(): void {
		// Add this.treasureCount treasures to the treasure map
		// The treasures should be randomly placed on the board
		// Technically, some tiles always have a treasure,
		// but we'll ignore that for now
		// We will make sure that no two treasures are placed on the same tile
		// or that a treasure is placed in any of the corners of the board
		// since these are the starting positions for the players

		for (let treasureCount = 0; treasureCount < this.treasureCount; ) {
			const row = Math.floor(Math.random() * this.rows);
			const column = Math.floor(Math.random() * this.columns);

			if (!this.treasureMap.hasTreasure({ row, column }) && !this.startingPositions.some(position => position.row === row && position.column === column)) {
				const newTreasure = new Treasure(`Treasure ${treasureCount}`, false);
				this.treasureMap.addTreasure(newTreasure, { row, column });
				treasureCount++;
			}
		}
	}

	private fillPlayerMap(): void {
		for (let i = 0; i < this.playerCount; i++) {
			const position = this.startingPositions[i];
			if (position) {
				const newPlayer = new Player(`Player ${i}`, 'blue', position);
				this.playerMap.addPlayer(newPlayer);
			}
		}
	}

	private index(row: number, column: number): number {
		return row * this.columns + column;
	}

	getTile(row: number, column: number): GameTile {
		const tile = this.board[this.index(row, column)];

		if (!tile) {
			throw new Error(`No tile found at ${row}, ${column}`);
		}

		return tile;
	}

	setTile(row: number, column: number, tile: GameTile): void {
		this.board[this.index(row, column)] = tile;
	}

	getTreasure(row: number, column: number): Treasure | undefined {
		return this.treasureMap.getTreasuresAtCoordinate({ row, column })[0];
	}

	addTreasureToMap(row: number, column: number, treasure: Treasure): void {
		this.treasureMap.addTreasure(treasure, { row, column });
	}

	getPlayers(row: number, column: number): Player[] {
		return this.playerMap.getPlayersAtPosition({ row, column });
	}

	inspect(): string {
		let output = '';
		for (let row = 0; row < this.rows; row++) {
			const tiles = Array.from({ length: this.columns }, (_, col) => this.getTile(row, col));

			const tileLines = tiles.map(tile => tile.toString().split('\n'));

			const rowStrings = tileLines[0]?.map((_, i) => tileLines.map(tile => tile[i]).join(' '));

			output += rowStrings?.join('\n') + '\n\n';
		}

		return output;
	}

	shiftBoard(row: number | undefined, column: number | undefined, direction: 'up' | 'down' | 'left' | 'right', tile: GameTile): GameTile {
		if (row === undefined || column === undefined) {
			throw new Error('Row or column is not defined');
		}

		const shiftDirections = {
			up: () => this.shiftColumnUp(column, tile),
			down: () => this.shiftColumnDown(column, tile),
			left: () => this.shiftRowLeft(row, tile),
			right: () => this.shiftRowRight(row, tile),
		};

		return shiftDirections[direction]();
	}

	private shiftRowLeft(row: number, tile: GameTile): GameTile {
		const displacedTile = this.getTile(row, 0);
		for (let col = 0; col < this.columns - 1; col++) {
			this.setTile(row, col, this.getTile(row, col + 1));
		}
		this.setTile(row, this.columns - 1, tile);
		return displacedTile;
	}

	private shiftRowRight(row: number, tile: GameTile): GameTile {
		const displacedTile = this.getTile(row, this.columns - 1);
		for (let col = this.columns - 1; col > 0; col--) {
			this.setTile(row, col, this.getTile(row, col - 1));
		}
		this.setTile(row, 0, tile);
		return displacedTile;
	}

	private shiftColumnUp(column: number, tile: GameTile): GameTile {
		const displacedTile = this.getTile(0, column);
		for (let row = 0; row < this.rows - 1; row++) {
			this.setTile(row, column, this.getTile(row + 1, column));
		}
		this.setTile(this.rows - 1, column, tile);
		return displacedTile;
	}

	private shiftColumnDown(column: number, tile: GameTile): GameTile {
		const displacedTile = this.getTile(this.rows - 1, column);
		for (let row = this.rows - 1; row > 0; row--) {
			this.setTile(row, column, this.getTile(row - 1, column));
		}
		this.setTile(0, column, tile);
		return displacedTile;
	}
}

/**
 * Function to determine the default starting positions for the players
 * These are the corners of the board and therefore
 * their coordinates are defined by the board's dimensions.
 */
function defaultStartingPositions(rows: number, columns: number): Coordinate[] {
	return [
		{ row: 0, column: 0 },
		{ row: 0, column: columns - 1 },
		{ row: rows - 1, column: 0 },
		{ row: rows - 1, column: columns - 1 },
	];
}

export function createBoard(size: number, treasureCount?: number, playerCount?: number): GameBoard {
	treasureCount = treasureCount || Math.floor(size * size * 0.5);
	return new GameBoard(size, size, treasureCount, playerCount || 2);
}
