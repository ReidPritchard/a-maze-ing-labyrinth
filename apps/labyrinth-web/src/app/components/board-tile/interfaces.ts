import { GameTile, Player, Treasure } from "labyrinth-game";

export type BoardTileProps = {
  boardTile: GameTile;
  onClick: (boardTile: GameTile) => void;
  treasure?: Treasure;
  players?: Player[];
};

// Prevent formatting each emoji to a single line
// prettier-ignore
export const treasureIcons = [
    "💎", "🎁", "🧧", "🏺", "🍬", "🍫", "🎂", "🍩", "🍪", "🍭", "🍯", "🍎",
    "🍓", "🍇", "🍉", "🍌", "🍒", "🍑", "🍍", "🥥", "🥝", "🍅", "🥑", "🍆",
    "🥔", "🥕", "🌽", "🌶", "🥒", "🥬", "🥦", "🍄", "🥜", "🌰", "🍞", "🥐",
    "🥖", "🥨", "🧀", "🍖", "🍗", "🥩", "🥓", "🍔", "🍟", "🍕", "🌭", "🥪",
    "🌮", "🌯", "🥙", "🍳", "🥘", "🍲", "🥣", "🥗", "🍿", "🧂", "🥫", "🍱",
    "🍜", "🍝", "🍠", "🍢", "🍣", "🍤", "🍥", "🥮", "🍡", "🍦", "🍧", "🍨",
    "🍩", "🍪", "🎂", "🍰", "🧁", "🥧", "🍫", "🍬", "🍭", "🍮", "🍯", "🍼",
    "🥛", "☕", "🍵", "🍶", "🍾", "🍷", "🍸", "🍹", "🍺", "🍻", "🥂", "🥃"
] as const;

export const iconColors = {
  RED: "red",
  ORANGE: "orange",
  YELLOW: "yellow",
  GREEN: "green",
  BLUE: "blue",
  PURPLE: "purple",
  BLACK: "black",
  WHITE: "white",
};

export const playerIcons = {
  [iconColors.RED]: "❤️",
  [iconColors.ORANGE]: "🧡",
  [iconColors.YELLOW]: "💛",
  [iconColors.GREEN]: "💚",
  [iconColors.BLUE]: "💙",
  [iconColors.PURPLE]: "💜",
  [iconColors.BLACK]: "🖤",
  [iconColors.WHITE]: "🤍",
};
