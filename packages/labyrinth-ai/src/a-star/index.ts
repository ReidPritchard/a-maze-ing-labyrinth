// function AStarPathFinding(board):
//     # Priority queue of states to explore, each represented as a (priority, state) pair.
//     # The priority is the estimated total turns, and the state includes the current board configuration and player position.
//     start_state = (0, board)
//     queue = PriorityQueue(start_state)

import { PriorityQueue } from '@datastructures-js/priority-queue';
import { GameBoard, Player } from 'labyrinth-game';

//     # Dictionary of states that have been visited and their lowest known cost.
//     # Each state is represented as a board configuration and player position.
//     visited = {start_state: 0}

//     while not queue.isEmpty():
//         # Dequeue the state with the lowest estimated total turns.
//         current_priority, current_state = queue.pop()

//         # Goal test: if the player is at the destination, return the total turns.
//         if current_state.isAtDestination():
//             return current_priority

//         # Expand the current state by applying each possible move or shift.
//         for new_state in current_state.getSuccessors():
//             new_cost = current_priority + 1
//             new_priority = new_cost + new_state.getHeuristic()

//             # If the new state has not been visited or if it has a lower cost than known, enqueue it.
//             if new_state not in visited or new_cost < visited[new_state]:
//                 visited[new_state] = new_cost
//                 queue.push((new_priority, new_state))

//     # If all states have been explored and none is the destination, there is no solution.
//     return None

interface State {
	board: GameBoard;
	cost: number; // The number of turns taken to reach this state
}

interface Priority {
	state: State;
	priority: number; // The estimated total turns to reach the destination from this state
}

/**
 * A* Path Finding algorithm to find the shortest path from the player's current position to the target treasure.
 * @param board The game board.
 * @param player The player object.
 * @returns The number of steps required to reach the target treasure, or null if no path is found.
 */
export function AStarPathFinding(board: GameBoard, player: Player): number | null {
	const start_state = [0, board];
	const queue = new PriorityQueue<Priority>((a, b) => a.priority - b.priority);
	queue.enqueue({ state: { board, cost: 0 }, priority: 0 });
	const visited: { [key: string]: number } = {};
	visited[JSON.stringify(start_state)] = 0;

	while (!queue.isEmpty()) {
		const { state: current_state, priority: current_priority } = queue.dequeue();

		// Check if the player is at the destination
		if (current_state.board.isPlayerAtTargetTreasure(player)) {
			return current_priority;
		}

		for (const new_state_board of current_state.board.getSuccessors(player)) {
			const new_cost = current_priority + 1;
			const new_priority = new_cost + new_state_board.getHeuristic(player);
			const new_state = { board: new_state_board, cost: new_cost };
			const new_state_key = JSON.stringify(new_state);

			if (!visited.hasOwnProperty(new_state_key) || new_cost < visited[new_state_key]!) {
				visited[new_state_key] = new_cost;
				queue.enqueue({ state: new_state, priority: new_priority });
			}
		}
	}

	return null;
}
