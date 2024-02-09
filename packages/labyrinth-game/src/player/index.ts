import { Coordinate } from "../board/interfaces";
import { Treasure } from "../treasure";

/**
 * Represents a player in the game
 * A player has a name, color, treasures found,
 * current treasure, and position
 */
export class Player {
  static playerCount = 0;
  playerNumber = Player.playerCount++;

  private _treasuresFound: number = 0;
  private _previousTreasures: Treasure[] = [];
  private _currentTreasure: Treasure | null = null;
  private _previousPosition: Coordinate | null = null;

  constructor(
    readonly name: string,
    readonly color: string,
    private _position: Coordinate
  ) {}

  get treasuresFound(): number {
    return this._treasuresFound;
  }

  get currentTreasure() {
    return this._currentTreasure;
  }

  get position(): Coordinate {
    return this._position;
  }

  /**
   * Used to draw the player's path on the board
   */
  get previousPosition(): Coordinate {
    return this._previousPosition;
  }

  move(row: number, column: number): void {
    this._previousPosition = this._position;
    this._position = { row, column };
  }

  findTreasure(nextTreasure?: Treasure): void {
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
    this.players.set(player.name, player);
    this.updateCoordinateMap();
  }

  updatePlayer(player: Player): void {
    this.players.set(player.name, player);
    this.updateCoordinateMap();
  }

  removePlayer(player: Player): void {
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
    return this.coordinateToPlayerMap[this.coordinateToKey(coordinate)] || [];
  }

  movePlayer(player: Player, row: number, column: number): void {
    player.move(row, column);
    this.updateCoordinateMap();
  }

  updateCoordinateMap(): void {
    this.coordinateToPlayerMap = Object.values(this.players).reduce(
      (map, player) => {
        const coordinate = player.position;
        const key = this.coordinateToKey(coordinate);
        if (map[key]) {
          map[key].push(player);
        } else {
          map[key] = [player];
        }
        return map;
      },
      {} as { [coordinate: string]: Player[] }
    );
  }
}
