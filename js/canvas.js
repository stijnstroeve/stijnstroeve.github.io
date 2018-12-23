
const text = document.getElementById("title-text");
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

        let x = this.location.x;
        let y = this.location.y;

        for(let i = 0; i < field.spaces.length; i++) {
            let space = field.spaces[i];

            let x1 = space.loc1.x;
            let y1 = space.loc1.y;

            let x2 = space.loc2.x;
            let y2 = space.loc2.y;

            if(x >= x1 && x <= x2) {
                if(y >= y1 && y <= y2) {
                    let vertical = false;
                    if(x -1 <= x1 || x+1 >= x2) {
                        vertical = true;
                    }
                    let xF = this.velocity.x < 0 ? Math.abs(this.velocity.x) : -this.velocity.x;
                    let yF = this.velocity.y < 0 ? Math.abs(this.velocity.y) : -this.velocity.y;
                    this.velocity = new Vector2(vertical ? xF : -xF, vertical ? -yF : yF);
                }
            }
        }
    }
}

class FreeSpace {
    constructor(loc1, loc2) {
        this.loc1 = loc1;
        this.loc2 = loc2;
    }
}

class StarField {
    constructor() {
        this.stars = [];
        this.spaces = [];
        this.connections = [];
    }
    newStar(x, y) {
        let star = new Star(x,y);
        this.stars.push(star);
    }
    draw() {
        let radius = (canvas.width + canvas.height) / 10;
        for(let i = 0; i < this.connections.length; i++) {
            let connection = this.connections[i];

            let alpha = 0;
            if(connection.z < radius) {
                alpha = 1 - (connection.z / radius) ;
            }

            let width = 1;
            if(connection.z < radius) {
                width = 5 - (connection.z / radius);
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

        let radius = (canvas.width + canvas.height) / 10;
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
    field.spaces.push(new FreeSpace(new Vector2(canvas.width / 2 - (text.offsetWidth / 2), canvas.height / 2 - (text.offsetHeight / 2)), new Vector2(canvas.width / 2 + (text.offsetWidth / 2),canvas.height / 2 + (text.offsetHeight / 2))));
    let amount = (canvas.width + canvas.height) / 75;
    for(let i = 0; i < amount; i++) {
        let coords = genCoords();
        field.newStar(coords.x, coords.y);
    }
    field.update();
    field.draw();

    window.requestAnimationFrame(loop);
};

const genCoords = () => {

    let x = Math.floor(Math.random() * canvas.width);
    let y = Math.floor(Math.random() * canvas.height);
    let toReturn = new Vector2(x, y);

    for(let i = 0; i < field.spaces.length; i++) {
        let space = field.spaces[i];

        let x1 = space.loc1.x;
        let y1 = space.loc1.y;

        let x2 = space.loc2.x;
        let y2 = space.loc2.y;

        if(x >= x1 && x <= x2) {
            if(y >= y1 && y <= y2) {
                toReturn = genCoords();
            }
        }
    }

    return toReturn;
};

const turnAll = () => {
    for(let i = 0; i < field.stars.length; i++) {
        let star = field.stars[i];
        let x = star.velocity.x < 0 ? Math.abs(star.velocity.x) : -star.velocity.x;
        let y = star.velocity.y < 0 ? Math.abs(star.velocity.y) : -star.velocity.y;
        star.velocity = new Vector2(x,y);
    }
};

document.addEventListener("DOMContentLoaded", function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    startCanvas();
});