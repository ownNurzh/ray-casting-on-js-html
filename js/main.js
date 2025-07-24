import { Map } from './map.js';
import { Player } from './player.js';

const player = new Player();
const gameMap = new Map();

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

const player_direction_line_width = 2
const map_size_per_tile = 15; // Size of each tile in pixels
const map_size_per_tile_center = map_size_per_tile / 2; // Center offset for drawing
const map_direction_center = map_size_per_tile_center - player_direction_line_width / 2; // Center offset for direction line
const map_width = gameMap.map[0].length * map_size_per_tile
const map_height = gameMap.map.length * map_size_per_tile;


const mini_map_padding = 15; // Padding around the mini-map
const draw_map_start_x = canvas.width - map_width- mini_map_padding;
const draw_map_start_y = mini_map_padding


const map_colors = {1: 'MediumPurple',player:"MediumSpringGreen",direction :"MediumSlateBlue"};


function drawInfo() {
    ctx.font = "15px Arial sans-serif";
    ctx.fillStyle = "BlueViolet";
    ctx.fillText(`X : ${player.position.x} | Y : ${player.position.y} , DIR : ${player.direction} , POV : ${player.pov}`, 10, 20);
}



function drawMiniMap() {
    // add clip to draw only the mini-map area
    ctx.save();
    ctx.beginPath();
    ctx.rect(draw_map_start_x, draw_map_start_y, map_width, map_height);

    ctx.clip();
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
            ctx.moveTo(draw_map_start_x + player.position.x * map_size_per_tile + map_direction_center, draw_map_start_y + player.position.y * map_size_per_tile + map_direction_center);
            let direction_pos = player.get_direction_pos(3);
            ctx.lineTo(draw_map_start_x + direction_pos.x * map_size_per_tile + map_direction_center, draw_map_start_y + direction_pos.y * map_size_per_tile + map_direction_center);
            ctx.strokeStyle = map_colors.direction;
            ctx.lineWidth = player_direction_line_width;
            ctx.stroke();

        });
    });
    // restore the context to remove the clip
    ctx.restore();
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


