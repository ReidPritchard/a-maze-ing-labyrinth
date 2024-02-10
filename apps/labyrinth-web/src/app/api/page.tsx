/**
 * @public
 * @export
 * @returns {JSX.Element}
 * @description
 * This is the base api page that documents the api routes for the application.
 */
export default function Page(): JSX.Element {
	return (
		<main>
			<h1>API</h1>
			<p>This is the base api page that documents the api routes for the application.</p>

			<h2>Routes</h2>
			<ul>
				<li>
					<div>
						<h3>GET</h3> <a href="/api/labyrinth">/api/labyrinth</a>
						<p>
							This is the base api route for the labyrinth game. It returns the current state of the game for a given game_id. If no game_id is provided, it will return the current
							state of the game for the default game.
						</p>
					</div>
				</li>
			</ul>
		</main>
	);
}
