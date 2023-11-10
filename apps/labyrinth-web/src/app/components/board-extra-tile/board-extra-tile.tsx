"use client";

import { useEffect, useState } from "react";
import { BoardExtraTileProps } from "./interfaces";
import BoardTile from "../board-tile/board-tile";
import { GameTile } from "labyrinth-game";

export default function BoardExtraTile(props: BoardExtraTileProps) {
  const { tile, onTileClick } = props;

  const [, setRotation] = useState(tile.rotation);

  // we want to create a container which displays the tile
  // and allows the user to rotate it
  const componentStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    maxWidth: "100%",
    maxHeight: "100%",
  } as const;

  const tileStyle = {
    flexShrink: 0,
    width: "100%",
    height: "100%",
    cursor: "pointer",
    position: "relative", // Add relative position here
    paddingBottom: "100%", // Makes height equal to width
    boxSizing: "border-box",
    border: "1px solid black",
  } as const;

  const buttonStyle = {
    width: "100%",
    height: "100%",
    cursor: "pointer",

    padding: "0.5rem",
    margin: "0.5rem",
    border: "1px solid black",
  } as const;

  return (
    <div style={componentStyle}>
      {/* Rotate left */}
      <button
        style={buttonStyle}
        onClick={() => {
          tile.rotate(false);
          setRotation(tile.rotation);
        }}
      >
        Rotate Left
      </button>
      {/* Tile */}
      <div style={tileStyle}>
        <BoardTile boardTile={tile} onClick={() => onTileClick(tile)} />
      </div>
      {/* Rotate right */}
      <button
        style={buttonStyle}
        onClick={() => {
          tile.rotate(true);
          setRotation(tile.rotation);
        }}
      >
        Rotate Right
      </button>
    </div>
  );
}
