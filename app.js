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

//SELECTING MIDDLE
const x = canvas.width / 2;
const y = canvas.height / 2;

//CREATING PLAYER, PROJECTILE, ENEMY
const player = new Player(x,y, 30, 'crimson');
const projectiles = []
const enemies =  []

//SPAWN RANDOM ENEMIES
function spawnEnemies(){
    setInterval(() => {
        const radius = Math.random() * (60-15) + 15            
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
            x: Math.cos(angle) *3,
            y: Math.sin(angle)*3
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
        if (dist -enemy.radius - player.radius < 0.5) {
            cancelAnimationFrame(animationId)
        }
        
        projectiles.forEach((projectile, projectileIndex) =>{
            //DISTANCE BETWEEN PROJECTILE AND ENEMY
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

            if (dist -enemy.radius - projectile.radius < 1) {
                if (enemy.radius -10 > 30) {
                    enemy.radius -= 15
                    setTimeout(() => {
                        projectiles.splice(projectileIndex,1)        
                    }, 0);
                } else{
                    setTimeout(() => {
                        enemies.splice(index,1)
                        projectiles.splice(projectileIndex,1)        
                    }, 0);
                }
                }
        })


    })
}

animate()
spawnEnemies()

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
