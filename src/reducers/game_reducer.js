import mapGenerator from '../mapGenerator';
import {POPULATE, CLEAR_CELL, GAME_OVER, RESTART, TOGGLE_DARKEN, LEVEL_UP}  from '../actions/types';

const initialize = {
    map: mapGenerator(),
    level: 1,
    on: true,
    dark: true
}


export default function(state = initialize, action) {
    let newMap;
    switch(action.type) {
        case POPULATE:
            newMap = state.map.map((row, y) => {
                return row.map((cell, x) => {
                    if(y === action.payload.y && x === action.payload.x) {
                        return {type: action.payload.type};
                    } else {
                        return cell;
                    }
                })
            })
            return {...state, map: newMap};

        // repeating - refactor it later!!!
        case CLEAR_CELL:
            newMap = state.map.map((row, y) => {
                return row.map((cell, x) => {
                    if(y === action.payload.y && x === action.payload.x) {
                        return {type: 'space'};
                    } else {
                        return cell;
                    }
                })
            })
            return {...state, map: newMap};

        case GAME_OVER:
            return {...state, on: false};

        case RESTART:
            return initialize;

        case TOGGLE_DARKEN:
            return {...state, dark: !state.dark};

        case LEVEL_UP:
            return {...state, level: state.level + 1}

    }

    return state;
}