import React from 'react';
import _ from 'lodash';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {populate,
        initializePlayer, 
        movePlayer, 
        clearCell, 
        changeValue, 
        gameOver, 
        restartGame, 
        toggleDarken, 
        levelUp} from '../actions';


import ControlPanel from '../components/ControlPanel';

// TODO:
// optimize moving by using map as separate component that does not update instead of rerender the whole map over and over?
// syle sprites



class Game extends React.Component {

    constructor(props) {
        super(props);
    }


    componentDidMount() {
        // setting up all the actors of the game on the map:
        this.initializeLevel();
        this.populatePlayer(this.props.game.map);

        // adding eventListener for arrow keys:
        document.onkeyup = (e) => {
            let direction;

            switch (e.keyCode) {
                case 37:
                    direction = {
                        y: 0,
                        x: -1
                    }
                    break;
                case 38:
                    direction = {
                        y: -1,
                        x: 0
                    }
                    break;
                case 39:
                    direction = {
                        y: 0,
                        x: 1
                    }
                    break;
                case 40:
                    direction = {
                        y: 1,
                        x: 0
                    }
                    break;
            }
            let targetType = this.props.game.map[this.props.player.position.y + direction.y][this.props.player.position.x + direction.x].type;
            
            if(targetType !== 'brick') {

                switch(targetType) {
                    case 'health':
                        // increase health only if it drops below 100
                        if(this.props.player.health < 100) {
                            this.props.actions.changeValue(targetType, 10)
                        }
                        break;
                    case 'weapon':
                        // increase weapon only if it drops below 5
                        if(this.props.player.weapon < 5) {
                            this.props.actions.changeValue(targetType, 1);
                        }
                        
                        break;
                    
                    case 'monster':
                        this.fightMonster();
                        break;

                }
                // clear only if target is not space already:
                if(targetType !== 'space') {
                    this.props.actions.clearCell({y: this.props.player.position.y + direction.y, x: this.props.player.position.x + direction.x});
                }

                this.checkGameStatus();
                
                this.move(direction)
            }
            
        };
    }

    // checking game status for leveling up or game over
    checkGameStatus() {
        if(this.props.player.health <= 0 || this.props.game.level >= 6) {
            this.props.actions.gameOver()
        }

        if(this.props.player.xp >= (this.props.game.level * 50)) {
            this.levelUp();
        }
    }

    levelUp() {
        this.props.actions.levelUp();
        this.initializeLevel();
    }

    restartGame() {
        this.populatePlayer(this.props.game.map, true);
        this.props.actions.restartGame();
        this.initializeLevel();
    }

    initializeLevel() {
        this.populate('monster', this.props.game.map);
        this.populate('health', this.props.game.map);
        this.populate('weapon', this.props.game.map);
    }

    // series of actions when the player fights a monster:
    fightMonster() {
        if(this.props.player.weapon) {
            this.props.actions.changeValue('health', -10);
            this.props.actions.changeValue('weapon', -1);
        } else {
            this.props.actions.changeValue('health', -(20 + (this.props.game.level * 10)));
        }
        this.props.actions.changeValue('xp', 10);
    }

    
    move(direction) {
        this.props.actions.movePlayer(direction);
    }

    // populate monsters, health, weapons
    populate(type, grid) {
        
        let count = 7;

        const gridHeight = grid.length, gridWidth = grid[0].length;

        while (count) {
            let y = _.random(1, gridHeight - 1);
            let x = _.random(1, gridWidth - 1);

            if(grid[y][x].type === 'space') {
                this.props.actions.populate({type, y, x});

                count--;
            }
        }

    }

    // place player on the map
    populatePlayer(grid, restarting) {
        const gridHeight = grid.length, gridWidth = grid[0].length;

        //check if the player has already been initialized:
        let player = !!this.props.player.position;


        // second argument, required when restarting the game because player is true
        if(restarting) {
            player = false;
        }

        while (!player) {
            let y = _.random(1, gridHeight - 1);
            let x = _.random(1, gridWidth - 1);

            if(grid[y][x].type === 'space') {

                this.props.actions.initializePlayer({y, x});
                player = true;

            }
        }
    }

    determineClass(cell, y, x) {
        // if darken is on show proper colors for cells that are in range of 5 only
        if(this.props.game.dark) {
            if(this.props.player.position && (x < this.props.player.position.x + 5 && x > this.props.player.position.x - 5) && (y < this.props.player.position.y + 5 && y > this.props.player.position.y - 5)) {
                if(this.props.player.position && y === this.props.player.position.y && x === this.props.player.position.x) {
                        return 'cell player';
                    }

                    if(cell.type === 'brick') {
                        return 'cell';
                    } else {
                        return 'cell ' + cell.type;
                    }
                }

                // darken all other cells
                return 'cell darken'

                // if toggle mode is off, show the entire map:
        }  else {
            if(this.props.player.position && y === this.props.player.position.y && x === this.props.player.position.x) {
                return 'cell player';
            }

            if(cell.type === 'brick') {
                return 'cell';
            } else {
                return 'cell ' + cell.type;
            }
        }
        
    }

    // rendering cells to for the map
    renderCells() {
         return this.props.game.map.map((row, y) => {
            return (
                <tr key={Date.now() + y}>
                    {
                        row.map((cell, x) => {
                            return (
                                <td className={this.determineClass(cell, y, x)
                                }
                                key={x}
                                >

                                </td>
                            )
                        })
                    }
                </tr>
            )
        })
    }

    render() {
        // checking if the game is on:
        return this.props.game.on ? (
            <div>
                <ControlPanel toggleDarken={this.props.actions.toggleDarken.bind(this)} playerInfo={this.props.player} gameInfo={this.props.game}/>
                <table>
                    <tbody>
                        {this.renderCells()}
                    </tbody>
                </table>
            </div>
            // if the game is over, and if max level is reached, notify the user about completed game
        ) : this.props.game.level === 6 ? <div><h3>Congratulations, you completed the game!!!</h3><button onClick={this.restartGame.bind(this)}>Restart</button></div> :
                                            // else notify that the game is over
                                          <div><h3>Game over</h3><button onClick={this.restartGame.bind(this)}>Restart</button></div>
    }
}

function mapStateToProps(state) {
    return {
        game: state.game,
        player: state.player
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            populate: bindActionCreators(populate ,dispatch),
            initializePlayer: bindActionCreators(initializePlayer, dispatch),
            movePlayer: bindActionCreators(movePlayer, dispatch),
            clearCell: bindActionCreators(clearCell, dispatch),
            changeValue: bindActionCreators(changeValue, dispatch),
            gameOver: bindActionCreators(gameOver, dispatch),
            restartGame: bindActionCreators(restartGame, dispatch),
            toggleDarken: bindActionCreators(toggleDarken, dispatch),
            levelUp: bindActionCreators(levelUp, dispatch)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);