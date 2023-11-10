import { GameTile } from "labyrinth-game";

export type BoardExtraTileProps = {
  tile: GameTile;
  onTileClick: (tile: GameTile) => void;
};
