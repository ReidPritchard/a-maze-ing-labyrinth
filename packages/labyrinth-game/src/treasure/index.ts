import { Coordinate } from '../board/interfaces';
export * from './interfaces';

export class TreasureMap {
	private map: {
		[id: number]: { treasure: Treasure; coordinate: Coordinate };
	} = {};

	/**
	 * A derrived property that maps coordinates to treasures
	 * this allows for faster lookup of treasures at a given coordinate
	 * It is updated once whenever a treasure is added or moved
	 */
	private coordinateToTreasureMap: {
		[coordinate: string]: Treasure[];
	} = {};

	addTreasure(treasure: Treasure, coordinate: Coordinate) {
		this.map[treasure.id] = { treasure, coordinate };
		this.updateCoordinateMap();
	}

	removeTreasure(treasure: Treasure) {
		delete this.map[treasure.id];
		this.updateCoordinateMap();
	}

	getTreasureCoordinate(treasure: Treasure): Coordinate | undefined {
		const treasureInfo = this.map[treasure.id];
		return treasureInfo ? treasureInfo.coordinate : undefined;
	}

	hasTreasure(coordinate: Coordinate): boolean {
		const coordinateString = `${coordinate.row},${coordinate.column}`;
		return !!this.coordinateToTreasureMap[coordinateString];
	}

	updateCoordinateMap() {
		this.coordinateToTreasureMap = Object.values(this.map).reduce((coordinateToTreasureMap, treasureInfo) => {
			const { coordinate, treasure } = treasureInfo;
			const coordinateString = `${coordinate.row},${coordinate.column}`;
			if (!coordinateToTreasureMap[coordinateString]) {
				coordinateToTreasureMap[coordinateString] = [];
			}
			if (coordinateToTreasureMap[coordinateString]) {
				coordinateToTreasureMap[coordinateString]?.push(treasure);
			}
			return coordinateToTreasureMap;
		}, {} as { [coordinate: string]: Treasure[] });
	}

	getTreasuresAtCoordinate(coordinate: Coordinate): Treasure[] {
		const coordinateString = `${coordinate.row},${coordinate.column}`;
		return this.coordinateToTreasureMap[coordinateString] || [];
	}

	moveTreasure(treasure: Treasure, newCoordinate: Coordinate) {
		const treasureInfo = this.map[treasure.id];
		if (treasureInfo) {
			treasureInfo.coordinate = newCoordinate;
			this.updateCoordinateMap();
		}
	}

	getUnfoundTreasures(): Treasure[] {
		return Object.values(this.map)
			.filter(treasureInfo => !treasureInfo.treasure.found)
			.map(treasureInfo => treasureInfo.treasure);
	}
}

export class Treasure implements Treasure {
	static lastId = 0;

	id: number;
	name: string;
	found: boolean;

	constructor(name: string, found = false) {
		this.id = Treasure.lastId++;
		this.name = name;
		this.found = found;
	}

	find() {
		this.found = true;
	}
}
