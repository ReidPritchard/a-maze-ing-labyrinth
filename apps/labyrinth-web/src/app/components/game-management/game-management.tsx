import { LogLevel, logMessage } from '@shared/utils';
import { GameConductor } from 'labyrinth-game';

/**
 * This UI Component is responsible for interacting with the game conductor
 * It's responsible for starting, stopping, and otherwise managing the game.
 * It's also responsible for displaying the game state to the user and allowing them to interact with it.
 */
export function GameManagement(props: { gameConductor?: GameConductor }) {
	const { gameConductor } = props;

	const startGame = () => {
		logMessage('Starting game', LogLevel.Info);
		gameConductor.startGame();
	};

	const stopGame = () => {
		logMessage('Stopping game', LogLevel.Info);
		gameConductor.stopGame();
	};

	const onSearchClick = (): void => {
		logMessage('Clicked on search', LogLevel.Info);
		gameConductor.board.getAllPlayers().forEach(player => {
			logMessage('Player', LogLevel.Info, player);
			logMessage('Path length:', LogLevel.Info, gameConductor.pathFinding.getPathLength(player));
		});
	};

	return (
		<div>
			<button onClick={startGame}>Start Game</button>
			<button onClick={stopGame}>Stop Game</button>
			<br />
			<br />
			<button> Search </button>
		</div>
	);
}
