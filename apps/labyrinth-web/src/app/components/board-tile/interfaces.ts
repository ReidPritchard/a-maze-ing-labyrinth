import { GameTile } from "labyrinth-game";

export type BoardTileProps = {
  boardTile: GameTile;
  onClick: (boardTile: GameTile) => void;
};
