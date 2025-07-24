//import { Map } from './map.js';
import { Player } from './player.js';

const player = new Player();


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");


function drawInfo() {
    ctx.font = "15px Arial sans-serif";
    ctx.fillStyle = "black";
    ctx.fillText(`X : ${player.position.x} , Y : ${player.position.y} , DIR : ${player.direction} , POV : ${player.pov}`, 10, 20);
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawInfo()
    requestAnimationFrame(render);
}

render();