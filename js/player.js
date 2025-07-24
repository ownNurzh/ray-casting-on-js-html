export class Player {
    constructor() {
        this.position = {x: 1, y: 1};
        this.pov = 60;
        this.direction = 0;
        this.move_speed = 0.5;
        this.rotate_speed = 15;
    }


    get_direction_pos(speed) {
        return {
            x: this.position.x + Math.cos(this.direction) * speed,
            y: this.position.y + Math.sin(this.direction) * speed
        };
    }

    move(speed,map) {
        let new_pos = this.get_direction_pos(speed);
        if (map && map[Math.round(new_pos.y)][Math.round(new_pos.x)] !== 0) {
            return;
        }

        this.position = new_pos;
    }

    

    rotate(degrees) {

        const radians = degrees * Math.PI / 180;
        this.direction += radians;
        this.direction %= 2 * Math.PI;
        if (this.direction < 0) this.direction += 2 * Math.PI;
    }

}