import { Map } from './map.js';
import { Player } from './player.js';

import { darkenColor } from './utils.js';

const player = new Player();
const gameMap = new Map();

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

const max_distance = 15

const player_direction_line_width = 2
const map_size_per_tile = 15; 
const map_size_per_tile_center = map_size_per_tile / 2; 
const map_direction_center = map_size_per_tile_center - player_direction_line_width / 2;
const map_width = gameMap.map[0].length * map_size_per_tile
const map_height = gameMap.map.length * map_size_per_tile;


const mini_map_padding = 15; 
const draw_map_start_x = canvas.width - map_width- mini_map_padding;
const draw_map_start_y = mini_map_padding


const mini_map_colors = {1: 'MediumPurple',player:"MediumSpringGreen",direction :"MediumSlateBlue"};

const render_colors = {wall : "rgb(147, 112, 219)" ,floor: "white"};

let lastTime = performance.now();
let FPS = 0
let frames = 0;

function drawInfo() {
    ctx.font = "15px Arial sans-serif";
    ctx.fillStyle = "BlueViolet";
    ctx.fillText(`X : ${player.position.x.toFixed(2)} | Y : ${player.position.y.toFixed(2)} , DIR : ${player.direction.toFixed(2)} , POV : ${player.pov} , FPS : ${FPS}`, 10, 20);
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
            if (mini_map_colors[tile]) {
                ctx.fillStyle = mini_map_colors[tile];
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

        });
    });

    // draw player in map
    ctx.fillStyle = mini_map_colors.player;
    ctx.fillRect(
        draw_map_start_x + player.position.x * map_size_per_tile,
        draw_map_start_y + player.position.y * map_size_per_tile,
        map_size_per_tile,
        map_size_per_tile
    );

    // draw player direction
    
    // ctx.beginPath();
    // ctx.moveTo(draw_map_start_x + player.position.x * map_size_per_tile + map_direction_center, draw_map_start_y + player.position.y * map_size_per_tile + map_direction_center);
    // let direction_pos = player.get_direction_pos(player.move_speed * 2);
    // ctx.lineTo(draw_map_start_x + direction_pos.x * map_size_per_tile + map_direction_center, draw_map_start_y + direction_pos.y * map_size_per_tile + map_direction_center);
    // ctx.strokeStyle = mini_map_colors.direction;
    // ctx.lineWidth = player_direction_line_width;
    // ctx.stroke();

    // draw player ray directions 
    for (let i = 0; i < ray_positions.length; i += 50) {
        let ray = ray_positions[i];
        if (!ray) continue;
        ctx.beginPath();
        ctx.moveTo(draw_map_start_x + player.position.x * map_size_per_tile + map_direction_center, draw_map_start_y + player.position.y * map_size_per_tile + map_direction_center);
        ctx.lineTo(draw_map_start_x + ray.x * map_size_per_tile + map_direction_center, draw_map_start_y + ray.y * map_size_per_tile + map_direction_center);
        ctx.strokeStyle = mini_map_colors.direction;
        ctx.lineWidth = player_direction_line_width;
        ctx.stroke();
    }
                

    // restore the context to remove the clip
    ctx.restore();
}

let ray_positions = [];
function calculateRayDIrections() {
        for (let i = 0; i < canvas.width; i++) {
        let ray_angle = player.direction - (player.pov_rad / 2) + (i / canvas.width) * player.pov_rad;

        let ray_x = player.position.x;
        let ray_y = player.position.y;
        let step_size = 0.1;
        let ray_dx = Math.cos(ray_angle);
        let ray_dy = Math.sin(ray_angle);
        let distance = 0;
        let map_x = 0;
        let map_y = 0;

        let wall_hit = false;
        while (distance < max_distance) {
            ray_x += ray_dx * step_size;
            ray_y += ray_dy * step_size;
            distance += step_size;
            map_x = Math.round(ray_x);
            map_y = Math.round(ray_y);

            if (gameMap.map[map_y] && gameMap.map[map_y][map_x] && gameMap.map[map_y][map_x] !== 0) {
                wall_hit = true;
                break;
            }
        }
        ray_positions[i] = {
            x: ray_x,
            y: ray_y,
            distance: distance,
            angle: ray_angle,
            wall_hit: wall_hit
        };
    }
}

function drawPseudo3d() {
    for (let i = 0; i < canvas.width; i++) {
        let ray = ray_positions[i];
        let ray_angle = ray.angle;
        let distance = ray.distance;
        let corrected_distance = distance * Math.cos(ray_angle - player.direction);

        let wall_height = Math.max(1, canvas.height / (corrected_distance * 1.6));
        let wall_top = (canvas.height - wall_height) / 2;
        let wall_bottom = wall_top + wall_height;


        ctx.fillStyle = darkenColor(render_colors.wall,1 - corrected_distance / max_distance);
        ctx.fillRect(i, wall_top, 1, wall_height);

        let gradient = ctx.createLinearGradient(0, canvas.height / 2, 0, canvas.height);
        gradient.addColorStop(0,"gray"); // farther
        gradient.addColorStop(1, render_colors.floor); // nearer
        ctx.fillStyle = gradient;
        ctx.fillRect(i, wall_bottom, 1, canvas.height - wall_bottom);
    }
}



function render(currentTime) {
    ray_positions = [];
    const delta = currentTime - lastTime;
    frames++;

    if (delta >= 1000) {
        FPS = frames;
        frames = 0;
        lastTime = currentTime;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    calculateRayDIrections();
    drawPseudo3d();
    drawInfo();
    drawMiniMap();

    requestAnimationFrame(render);

}

function start() {
    // start
    requestAnimationFrame(render);
}

const keys = {
  "w": () => player.move(player.move_speed,gameMap.map),
  "s": () => player.move(-player.move_speed,gameMap.map),
  "a": () => player.rotate(-player.rotate_speed),
  "d": () => player.rotate(player.rotate_speed),
};


document.addEventListener("keydown", (e) => {
  const action = keys[e.key];
  if (action) action();
});

start();