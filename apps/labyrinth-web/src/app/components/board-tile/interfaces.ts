import { GameTile, Player, Treasure } from "labyrinth-game";

export type BoardTileProps = {
  boardTile: GameTile;
  onClick: (boardTile: GameTile) => void;
  treasure?: Treasure;
  players: Player[];
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

export const playerIcons = {
  red: "❤️",
  orange: "🧡",
  yellow: "💛",
  green: "💚",
  blue: "💙",
  purple: "💜",
  black: "🖤",
  white: "🤍",
};
