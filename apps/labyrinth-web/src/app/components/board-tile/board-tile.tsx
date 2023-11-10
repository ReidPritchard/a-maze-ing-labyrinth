"use client";

import { useEffect, useState } from "react";
import { BoardTileProps } from "./interfaces";

export default function BoardTile(props: BoardTileProps) {
  const { boardTile, onClick } = props;

  const [cells, setCells] = useState<JSX.Element[]>([]);

  const tileStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gridTemplateRows: "1fr 1fr 1fr",
    position: "absolute" as const, // position tile absolutely
    top: 0, // position tile to fill grid cell
    left: 0, // position tile to fill grid cell
    width: "100%",
    height: "100%",
  };

  useEffect(() => {
    const { up, right, down, left } = boardTile;

    const newCells = Array.from({ length: 9 }, (_, i) => {
      const cellStyle = {
        gridColumn: (i % 3) + 1,
        gridRow: Math.floor(i / 3) + 1,
        backgroundColor: "white",
        border: "0px solid black",
        cursor: "pointer",
      };

      if (i === 1 && up) {
        cellStyle.backgroundColor = "black";
      } else if (i === 3 && left) {
        cellStyle.backgroundColor = "black";
      } else if (i === 4) {
        cellStyle.backgroundColor = "black";
      } else if (i === 5 && right) {
        cellStyle.backgroundColor = "black";
      } else if (i === 7 && down) {
        cellStyle.backgroundColor = "black";
      }

      return (
        <div
          key={`tile-cell-${i}`}
          style={cellStyle}
          onClick={() => onClick(boardTile)}
        />
      );
    });

    setCells(newCells);
  }, [boardTile, onClick]);

  return <div style={tileStyle}>{cells}</div>;
}
