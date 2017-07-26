import {POPULATE, 
        INIT_PLAYER, 
        MOVE_PLAYER, 
        CLEAR_CELL, 
        CHANGE_VALUE, 
        GAME_OVER, 
        RESTART, 
        TOGGLE_DARKEN, 
        LEVEL_UP} from './types';

export function populate(payload) {
    return {
        type: POPULATE,
        payload
    }
}

export function clearCell(coord) {
    return {
        type: CLEAR_CELL,
        payload: coord
    }
}

export function gameOver() {
    return {type: GAME_OVER};
}

export function restartGame() {
    return {type: RESTART};
}

export function toggleDarken() {
    return {type: TOGGLE_DARKEN};
}

export function levelUp() {
    return {type: LEVEL_UP};
}

// initialize the player - payload contains x and y values for player's position
export function initializePlayer(payload) {
    return {
        type: INIT_PLAYER,
        payload
    }
}


export function movePlayer(direction) {
    return {type: MOVE_PLAYER, payload: direction};
}


// changes values of weapon, health... value if negative - decrease, else increase
export function changeValue(item, value) {
    return {
        type: CHANGE_VALUE,
        payload: {
            item,
            value
        }
    }
}

