'use client';

import { LogLevel, logMessage } from '@shared/utils';
import BoardTile from '../board-tile/board-tile';
import { BoardViewProps } from './interfaces';

/**
 * BoardView
 * This is the main component for the game board.
 * It is responsible for rendering the board but not for the game logic.
 */
export default function BoardView(props: BoardViewProps) {
	const { board } = props;
	const { rows, columns } = board;

	const onCellClick = (rowIndex: number, colIndex: number) => {
		logMessage(`Clicked on cell ${rowIndex}, ${colIndex}`, LogLevel.INFO);
		props.onCellClick?.(rowIndex, colIndex);
	};

	const gameBoardStyle = {
		display: 'grid',
		gridTemplateColumns: `repeat(${columns}, 1fr)`,
		position: 'relative',
		width: '70%',
		boxSizing: 'border-box',
	} as const;

	const gridCellStyle = {
		position: 'relative', // Add relative position here
		width: '100%',
		paddingBottom: '100%', // Makes height equal to width
		boxSizing: 'border-box',
		border: '1px solid black',
	} as const;

	return (
		<div className="board" style={gameBoardStyle}>
			{[...Array(rows)].map((_, rowIndex) => (
				<div key={`board-row-${rowIndex}`} className="board-row">
					{[...Array(columns)].map((_, colIndex) => (
						<div
							style={gridCellStyle} // New square container
							key={`board-cell-${rowIndex}-${colIndex}`}
						>
							<BoardTile
								boardTile={board.getTile(rowIndex, colIndex)}
								treasure={board.getTreasureAtPos(rowIndex, colIndex)}
								players={board.getPlayers(rowIndex, colIndex)}
								onClick={() => onCellClick(rowIndex, colIndex)}
							/>
						</div>
					))}
				</div>
			))}
		</div>
	);
}
