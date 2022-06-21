import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  shadow: true,
})
export class AppHome {
  render() {
    return (
      <div class="app-home">
        <h1>The Amazing Labyrinth</h1>
        <game-labyrinth></game-labyrinth>
      </div>
    );
  }
}
