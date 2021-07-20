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
 

// SHOOT THE BASTARDS - ENEMIES
class Enemy {

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

//PARTICLESSS
const friction = 0.99;
class Particle {

    //PARTICLE PROPRETIES
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
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
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01
    }
}

//SELECTING MIDDLE
const x = canvas.width / 2;
const y = canvas.height / 2;

//CREATING PLAYER, PROJECTILE, ENEMY
let player = new Player(x,y, 30, 'crimson');
let projectiles = []
let enemies =  []
let particles =[]

let scoreValue = 0

//FOR THE END
const button = document.querySelector('#button')
const again = document.querySelector('#again')
let againScore = document.querySelector('#again-score')

//UPDATE THE SCORE
let score = document.querySelector('#score')

//INIT FUNCTION
function init() {
    player = new Player(x,y, 30, 'crimson');
    projectiles = []
    enemies =  []
    particles =[]
    scoreValue = 0
    againScore.innerHTML = 0
    score.innerHTML = 0
}

//SPAWN RANDOM ENEMIES
function spawnEnemies(){
    setInterval(() => {
        const radius = Math.floor(Math.random() * (60-15)) + 15            
        
        let x 
        let y 

        if(Math.random() <0.5){
             x = Math.random() < 0.5 ? 0 -radius : canvas.width + radius 
             y = Math.random() * canvas.height  
        } else {
                x = Math.random() * canvas.width
                y = Math.random() < 0.5 ? 0 -radius : canvas.height + radius
        }

        const color = `hsl(${Math.random()*360}, 50%, 50%)`

        const angle = Math.atan2(canvas.height / 2 -y, canvas.width / 2 -x)
        const velocity = {
            x: Math.cos(angle) *2,
            y: Math.sin(angle)*2
        }
    
        enemies.push(new Enemy(
            x, y, radius, color, velocity    
        ))
    }, 1000 );
}


// ANIMATION LOOP
let animationId
function animate() {
    animationId = requestAnimationFrame(animate)
    c.fillStyle = 'rgba(0,0,0,0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.draw()

    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1)
        }
        particle.update()
    })

    projectiles.forEach((projectile, index) => {
        projectile.update()
        
        //REMOVING FROM GAME WHEN LEAVING SCREEN
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

        //DISTANCE BETWEEN PROJECTILE AND PLAYER
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        if (dist -enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId)
            again.style.display = 'flex'
        }
        
        projectiles.forEach((projectile, projectileIndex) =>{
            //DISTANCE BETWEEN PROJECTILE AND ENEMY
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

            if (dist -enemy.radius - projectile.radius < 1) {
                
               
                //EXSPLOSIONSSSSS
                for (let i = 0; i < 7; i++) {
                    particles.push(
                        new Particle(
                            projectile.x, 
                            projectile.y, 
                            Math.floor(Math.random()* 4 +2), 
                            enemy.color, 
                            {
                            x: (Math.random() -0.5) * (Math.random()*7), 
                            y: (Math.random() -0.5) * (Math.random()*7)
                        }) )                    
                }

                if (enemy.radius -10 > 35){                    
                    
                    gsap.to(enemy, {
                        radius:enemy.radius -10
                    })

                    setTimeout(() => {
                        projectiles.splice(projectileIndex,1)        
                    }, 0);
                } else{
                    //increase score
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


//ACTIVATING PROJECTILES
window.addEventListener('click', (e) => {

    //GET THE ANGLE (TRIGONOMETRY = ATAN2; X AND Y VELOCITY)
const angle = Math.atan2(e.clientY - canvas.height / 2 , e.clientX - canvas.width / 2)

const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5
}

projectiles.push(new Projectile(
    x, y, 5, 'crimson', velocity 
    ))
})


//START GAME EVENT LISTENER
button.addEventListener('click', () => {
    init()
    animate()
    spawnEnemies()
    again.style.display = 'none'
})