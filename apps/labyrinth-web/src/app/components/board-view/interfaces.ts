import { GameBoard } from "labyrinth-game";

export type BoardViewProps = {
  board: GameBoard;
  onCellClick?: (rowIndex: number, colIndex: number) => void;
};
