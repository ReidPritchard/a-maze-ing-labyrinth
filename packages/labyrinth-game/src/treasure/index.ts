
export class TreasureMap {
  private map: { [id: number]: Coordinate } = {};

  addTreasure(treasure: Treasure, coordinate: Coordinate) {
    this.map[treasure.id] = coordinate;
  }

  removeTreasure(treasure: Treasure) {
    delete this.map[treasure.id];
  }

  getTreasureCoordinate(treasure: Treasure): Coordinate | undefined {
    return this.map[treasure.id];
  }

  moveTreasure(treasure: Treasure, newCoordinate: Coordinate) {
    this.map[treasure.id] = newCoordinate;
  }
}
