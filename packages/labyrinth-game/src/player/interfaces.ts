import { Coordinate } from "../board/interfaces";
import { Treasure } from "../treasure";

/**
 * Interface for a single player
 * @interface Player
 * @description
 * Tracks a single player's state and actions
 * in the board game. There will be two
 * main types of players: human and computer.
 * They will have different implementations but
 * will share the same interface.
 *
 * To prevent cheating, sensitive player information
 * will be stored in the server and only provided to the
 * user that owns the player.
 */
export interface Player {
  /**
   * The player's username
   */
  username: string;

  /**
   * The player's current score
   * The number of treasures they have collected
   * NOTE: Currently only single games are supported
   * but this could be expanded to support multiple
   * games in a single session.
   */
  score: number;

  /**
   * The player's current position on the board
   */
  position: Coordinate;

  /**
   * The piece that represents the player on the board
   * This will include any identifying information in order
   * to distinguish between players on the board
   */
  piece: PlayerPiece;

  /**
   * An array of the player's collected treasures
   */
  treasuresFound: Treasure[];
}

/**
 * The supported player piece colors
 *
 * TODO: Expand this to include more colors
 * and possibly allow for custom colors
 * but for now, since max players is 4, we
 * will limit the colors to 8
 */
export const playerPieceColors = {
  red: "red",
  blue: "blue",
  green: "green",
  yellow: "yellow",
  purple: "purple",
  orange: "orange",
  pink: "pink",
  brown: "brown",
} as const;

/**
 * The supported player piece shapes
 *
 * TODO: Similar to the colors, we can expand later
 */
export const playerPieceShapes = {
  heart: "heart",
  star: "star",
  circle: "circle",
  square: "square",
  triangle: "triangle",
} as const;

/**
 * The piece that represents the player on the board
 * This will include any identifying information in order
 * to distinguish between players on the board. However,
 * all graphics will be handled by the client.
 *
 * TODO: Might want to extend this to include more information
 * about the player's piece
 */
export interface PlayerPiece {
  /**
   * The color of the player's piece
   */
  color: keyof typeof playerPieceColors;

  /**
   * The shape of the player's piece
   */
  shape: keyof typeof playerPieceShapes;
}
