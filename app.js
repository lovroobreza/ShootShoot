// CANVAS get and set
const canvas = document.querySelector('canvas');

canvas.width = innerWidth;
canvas.height = innerHeight;

// CANVAS context
const c = canvas.getContext('2d');

// PLAYER class
class Player {

    // PLAYER properties
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }  

    // PLAYER draw
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

// SHOOTING THINGYS OR PROJECTILES
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

    // UPDATE
    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}
 

// ENEMY class
class Enemy {

    //PROJECTILE properties
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    //PROJECTILE draw
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

    //PROJECTILE update
    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

//PARTICLES class
const friction = 0.98;
class Particle {

    //PARTICLE properties
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        // set opacity
        this.alpha = 1
    }

    //DRAW PROJECTILE
    draw() {
        c.save()
        c.globalAlpha = this.alpha
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
        c.restore()
    }   

    // UPDATE
    update() {
        this.draw()
        // slow down partiles with friction
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        // particle opacity goes to 0
        this.alpha -= 0.02
    }
}

// selecting center of screen
const x = canvas.width / 2;
const y = canvas.height / 2;

//CREATING PLAYER, PROJECTILE, ENEMY and PARTICLES
let player = new Player(x, y, 30, 'crimson');
let projectiles = []
let enemies = []
let particles = []

// Track score
let scoreValue = 0

// DOM elements for interface
const button = document.querySelector('#button')
const again = document.querySelector('#again')

// Update the score in game and when you die
let score = document.querySelector('#score')
let againScore = document.querySelector('#again-score')

//SPAWN RANDOM ENEMIES
function spawnEnemies() {
        //random radius of enemy
        const radius = Math.floor(Math.random() * (40)) + 20            
        
        //spawn enemies from random sides
        let x 
        let y 

        if(Math.random() <0.5){
             x = Math.random() < 0.5 ? 0 -radius : canvas.width + radius 
             y = Math.random() * canvas.height  
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 -radius : canvas.height + radius
        }
        
        // random hsl value for enemy color
        const color = `hsl(${Math.random()*360}, 50%, 50%)`

        // calculating velocity for smooth movement
        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
        const velocity = {
            x: Math.cos(angle) * 2.5,
            y: Math.sin(angle) * 2.5
        }
    
        enemies.push(new Enemy(
            x, y, radius, color, velocity    
        ))

}


// ANIMATION LOOP
let animationId
function animate() {
    animationId = requestAnimationFrame(animate)
    c.fillStyle = 'rgba(0,0,0,0.2)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.draw()

    // removing particles when opacity is 0
    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1)
        }
        particle.update()
    })

    // deleting projectiles
    projectiles.forEach((projectile, index) => {
        projectile.update()
        
        // removing projectiles when leaving screen
        if (projectile.x + projectile.radius < 0 || 
            projectile.x - projectile.radius > canvas.width || 
            projectile.y + projectile.radius <0 || 
            projectile.y - projectile.radius > canvas.height) 
        {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0);
        }
    })

    enemies.forEach((enemy, index) => {
        enemy.update()

        // distance between player and enemy with pyhatgorous theroeum
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        
        // when enemy and player touch => stop and shot end-game
        if (dist -enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId)
            again.style.display = 'flex'
            enemies = []
        }
        
        projectiles.forEach((projectile, projectileIndex) =>{
        // distance between enemy and projectile
           const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

            if (dist -enemy.radius - projectile.radius < 1) {
                //spawn 8 particles when you hit enemy and where you hit him
                for (let i = 0; i <= 7; i++) {
                    particles.push(
                        new Particle(
                            enemy.x, 
                            enemy.y, 
                            Math.floor(Math.random()* 4 +2), 
                            enemy.color, 
                            {
                            x: (Math.random() -0.5) * (Math.random()*7), 
                            y: (Math.random() -0.5) * (Math.random()*7)
                        }) )                    
                }

                //depending on radius reduce enemies when hit - gsap animation
                if (enemy.radius -10 > 40){                    
                    gsap.to(enemy, {
                        radius:enemy.radius -10
                    })

                    setTimeout(() => {
                        projectiles.splice(projectileIndex,1)        
                    }, 0);
                } else{
                    // increase in-game and end-game score for killed enemy by its radius
                    scoreValue += Math.floor(enemy.radius)
                    score.innerHTML = scoreValue
                    againScore.innerHTML = scoreValue

                    setTimeout(() => {
                        enemies.splice(index,1)
                        projectiles.splice(projectileIndex,1)        
                    }, 0);
                }
                }
        })
    })
}


// shoot projectiles on click towards click
window.addEventListener('click', (e) => {

    // getting angle of the click and calculating the velocity to move smoothly
    const angle = Math.atan2(e.clientY - canvas.height / 2 , e.clientX - canvas.width / 2)

    const velocity = {
        x: Math.cos(angle) * 7,
        y: Math.sin(angle) * 7
    }

    projectiles.push(new Projectile(
        x, y, 5, 'crimson', velocity 
        ))
    })

    //Init function when reseting the game/playing again - it resets canvas
function init() {
    player = new Player(x,y, 30, 'crimson');
    projectiles = []
    enemies = []
    particles = []
    scoreValue = 0
    againScore.innerHTML = 0
    score.innerHTML = 0
}


//START GAME EVENT LISTENER
button.addEventListener('click', () => {
    init()
    animate()
    setInterval(() => {
        spawnEnemies()    
    }, 1000);
    
    again.style.display = 'none'
})