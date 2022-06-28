

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let scoreEl =document.querySelector('#scoreEl')
let startGame = document.querySelector('#startGame')
let modelEl = document.querySelector('#modelEl')
let bigScore = document.querySelector('#bigScore')

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

x = canvas.width / 2;
y = canvas.height / 2;

let player = new Player(x, y, 10, "white");
// player.draw()
class Projectile extends Player {
  constructor(x, y, radius, color, velocity) {
    super(x, y, radius, color);
    this.velocity = velocity;
  }
  
  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

let projectiles = [];
let enemies = [];

class Enemy extends Projectile {}

function spawnEnemies() {
  setInterval(() => {
    let radius = Math.random() * (30 - 4) + 9;
    let x;
    let y;
    if (Math.random() < 0.5) {
      x = Math.random() > 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() > 0.5 ? 0 - radius : canvas.width + radius;
    }

    let color = `hsl(${Math.random() * 360},50%,50%)`;
    const angel = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const velocity = {
      x: Math.cos(angel),
      y: Math.sin(angel),
    };
    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 1000);
}

let animationId;
let score=0

function animate() {
  animationId = requestAnimationFrame(animate);
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();
  projectiles.forEach((projectile, projectileIndex) => {
    projectile.update();
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(projectileIndex, 1); 
      }, 0);
    }
  });
  enemies.forEach((enemy, i) => {
    enemy.update();
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    //end game
    if (dist - enemy.radius - player.radius < 1) {
      console.log(dist);
      cancelAnimationFrame(animationId);
      modelEl.style.display='flex'
      bigScore.innerHTML=score
  
    }
    projectiles.forEach((projectile, index) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
      // projectiles touch enemy
      if (dist - enemy.radius - projectile.radius < 1) {
           
        if (enemy.radius - 10 > 10) {
          score +=100
           scoreEl.innerHTML=score
          gsap.to(enemy, { radius: enemy.radius - 10});
          setTimeout(() => {
            projectiles.splice(index, 1);
          }, 0);
        } 
        else {
          score +=250
           scoreEl.innerHTML=score
          // setTimeout(() => {
            enemies.splice(i,1);
            projectiles.splice(index,1);
          // }, 0);
        }
      }
    });
  });
}

function init() {
  player = new Player(x, y, 10, "white");
   projectiles = []
   enemies = []
   score = 0
   scoreEl.innerHTML=score
   bigScore.innerHTML=scoreEl


}

addEventListener("click", (event) => {
  const angel = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  );
  const velocity = {
    x: Math.cos(angel) * 8,
    y: Math.sin(angel) * 8,
  };
  projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 5, "white", velocity));
});
//start new game
startGame.addEventListener('click',()=>{
init()
animate();
spawnEnemies();
modelEl.style.display='none'
})

