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

	private extraTile: GameTile | null = null;

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
		this.extraTile = createRandomTile(false);
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
				// FIXME: This should be a "draw from deck" method
				const randomTreasure = this.treasureMap.getUnfoundTreasures()[Math.floor(Math.random() * this.treasureMap.getUnfoundTreasures().length)];
				newPlayer.currentTreasure = randomTreasure || null;
				this.playerMap.addPlayer(newPlayer);
			}
		}
	}

	private index(row: number, column: number): number {
		return row * this.columns + column;
	}

	getExtraTile(): GameTile {
		if (!this.extraTile) {
			throw new Error('No extra tile available');
		}
		return this.extraTile;
	}

	setExtraTile(tile: GameTile): void {
		this.extraTile = tile;
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

	getTreasureAtPos(row: number, column: number): Treasure | undefined {
		return this.treasureMap.getTreasuresAtCoordinate({ row, column })[0];
	}

	/**
	 * Get the position of a treasure on the board.
	 * @param treasure The treasure to find the position of.
	 * @returns The position of the treasure on the board, (-1, -1) if the treasure is the extra tile, or undefined if the treasure is not on the board.
	 */
	getTreasurePos(treasure: Treasure): Coordinate | undefined {
		return this.treasureMap.getTreasureCoordinate(treasure);
	}

	addTreasureToMap(row: number, column: number, treasure: Treasure): void {
		this.treasureMap.addTreasure(treasure, { row, column });
	}

	getPlayers(row: number, column: number): Player[] {
		return this.playerMap.getPlayersAtPosition({ row, column });
	}

	getAllPlayers(): Player[] {
		return this.playerMap.getPlayers();
	}

	isPlayerAtTargetTreasure(player: Player): boolean {
		const targetTreasure = player.currentTreasure;
		const treasure = this.getTreasureAtPos(player.position.row, player.position.column);
		return targetTreasure === treasure;
	}

	movePlayerTo(player: Player, row: number, column: number): void {
		this.playerMap.movePlayer(player, row, column);
	}

	/**
	 * Generate all possible next states from the current state.
	 * This could mean generating all possible positions the player could move to
	 * from their current position, or generating all possible configurations of
	 * the board after a legal game move.
	 * @param player The player whose possible next states are being generated.
	 * @returns An array of new GameBoard instances representing the possible next states.
	 */
	getSuccessors(player: Player): GameBoard[] {
		const possibleMoves = this.getPossibleMoves(player);
		const possibleShifts = this.getPossibleShifts();

		const possibleNextStates = possibleMoves.concat(possibleShifts);

		return possibleNextStates;
	}

	/**
	 * Get all possible player moves from the current position.
	 * @param player The player whose possible moves are being generated.
	 * @returns An array of new GameBoard instances representing the possible next states.
	 */
	getPossibleMoves(player: Player): GameBoard[] {
		// This function is checking all paths in the current board state
		// A player can move an arbitrary number of spaces in any direction
		// This should return an array of all possible board states after the player moves
		// Another way to think about it is find all tiles that are reachable from the player's current position
		// and then return a new board for each of those tiles

		const possibleMoves: GameBoard[] = [];
		const visited: boolean[][] = Array.from({ length: this.rows }, () => Array(this.columns).fill(false));
		const directions = [
			[-1, 0],
			[1, 0],
			[0, -1],
			[0, 1],
		]; // Up, Down, Left, Right

		const startingPosition = player.position;

		// Recursive function to find all possible moves, the move passed in is the current position of the player
		// and the path is the current path taken to get to the current position
		const findPossibleMoves = (move: Coordinate, path: Coordinate[]): void => {
			const { row, column } = move;
			const visitedRow = visited[row];
			if (visitedRow === undefined) {
				throw new Error('Row is out of bounds');
			}

			const visitedTile = visitedRow[column];
			if (visitedTile) {
				// We have already been here, ideally we should check this before moving
				return;
			}
			visitedRow[column] = true;

			// Check all possible moves from the current position
			for (const [rowOffset, columnOffset] of directions) {
				const newRow = row + rowOffset!;
				const newColumn = column + columnOffset!;

				// Check if the new position is within the bounds of the board
				if (newRow >= 0 && newRow < this.rows && newColumn >= 0 && newColumn < this.columns) {
					const hasVisitedRow = visited[newRow];
					// Check if the new position has been visited
					if (hasVisitedRow !== undefined && !hasVisitedRow[newColumn]) {
						// Add the new position to the current path
						const newPath = path.concat({ row: newRow, column: newColumn });
						findPossibleMoves({ row: newRow, column: newColumn }, newPath);
					}
				}
			}
		};

		findPossibleMoves(startingPosition, [startingPosition]);

		return possibleMoves;
	}

	/**
	 * Get all possible board shifts from the current state.
	 * @returns An array of new GameBoard instances representing the possible next states.
	 */
	getPossibleShifts(): GameBoard[] {
		// This function is checking all possible shifts in the current board state
		// A player can shift only non-fixed rows or columns and will always use the
		// extra tile to fill the gap

		const possibleShifts: GameBoard[] = [];
		const directions: ('up' | 'down' | 'left' | 'right')[] = ['up', 'down', 'left', 'right'];
		// We only need to check the first tile in each row and column
		// to see if it is fixed. We can than shift it once in each direction
		// to get all possible shifts
		for (let row = 0; row < this.rows; row++) {
			if (!this.getTile(row, 0).fixed) {
				directions.slice(0, 2).forEach(dir => {
					const newBoard = this.clone();
					const displacedTile = newBoard.shiftBoard(row, 0, dir, newBoard.getExtraTile());
					newBoard.setExtraTile(displacedTile);
					possibleShifts.push(newBoard);
				});
			}
		}

		for (let column = 0; column < this.columns; column++) {
			if (!this.getTile(0, column).fixed) {
				directions.slice(2).forEach(dir => {
					const newBoard = this.clone();
					const displacedTile = newBoard.shiftBoard(0, column, dir, newBoard.getExtraTile());
					newBoard.setExtraTile(displacedTile);
					possibleShifts.push(newBoard);
				});
			}
		}

		return possibleShifts;
	}

	/**
	 * Get the heuristic value of the current state.
	 * This is an estimate of the number of moves required to reach the goal state.
	 * @param player The player whose heuristic value is being calculated.
	 * @returns The heuristic value of the current state.
	 */
	getHeuristic(player: Player): number {
		// This is a very naive heuristic
		// but we will use the manhattan distance to the target treasure
		// allowing the player to move in any direction and wrap around the board
		const targetTreasure = player.currentTreasure;
		const treasure = this.getTreasureAtPos(player.position.row, player.position.column);
		if (targetTreasure === treasure) {
			return 0;
		}

		const targetTreasurePosition = this.getTreasurePos(targetTreasure!);
		const rows = Math.abs(targetTreasurePosition?.row! - player.position.row);
		const columns = Math.abs(targetTreasurePosition?.column! - player.position.column);

		return rows + columns;
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

	clone(): GameBoard {
		// FIXME: This method should return a deep copy of the current board
		const newBoard = new GameBoard(this.rows, this.columns, this.treasureCount, this.playerCount);
		// newBoard.board = this.board.slice();
		// newBoard.treasureMap = this.treasureMap.clone();
		// newBoard.playerMap = this.playerMap.clone();
		return newBoard;
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
