import { Coordinate } from '../board/interfaces';

/**
 * Interface for a single treasure
 * @interface Treasure
 */
export interface Treasure {
	/**
	 * A unique ID for the treasure
	 */
	id: number;

	/**
	 * The name of the treasure
	 * This will be used for choosing the graphic
	 * for the treasure
	 */
	name: string;

	/**
	 * If the treasure has been found
	 */
	found: boolean;
}

/**
 * A map of treasure IDs to their coordinates
 * @interface TreasureMap
 */
export interface TreasureMap {
	[id: number]: Coordinate;
}
