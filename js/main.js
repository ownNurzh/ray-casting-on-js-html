import { Map } from './map.js';
import { Player } from './player.js';

const player = new Player();
const gameMap = new Map();

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

const map_size_per_tile = 15; // Size of each tile in pixels
const map_width = gameMap.map[0].length * map_size_per_tile
const map_height = gameMap.map.length * map_size_per_tile;

const draw_map_start_x = canvas.width - map_width- 15; // 15 pixels for padding
const draw_map_start_y = 15


const map_colors = {1: 'MediumPurple'};


function drawInfo() {
    ctx.font = "15px Arial sans-serif";
    ctx.fillStyle = "BlueViolet";
    ctx.fillText(`X : ${player.position.x} , Y : ${player.position.y} , DIR : ${player.direction} , POV : ${player.pov}`, 10, 20);
}

function drawMap() {
    ctx.fillStyle = 'black';
    ctx.fillRect(draw_map_start_x, draw_map_start_y, map_width, map_height);
    gameMap.map.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
            if (map_colors[tile]) {
                ctx.fillStyle = map_colors[tile];
            }
            else {
                ctx.fillStyle = 'white';
            }

            if (rowIndex == player.position.x && colIndex == player.position.y  && tile == 0) {
                ctx.fillStyle = 'MediumSpringGreen';
            }
            ctx.fillRect(
                draw_map_start_x + colIndex * map_size_per_tile,
                draw_map_start_y + rowIndex * map_size_per_tile,
                map_size_per_tile,
                map_size_per_tile
            );
        });
    });
}


function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawInfo()
    drawMap()
    requestAnimationFrame(render);
}

function start() {
    // start
    render();
}
start();