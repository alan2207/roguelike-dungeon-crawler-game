import { combineReducers } from 'redux';
import gameReducer from './game_reducer';
import playerReducer from './player_reducer';

const rootReducer = combineReducers({
  	game: gameReducer,
	player: playerReducer
});

export default rootReducer;
