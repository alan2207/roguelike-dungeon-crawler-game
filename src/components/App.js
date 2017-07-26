import React, { Component } from 'react';


import Game from '../containers/Game';

export default class App extends Component {
  render() {
    return (
      <div>
        <h1>Roguelike Dungeon Crawler Game</h1>
          <Game />
      </div>
      
    );
  }
}
