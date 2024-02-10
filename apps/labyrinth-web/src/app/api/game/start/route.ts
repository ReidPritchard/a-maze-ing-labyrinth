import { createBoard } from 'labyrinth-game';
import { NextRequest, NextResponse } from 'next/server';

/**
 * This is the route for the start of the game.
 * @param {NextRequest} request The incoming request object.
 * @param {number} request.numberOfPlayers The number of players in the game.
 * @param {"easy" | "medium" | "hard"} request.difficulty The difficulty of the game.
 * @returns {Promise<NextResponse>} The newly created game state.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
	console.log('POST /api/game/start');

	const { numberOfPlayers, difficulty } = await request.json();

	const gameBoard = createBoard(10);

	console.log(gameBoard.inspect());

	const newGame = {
		title: 'New Labyrinth Game',
		numberOfPlayers,
		difficulty,
		players: [],
		currentPlayer: 0,
		board: gameBoard,
		cards: [],
		treasures: [],
		treasureCards: [],
	};

	return NextResponse.json({ game: newGame });
}

/**
 * This is the route for the start of the game.
 * @param {NextRequest} request The incoming request object.
 * @param {number} request.numberOfPlayers The number of players in the game.
 * @param {"easy" | "medium" | "hard"} request.difficulty The difficulty of the game.
 * @returns {Promise<NextResponse>} The newly created game state.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
	console.log('GET /api/game/start');

	// const { numberOfPlayers, difficulty } = await request.json();
	// NOTE: We will use this api for testing purposes only. So we will hard code the values.
	const numberOfPlayers = 2;
	const difficulty = 'easy';

	const gameBoard = createBoard(10);

	console.log(gameBoard.inspect());

	const newGame = {
		title: 'New Labyrinth Game',
		numberOfPlayers,
		difficulty,
		players: [],
		currentPlayer: 0,
		board: gameBoard,
		cards: [],
		treasures: [],
		treasureCards: [],
	};

	return NextResponse.json({ game: newGame });
}
