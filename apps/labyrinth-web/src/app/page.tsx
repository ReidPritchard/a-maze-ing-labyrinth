'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { createBoard } from 'labyrinth-game';
import BoardView from './components/board-view/board-view';
import { GameTile, createRandomTile } from 'labyrinth-game';
import BoardExtraTile from './components/board-extra-tile/board-extra-tile';

export default function Home() {
	const [board, setBoard] = useState(createBoard(9));
	const [extraTile, setExtraTile] = useState(createRandomTile());

	const onExtraTileClick = (tile: GameTile): void => {
		console.log('Clicked on extra tile', tile);
		setExtraTile(createRandomTile()); // Generate new extra tile upon click
	};

	const onCellClick = (rowIndex: number, colIndex: number): void => {
		console.log('Clicked on cell', rowIndex, colIndex);
	};

	return (
		<main className={styles.main}>
			<h1 className={styles.title}>Labyrinth</h1>
			<div className={styles.description}>
				<BoardExtraTile tile={extraTile} onTileClick={onExtraTileClick} />
			</div>
			<div className={styles.description}>
				<BoardView board={board} onCellClick={onCellClick} />
			</div>
		</main>
	);
}
