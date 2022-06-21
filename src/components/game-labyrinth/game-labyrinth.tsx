import { Component, h, Host, JSX, State } from '@stencil/core';
import { AmazingLabyrinthCore } from '../../game-cores/game-core-amazing-labyrinth';
import { Tile } from '../../global/global-types';
import { emojiList, TileTypeValue } from '../../global/global-values';

@Component({
  tag: 'game-labyrinth',
  styleUrl: 'game-labyrinth.css',
  shadow: true,
})
export class GameLabyrinth {
  @State() gameCore: AmazingLabyrinthCore;

  componentWillLoad() {
    this.gameCore = new AmazingLabyrinthCore(4);
  }

  private renderTile(tile: Tile, index: number = undefined): JSX.Element {
    let tileImage = '';
    switch (tile.type) {
      case TileTypeValue.corner:
        tileImage = '└';
        break;
      case TileTypeValue.tJunction:
        tileImage = '┴';
        break;
      case TileTypeValue.straight:
      default:
        tileImage = '┃';
        break;
    }

    return (
      <div class={`tile ${index !== undefined ? (index % 2 ? 'static' : 'dynamic') : ""}`}>
        <div class={tile.tileOrientation}>
          {tile.players.map(player => (
            <div class={`playerIcon ${player.color}`}></div>
          ))}
          {typeof tile.contents === "number" ? (<div class="contents">{emojiList[tile.contents]}</div>) : ""}
          {tileImage}
        </div>
      </div>
    );
  }

  private renderGameBoard() {
    console.log('rendering game board');
    const gameBoard = this.gameCore.labyrinth;
    console.log('game board: ', gameBoard);
    return (
      <div class="game-board">
        {gameBoard.map((row, rIndex) => (
          <div class="game-row">{row.map((cell, cIndex) => this.renderTile(cell, ((rIndex + 1) % 2) * (cIndex + 1)))}</div>
        ))}
      </div>
    );
  }

  private renderExtraTile() {
    console.log('rendering extra tile');
    const extraTile = this.gameCore.spareTile;
    console.log('extra tile: ', extraTile);

    const extraTileHTML = this.renderTile(extraTile);
    console.log('extra tile html: ', extraTileHTML);

    return <div id="extra-tile">{extraTileHTML}</div>;
  }

  render() {
    console.log('rendering game-labyrinth');
    return (
      <Host>
        {this.renderExtraTile()}
        {this.renderGameBoard()}
      </Host>
    );
  }
}
