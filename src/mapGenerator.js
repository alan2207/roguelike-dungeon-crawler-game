import {randomRange} from './helpers.js';


const GRID_HEIGHT = 30;
const GRID_WIDTH = 50;
const MAX_ROOMS = 35;
const ROOM_SIZE_RANGE = [2, 7];

const dungeonOptions = {GRID_HEIGHT, GRID_WIDTH, MAX_ROOMS, ROOM_SIZE_RANGE};


function createDungeon() {

    // make grid of empty cells:
    let grid = [];
    for(let i = 0; i < dungeonOptions.GRID_HEIGHT; i++) {
        grid.push([]);

        for(let j = 0; j < dungeonOptions.GRID_WIDTH; j++) {
            grid[i].push({type: 'brick'});
        }
    }

    // get random values for the first room:
    let [min, max] = ROOM_SIZE_RANGE;
    const firstRoom = {
        x: randomRange(1, dungeonOptions.GRID_WIDTH - max - 15),
        y: randomRange(1, dungeonOptions.GRID_HEIGHT - max - 15),
        height: randomRange(min, max),
        width: randomRange(min, max),
    };

    function isValidRoomPlacement(grid, {x, y, width = 1, height = 1}) {
        if(y < 1 || y + height > grid.length - 1) {
            return false;
        }

        if(x < 1 || x + width > grid[0].length - 1) {
            return false;
        }

        for(let i = y - 1; i < y + height + 1; i++) {
            for(let j = x - 1; j < x + width + 1; j++) {
                if(grid[i][j].type === 'space') {
                    return false;
                }
            }
        }
        return true;
    }


    // place the first room on the grid:
    function placeCells(grid, {x, y, width = 1, height = 1, /*id*/}, type = 'space') {
        for(let i = y; i < y + height; i++) {
            for(let j = x; j < x + width; j++) {
                grid[i][j] = {type, /*id*/};
                
            }
        }
        return grid;
    }


     grid = placeCells(grid, firstRoom);

    // recursively add all rooms to the grid:
    function growMap(grid, seedRooms, counter = 1, maxRooms = dungeonOptions.MAX_ROOMS) {
        if(counter + seedRooms.length >= maxRooms || seedRooms.length === 0) {
            return grid;
        }

        grid = createRoomsFromSeed(grid, seedRooms.pop());

        seedRooms.push(...grid.placedRooms);
        counter += grid.placedRooms.length;
        return growMap(grid.grid, seedRooms, counter);

    }


    function createRoomsFromSeed(grid, {x, y, width, height}, range = dungeonOptions.ROOM_SIZE_RANGE) {
        const [min, max] = range;

        const roomValues = [];

        // creating northern room:
        const north = {height: randomRange(min, max), width: randomRange(min, max)};
        north.x = randomRange(x, x + width - 1);
        north.y = y - north.height - 1;
        north.doorx = randomRange(north.x, (Math.min(north.x + north.width, x + width)) - 1);
        north.doory = y - 1;
        roomValues.push(north);


        // creating eastern room:
        const east = {height: randomRange(min, max), width: randomRange(min, max)};
        east.x = x + width + 1;
        east.y = randomRange(y, height + y - 1);
        east.doorx = east.x - 1;
        east.doory = randomRange(east.y, (Math.min(east.y + east.height, y + height)) - 1);
        roomValues.push(east);


        // creating southern room:
        const south = {height: randomRange(min, max), width: randomRange(min, max)};
        south.x = randomRange(x, x + width - 1);
        south.y = y + height + 1;
        south.doorx = randomRange(south.x, (Math.min(south.x + south.width, x + width)) - 1);
        south.doory = y + height;
        roomValues.push(south);


        // creating western room:
        const west = {height: randomRange(min, max), width: randomRange(min, max)};
        west.x = x - west.width - 1;
        west.y = randomRange(y, height + y - 1);
        west.doorx = x - 1;
        west.doory = randomRange(west.y, (Math.min(west.y + west.height, y + height)) - 1);
        roomValues.push(west);
        
        
        const placedRooms = [];


        roomValues.forEach((room) => {
            if(isValidRoomPlacement(grid, room)) {
                grid = placeCells(grid, room);
                grid = placeCells(grid, {x: room.doorx, y: room.doory}, 'space');
                placedRooms.push(room);
            }
        })

        return {grid, placedRooms};
    }

    return growMap(grid, [firstRoom]);
}

export default createDungeon;
