import {INIT_PLAYER, MOVE_PLAYER, CHANGE_VALUE} from '../actions/types';

export default function (state = {}, action) {
    switch(action.type) {
        case INIT_PLAYER:
            return {
                position: action.payload,
                health: 100,
                weapon: 0,
                xp: 0
            };
        
        case MOVE_PLAYER:
            return {
                ...state,
                position: {
                    y: state.position.y + action.payload.y,
                    x: state.position.x + action.payload.x
                }
            }

        case CHANGE_VALUE:
            return {
                ...state,
                [action.payload.item]: state[action.payload.item] + action.payload.value
            }
    }

    return state;
}