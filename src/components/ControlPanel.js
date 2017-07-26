import React from 'react';


export default (props) => {
    return (
        <div id="info">
            <span className="info-item">Health: {props.playerInfo.health}</span>
            <span className="info-item">Weapons: {props.playerInfo.weapon}</span>
            <span className="info-item">XP: {props.playerInfo.xp}</span>
            <span className="info-item">Level: {props.gameInfo.level}</span>
            <button onClick={() => props.toggleDarken()}>Toggle Dark Mode</button>
        </div>
    )
}