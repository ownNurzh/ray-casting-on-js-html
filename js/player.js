export class Player {
    constructor() {
        this.position = {x: 1, y: 1};
        this.pov = 60;
        this.direction = 0;
    }


    get_direction_pos(speed) {
        return {
            x: this.position.x + Math.cos(this.direction) * speed,
            y: this.position.y + Math.sin(this.direction) * speed
        };
    }

    move(speed) {
        let new_pos = this.get_direction_pos(speed);
        this.position.x = new_pos.x;
        this.position.y = new_pos.y;
    }

    

    rotate(degrees) {
        //player.rotate(1);  поворот вправо на 1°
        //player.rotate(-1); поворот влево на 1°
        const radians = degrees * Math.PI / 180;
        this.direction += radians;
        this.direction %= 2 * Math.PI;
        if (this.direction < 0) this.direction += 2 * Math.PI;
    }

}