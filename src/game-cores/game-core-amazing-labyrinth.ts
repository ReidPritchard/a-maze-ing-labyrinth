import { ObjectType, TileOrientation, Tile, TileType, Player } from '../global/global-types';
import { Colors, TileTypeValue } from '../global/global-values';
import { shuffle } from '../utils/helpers';

export class AmazingLabyrinthCore {
  numberOfPlayers = 2;

  /**
   * The number of tiles to be used to make the game board. number of tiles = (number of rows * number of columns) + 1
   * @memberof GameLabyrinth
   * @default {50}
   * @public
   */
  private numberOfTiles = 50;
  numberOfObjectTiles = 24;

  private numberOfRows: number = (this.numberOfTiles - 1) / 2;
  private numberOfColumns: number = (this.numberOfTiles - 1) / 2;

  private gameBoard: Array<Array<Tile>>;
  private players: Array<Player>;
  private extraTile: Tile;

  constructor(numberOfPlayers = 2) {
    console.log('constructing');

    this.numberOfPlayers = numberOfPlayers;
    // this.gameBoard = this.numberOfRows === 7 ? this.generateDefaultGameBoard() : this.generateGameBoard();
    this.gameBoard = this.generateDefaultGameBoard();

    this.players = this.generatePlayers();
    this.players.forEach(player => this.setPlayerStartingPosition(player, this.gameBoard));

    this.shuffleGameBoard();
  }

  // Game Generation Methods

  private getRandomTileType(numberOfCorners = 20, numberOfTcorners = 18, numberOfStraights = 12): TileType {
    const availableTileTypes = [
      ...(numberOfCorners > 0 ? [TileTypeValue.corner] : []),
      ...(numberOfTcorners > 0 ? [TileTypeValue.tJunction] : []),
      ...(numberOfStraights > 0 ? [TileTypeValue.straight] : []),
    ];

    if (availableTileTypes.length === 0) return TileTypeValue.corner;

    const tileTypes = Object.values(availableTileTypes);
    const randomIndex = Math.floor(Math.random() * tileTypes.length);
    return tileTypes[randomIndex] as TileType;
  }

  private generateTileData(i, rowIndex, columnIndex, objectNumber): Tile {
    let chosenTileType: TileType;
    let orientation: TileOrientation;
    let contents: ObjectType;

    /**
     * 7x7 grid
     * c . t . t . c
     * . . . . . . .
     * t . t . t . t
     * . . . . . . .
     * t . t . t . t
     * . . . . . . .
     * c . t . t . c
     *
     * 4x4 grid
     * cttc
     * tttt
     * tttt
     * cttc
     *
     * 11x11 grid
     * c . t . t . t . t . c
     * . . . . . . . . . . .
     * t . t . t . t . t . t
     * . . . . . . . . . . .
     * t . t . t . t . t . t
     * . . . . . . . . . . .
     * t . t . t . t . t . t
     * . . . . . . . . . . .
     * t . t . t . t . t . t
     * . . . . . . . . . . .
     * c . t . t . t . t . c
     *
     * 6x6 grid
     * cttttc
     * tttttt
     * tttttt
     * tttttt
     * tttttt
     * cttttc
     *
     */

    // First corner tile
    if (i === 0) {
      chosenTileType = TileTypeValue.corner;
      orientation = 'right';
      contents = 'startingPoint';
    }
    // Second corner tile
    else if (rowIndex === this.numberOfColumns && columnIndex === 0) {
      chosenTileType = TileTypeValue.corner;
      orientation = 'down';
      contents = 'startingPoint';
    }
    // Third corner tile
    else if (columnIndex === this.numberOfRows && rowIndex === 0) {
      chosenTileType = TileTypeValue.corner;
      orientation = 'up';
      contents = 'startingPoint';
    }
    // Fourth corner tile
    else if (i === this.numberOfColumns * this.numberOfRows) {
      chosenTileType = TileTypeValue.corner;
      orientation = 'left';
      contents = 'startingPoint';
    }
    // set t-junction tile
    else if (columnIndex % 2 === 1 && rowIndex % 2 === 1) {
      chosenTileType = TileTypeValue.tJunction;
      orientation = rowIndex === 0 ? 'down' : columnIndex === 0 ? 'right' : rowIndex === this.numberOfColumns ? 'left' : 'up';
      contents = objectNumber;

      objectNumber++;
    }
    // Add generic tile (moveable)
    else {
      chosenTileType = this.getRandomTileType();
      orientation = rowIndex === 0 ? 'down' : columnIndex === 0 ? 'right' : rowIndex === this.numberOfColumns ? 'left' : 'up';
      contents = objectNumber;

      objectNumber++;
    }

    return {
      type: chosenTileType,
      tileOrientation: orientation,
      contents: contents,
      players: [],
    };
  }

