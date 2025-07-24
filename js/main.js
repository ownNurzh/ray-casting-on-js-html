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





const map_colors = {1: 'MediumPurple',player:"MediumSpringGreen"};


function drawInfo() {
    ctx.font = "15px Arial sans-serif";
    ctx.fillStyle = "BlueViolet";
    ctx.fillText(`X : ${player.position.x} | Y : ${player.position.y} , DIR : ${player.direction} , POV : ${player.pov}`, 10, 20);
}



function drawMiniMap() {
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


            ctx.fillRect(
                draw_map_start_x + colIndex * map_size_per_tile,
                draw_map_start_y + rowIndex * map_size_per_tile,
                map_size_per_tile,
                map_size_per_tile
            );

            // draw player in map
            ctx.fillStyle = map_colors.player;
            ctx.fillRect(
                draw_map_start_x + player.position.x * map_size_per_tile,
                draw_map_start_y + player.position.y * map_size_per_tile,
                map_size_per_tile,
                map_size_per_tile
            );

            // draw player direction
            
            ctx.beginPath();


            ctx.moveTo(draw_map_start_x + player.position.x * map_size_per_tile + (map_size_per_tile / 2 - 1), draw_map_start_y + player.position.y * map_size_per_tile + (map_size_per_tile / 2 - 1));

            let direction_pos = player.get_direction_pos(2);
            ctx.lineTo(draw_map_start_x + direction_pos.x * map_size_per_tile, draw_map_start_y + direction_pos.y * map_size_per_tile);

            ctx.strokeStyle = "MediumPurple";
            ctx.lineWidth = 2;

            ctx.stroke();

        });
    });
}


function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawInfo()
    drawMiniMap()
    requestAnimationFrame(render);
}

function start() {
    // start
    render();
}

const keys = {
  "w": () => player.move(0.5),
  "s": () => player.move(-0.5),
  "a": () => player.rotate(-10),
  "d": () => player.rotate(10)
};


document.addEventListener("keydown", (e) => {
  const action = keys[e.key];
  if (action) action();
});



start();


