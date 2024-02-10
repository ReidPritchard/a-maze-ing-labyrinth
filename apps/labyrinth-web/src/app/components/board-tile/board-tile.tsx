'use client';

import { useEffect, useState } from 'react';
import { BoardTileProps, treasureIcons, playerIcons } from './interfaces';
import React from 'react';

export default function BoardTile(props: BoardTileProps): JSX.Element {
	const { boardTile, treasure, players, onClick } = props;

	const [cells, setCells] = useState<JSX.Element[]>([]);

	const tileStyle = {
		display: 'grid',
		gridTemplateColumns: '1fr 1fr 1fr',
		gridTemplateRows: '1fr 1fr 1fr',
		position: 'absolute' as const, // position tile absolutely
		top: 0, // position tile to fill grid cell
		left: 0, // position tile to fill grid cell
		width: '100%',
		height: '100%',
	};

	const treasureStyle = {
		fontSize: '2.5em',
		// position the treasure so that the size of the cell is respected
		position: 'absolute' as const,
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	};

	const playersStyle = {
		fontSize: '1.5em',
		// position the players so that the size of the cell is respected
		position: 'absolute' as const,
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	};

	useEffect(() => {
		const { up, right, down, left, fixed } = boardTile;
		const { id, name, found } = treasure || {};

		// For the icon check if the name is an emoji code
		// if not, use the id to index into the icon array
		const treasureIcon = name?.match(/[\u{1F600}-\u{1F64F}]/gu) ? name : treasureIcons[id ?? Math.floor(Math.random() * treasureIcons.length)];

		const currentPlayersIcons =
			players?.map((player, index) => {
				const { id, name, color } = player;
				// For the icon check if the name is an emoji code
				// if not, check if we can use the color as a key in the icon array
				// if not, use the id to index into the icon array
				const playerIcon = name?.match(/[\u{1F600}-\u{1F64F}]/gu) ? name : playerIcons[color] || playerIcons[id ?? Math.floor(Math.random() * Number(playerIcons.length))];

				// Offset the position of the player icons so they don't overlap
				const offset = index * 10;
				const position = `translate(${offset}px, ${offset}px)`;
				const style = {
					transform: position,
					zIndex: index,
				};

				// return playerIcon;
				return (
					<div key={`player-${id}`} style={style}>
						{playerIcon}
					</div>
				);
			}) || [];

		const newCells = Array.from({ length: 9 }, (_, i) => {
			const cellStyle = {
				gridColumn: (i % 3) + 1,
				gridRow: Math.floor(i / 3) + 1,
				backgroundColor: fixed ? 'gray' : 'white',
				border: '0px solid black',
				cursor: 'pointer',
			};

			if (i === 1 && up) {
				cellStyle.backgroundColor = 'black';
			} else if (i === 3 && left) {
				cellStyle.backgroundColor = 'black';
			} else if (i === 4) {
				cellStyle.backgroundColor = 'black';
			} else if (i === 5 && right) {
				cellStyle.backgroundColor = 'black';
			} else if (i === 7 && down) {
				cellStyle.backgroundColor = 'black';
			}

			const shouldShowTreasure = treasure && i === 4 && found === false;
			const shouldShowPlayers = (players?.length ?? 0) > 0 && i === 4;

			return (
				<div key={`tile-cell-${i}`} style={cellStyle} onClick={() => onClick(boardTile)}>
					{shouldShowTreasure && <div style={treasureStyle}>{treasureIcon}</div>}
					{shouldShowPlayers && <div style={playersStyle}>{currentPlayersIcons}</div>}
				</div>
			);
		});

		setCells(newCells);
	}, [boardTile, onClick]);

	return <div style={tileStyle}>{cells}</div>;
}
