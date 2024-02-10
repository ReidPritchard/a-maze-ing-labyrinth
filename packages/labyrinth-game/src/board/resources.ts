import { GameBoard } from '.';
import { GameTile, createTile } from '../tile';
import { Treasure } from '../treasure';

/**
 * A simple type for deserializing the board from a string
 * Contains all the information needed to create a tile and track its properties
 */
export type FixedBoardTile = {
	type: string;
	rotation: number;
	treasure: boolean;
	fixed: boolean;
	startingPosition: boolean;
};

/**
 * An object representing the properties of a game tile. It is used to serialize and deserialize the game board.
 * Each property is represented by a unique key-value pair in the serialized form.
 *
 * - `type`: The type of the tile. Represented by the first character of the key.
 * - `rotation`: The rotation of the tile in degrees. Represented by 'r' followed by the rotation value.
 * - `treasure`: Whether the tile contains a treasure. Represented by 't' followed by 1 for true and 0 for false.
 * - `fixed`: Whether the tile is fixed in place. Represented by 'f' followed by 1 for true and 0 for false.
 * - `startingPosition`: Whether the tile is a starting position. Represented by 's' followed by 1 for true and 0 for false.
 *
 * In the serialized form, these properties are concatenated into a single string. For example, the tile
 * {
 *   type: "corner",
 *   rotation: 2,
 *   treasure: true,
 *   fixed: true,
 *   startingPosition: false,
 * }
 * would be serialized as "c-r2-t1-f1-s0".
 *
 * This approach allows for a compact and efficient serialization of the game board, while still being easy to read and understand.
 */
function serializeTile(tile: FixedBoardTile) {
	return `${tile.type[0]}-r${tile.rotation}-t${tile.treasure ? 1 : 0}-f${tile.fixed ? 1 : 0}-s${tile.startingPosition ? 1 : 0}`;
}

/**
 * Deserializes a tile from a string. The string must be in the format described in the documentation for `serializeTile`.
 */
function deserializeTile(serializedTile: string): FixedBoardTile {
	const [type, rotation, treasure, fixed, startingPosition] = serializedTile.split('-');

	const tileTypes = {
		c: 'corner',
		l: 'line',
		t: 't',
	};

	return {
		type: tileTypes[type as keyof typeof tileTypes],
		rotation: parseInt(rotation.slice(1)),
		treasure: treasure.slice(1) === '1',
		fixed: fixed.slice(1) === '1',
		startingPosition: startingPosition.slice(1) === '1',
	};
}

/**
 * A class used to represent a fixed (or "preset") board.
 * The board is parsed from a list of strings containing the tile types
 */
class FixedBoard extends GameBoard {
	constructor(boardString: string[]) {
		const rows = boardString.length;
		const columns = boardString[0].split(' ').length;

		const treasureCount = boardString.reduce(
			(count, row) =>
				count +
				row.split(' ').reduce((rowCount, tile) => {
					const { treasure } = deserializeTile(tile);
					return rowCount + (treasure ? 1 : 0);
				}, 0),
			0,
		);
		const playerCount = 4;

		super(rows, columns, treasureCount, playerCount);
	}

	/**
	 * Deserializes a board from a list of strings containing the tile types.
	 * The strings must be in the format described in the documentation for `serializeTile`.
	 */
	deserializeBoard(boardString: string[]): void {
		boardString.forEach((row, rowIndex) => {
			row.split(' ').forEach((tile, columnIndex) => {
				const { type, rotation, treasure, fixed, startingPosition } = deserializeTile(tile);

				if (treasure) {
					this.addTreasureToMap(rowIndex, columnIndex, new Treasure('Treasure', false));
				}

				if (startingPosition) {
					// TODO: Add a method to add starting positions to the player map
					// for now it will default to the 4 corners
				}

				const newTile = createTile(type as 'corner' | 'line' | 't', fixed, rotation);
				this.setTile(rowIndex, columnIndex, newTile);
			});
		});
	}
}
/**
 * In the original game, the board always has the same number of rows and columns
 * as well as each fixed tile being the same type and rotation. Each corner tile (also fixed)
 * are always corners without treasure as they are starting positions for the players.
 *
 * This file will be used to store these "fixed" boards.
 */
export const fixedBoards: FixedBoard[] = [];