  private generateDefaultGameBoard(): Array<Array<Tile>> {
    // cttc
    // tttt
    // tttt
    // cttc
    let objectNumber = 0;
    let numberOfCorners = 20;
    let numberOfTjunctions = 18;
    let numberOfStraights = 12;

    const hardcodedTiles = ['crtdtdcd', 'trtrtdtl', 'trtutltl', 'cututucl'];
    const hardcodedGameBoard = hardcodedTiles.map(row =>
      row.match(/.{1,2}/g).map(tile => {
        const tileType = tile.slice(0, 1) === 't' ? TileTypeValue.tJunction : TileTypeValue.corner;
        const tileOrientation = (function (orientation) {
          switch (orientation) {
            case 'r':
              return 'right';
            case 'd':
              return 'down';
            case 'l':
              return 'left';
            case 'u':
              return 'up';
            default:
              return 'right';
          }
        })(tile.slice(1, 2));
        const contents = tileType === TileTypeValue.tJunction ? objectNumber++ : 'startingPoint';

        tileType === TileTypeValue.tJunction ? numberOfTjunctions-- : numberOfCorners--;

        return {
          type: tileType as TileType,
          tileOrientation: tileOrientation as TileOrientation,
          contents: contents as ObjectType,
          players: [],
        };
      }),
    );

    // 12

    const gameBoard = hardcodedGameBoard.reduce((accBoard, row, rowIndex) => {
      const newRow: Tile[] = row.reduce((accRow, tile, columnIndex) => {
        // Add hardcoded tile to row
        accRow.push(tile);

        // if tile is not last in row, add random tile to row
        if (columnIndex < hardcodedGameBoard.length - 1) {
          accRow.push({
            type: this.getRandomTileType(numberOfCorners, numberOfTjunctions, numberOfStraights),
            tileOrientation: ['right', 'down', 'left', 'up'][Math.floor(Math.random() * 4)],
            contents: objectNumber < this.numberOfObjectTiles ? objectNumber++ : false,
            players: [],
          } as Tile);
        }

        return accRow;
      }, []);

      // Add row to game board
      accBoard.push(newRow);

      // if row is not last in board, add random row to board
      if (rowIndex < hardcodedGameBoard.length - 1) {
        accBoard.push(
          newRow.map(_tile => {
            return {
              type: this.getRandomTileType(numberOfCorners, numberOfTjunctions, numberOfStraights),
              tileOrientation: ['right', 'down', 'left', 'up'][Math.floor(Math.random() * 4)],
              contents: objectNumber < this.numberOfObjectTiles ? objectNumber++ : false,
              players: [],
            } as Tile;
          }),
        );
      }

      return accBoard;
    }, [] as Tile[][]);

    this.extraTile = this.generateExtraTile(numberOfCorners, numberOfTjunctions, numberOfStraights, objectNumber);

    return gameBoard;
  }

  private generateGameBoard(): Array<Array<Tile>> {
    let numberOfCorners = 20;
    let numberOfTjunctions = 18;
    let numberOfStraights = 12;

    const gameBoard: Array<Array<Tile>> = [];
    let row: Array<Tile> = [];
    let rowIndex = 0;
    let columnIndex = 0;
    const numberOfTiles = this.numberOfTiles;
    // let numberOfObjectTiles = this.numberOfObjectTiles;

    let objectNumber = 0;

    for (let i = 0; i < numberOfTiles; i++) {
      // Get tile information data based on it's location
      const tileData: Tile = this.generateTileData(i, rowIndex, columnIndex, objectNumber);

      const { type: chosenTileType, contents: tileContents } = tileData;

      // Add tile to row
      row.push(tileData);

      rowIndex++;
      chosenTileType === TileTypeValue.corner ? numberOfCorners-- : chosenTileType === TileTypeValue.tJunction ? numberOfTjunctions-- : numberOfStraights--;
      tileContents && tileContents !== 'startingPoint' ? objectNumber++ : null;

      // Row complete, add to game board and reset row
      if (rowIndex === this.numberOfColumns) {
        gameBoard.push(row);
        row = [];
        rowIndex = 0;
        columnIndex++;
      }
    }

    return gameBoard;
  }

  private generateExtraTile(numberOfCorners: number, numberOfTjunctions: number, numberOfStraights: number, objectNumber: number): Tile {
    return {
      type: this.getRandomTileType(numberOfCorners, numberOfTjunctions, numberOfStraights),
      tileOrientation: ['right', 'down', 'left', 'up'][Math.floor(Math.random() * 4)],
      contents: objectNumber < this.numberOfObjectTiles ? objectNumber++ : false,
      players: [],
    } as Tile;
  }

  public get labyrinth(): Tile[][] {
    return this.gameBoard;
  }

  public get spareTile(): Tile {
    return this.extraTile;
  }

  // Game Board Methods
  public shuffleGameBoard(): void {
    const allCards: Tile[] = this.gameBoard
      .map((row, rIndex) => {
        return row.filter((_tile, cIndex) => {
          const moveable = (((rIndex + 1) % 2) * (cIndex + 1)) % 2 === 0;
          return moveable;
        });
      })
      .flat();

    allCards.push(this.extraTile);

    const shuffledCards: Tile[] = shuffle(allCards);

    this.gameBoard = this.gameBoard.map((row, rIndex) => {
      return row.map((tile, cIndex) => {
        const moveable = (((rIndex + 1) % 2) * (cIndex + 1)) % 2 === 0;
        return moveable ? shuffledCards.shift() : tile;
      });
    });

    this.extraTile = shuffledCards.shift() as Tile;
  }

  // Game Player Methods

  private generatePlayers(): Array<Player> {
    const players: Array<Player> = [];

    for (let i = 0; i < this.numberOfPlayers; i++) {
      const player: Player = {
        id: i,
        name: `Player ${i + 1}`, // TODO: Get player name from user
        color: Colors[Object.keys(Colors)[i]],
        position: undefined,
        goal: undefined,
        score: 0,
      };
      players.push(player);
    }

    return players;
  }

  private setPlayerStartingPosition(player: Player, gameBoard: Array<Array<Tile>>): void {
    const startingPoint = gameBoard
      .reduce((acc, row) => {
        return acc.concat(row.filter(tile => tile.contents === 'startingPoint' && tile.players.length === 0));
      }, [])
      .find(tile => tile.type === TileTypeValue.corner);

    if (startingPoint) {
      startingPoint.players.push(player);
    }
  }
}
