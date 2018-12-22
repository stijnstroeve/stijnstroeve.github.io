
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static add(v1, v2) {
        v1.x += v2.x;
        v1.y += v2.y;
        return v1;
    }
}

class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    static add(v1, v2) {
        v1.x += v2.x;
        v1.y += v2.y;
        v1.z += v2.z;
        return v1;
    }
}

class Star {
    constructor(x, y) {
        this.location = new Vector2(x, y);
        this.velocity = new Vector2( Math.random() * 2 - 1, Math.random() * 2 -1);
        this.pull = 0.01;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.location.x, this.location.y, 8, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.strokeStyle = "#000000";
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.fill();
    }
    update() {
        let v = Vector2.add(this.location, this.velocity);

        if(v.x > canvas.width) {
            v.x -= canvas.width;
        }
        if(v.y > canvas.height) {
            v.y -= canvas.height;
        }
        if(v.x < 0) {
            v.x += canvas.width;
        }
        if(v.y < 0) {
            v.y += canvas.height;
        }
        this.location = v;
    }
}

class StarField {
    constructor() {
        this.stars = [];
        this.connections = [];
    }
    newStar(x, y) {
        let star = new Star(x,y);
        this.stars.push(star);
    }
    draw() {
        console.log(this.stars.length);
        for(let i = 0; i < this.connections.length; i++) {
            let connection = this.connections[i];

            let alpha = 0;
            if(connection.z < 300) {
                alpha = 1 - (connection.z / 300) ;
            }

            let width = 1;
            if(connection.z < 300) {
                width = 5 - (connection.z / 300);
            }

            ctx.beginPath();
            ctx.lineWidth = width;
            ctx.strokeStyle = "rgba(0,0,0,"+alpha+")";
            ctx.moveTo(connection.x.x, connection.x.y);
            ctx.lineTo(connection.y.x, connection.y.y);
            ctx.stroke();
        }

        for(let i = 0; i < this.stars.length; i++) {
            this.stars[i].draw();
        }
    }
    update() {
        for(let i = 0; i < this.stars.length; i++) {
            this.stars[i].update();
        }
        this.calcConnections();
    }
    calcConnections() {
        this.connections = [];

        let radius = 300;
        for(let i = 0; i < this.stars.length; i++) {

            for(let z = 0; z < this.stars.length; z++) {
                let location1 = this.stars[i].location;
                let location2 = this.stars[z].location;
                let dX = location1.x - location2.x;
                let dY = location1.y - location2.y;

                let d1 = location2.x - location1.x;
                let d2 = location2.y - location1.y;
                let distance = Math.sqrt(d1 * d1 + d2 * d2);

                if(dX <= radius && dX > -radius && dY <= radius && dY > -radius) {
                    this.connections.push(new Vector3(location1, location2, distance));
                }
            }
        }
    }
}

const field = new StarField();

const loop = () => {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    field.update();
    field.draw();

    window.requestAnimationFrame(loop);
};

const startCanvas = () => {

    for(let i = 0; i < 50; i++) {
        let x = Math.floor(Math.random() * canvas.width);
        let y = Math.floor(Math.random() * canvas.height);
        field.newStar(x, y);
    }
    field.update();
    field.draw();

    window.requestAnimationFrame(loop);
};

document.addEventListener("DOMContentLoaded", function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    startCanvas();
});