// CANVAS JS
const canvas = document.querySelector('canvas');

canvas.width = innerWidth;
canvas.height = innerHeight;

// CONTEXT ON CANVAS
const c = canvas.getContext('2d');

// PLAYER CLASS
class Player {

    // PLAYER PROPRETIES
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }  

    // DRAW PLAYER
    draw() {
        c.beginPath();
        c.arc(
            this.x, 
            this.y, 
            this.radius, 
            0, 
            Math.PI * 2, 
            false
        );
        c.fillStyle = this.color;
        c.fill()
    }    
}

//SELECTING MIDDLE
const x = canvas.width / 2;
const y = canvas.height / 2;

//CREATING PLAYER
const player = new Player(x,y,50, 'crimson');
player.draw()

// SHOOTING THINGYS
class Projectile {

    //PROJECTILE PROPRETIES
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    //DRAW PROJECTILE
    draw() {
        c.beginPath();
        c.arc(
            this.x, 
            this.y, 
            this.radius, 
            0, 
            Math.PI * 2, 
            false
        );
        c.fillStyle = this.color;
        c.fill()
    }   
}

//ACTIVATING PROJECTILES
window.addEventListener('click', ()=>{
    console.log('go');
})