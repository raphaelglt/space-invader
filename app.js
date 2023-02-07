//import { Entity } from "./entity.js"
let Entity = class Entity {
  constructor(pos, elt, type, direction) {
    this.elt = elt;
    this.pos = pos;
    this.type = type;
    this.direction = direction
  }

  move(grid) {
    grid.removeChild(this.elt)
    if (this.direction === "right") {
      if (this.pos.left < gridRight-50) {
        this.pos.left += speed;
        this.elt.style.left = this.pos.left+"px"
      } else {
        this.pos.bottom += speed*3;
        this.elt.style.top = this.pos.bottom+"px"
        this.direction = "left"
      }
    }
    if (this.direction === "left") {
      if (this.pos.left > gridLeft+5) {
        this.pos.left -= speed;
        this.elt.style.left = this.pos.left+"px"
      } else {
        this.pos.bottom += speed*3;
        this.elt.style.top = this.pos.bottom+"px"
        this.direction = "right"
      }
    }
    if (this.direction === "up") {
      if (this.pos.bottom<0) {
        missiles.shift()
      }
      this.pos.bottom -= speed;
      this.elt.style.top = this.pos.bottom+"px"
    }
    grid.appendChild(this.elt)
  }
}

const grid = document.getElementsByClassName('grille')[0]
const audio = document.getElementById('music')

var gridTop = grid.getBoundingClientRect().top;
var gridBottom = grid.getBoundingClientRect().bottom;
var gridLeft = grid.getBoundingClientRect().left;
var gridRight = grid.getBoundingClientRect().right;

function generatePlayer() {
  const playerImg = document.createElement('div')
  grid.appendChild(playerImg)
  playerImg.setAttribute('class', 'tireur')
  return new Entity({bottom: gridBottom-50, left: (gridRight/2)+50}, playerImg, "player", null)
}
const player = generatePlayer()
player.elt.style.top = player.pos.bottom+"px";
player.elt.style.left = player.pos.left+"px";

const speed = 30;
const missiles = []

//handle player input
document.addEventListener("keydown", (event) => {
  grid.removeChild(player.elt);
    if (event.isComposing || event.keyCode === 37) {
      if (player.pos.left > gridLeft+5) {
        player.pos.left -= speed;
        player.elt.style.left = player.pos.left+"px"
      }  
    }
    if (event.isComposing || event.keyCode === 39) {
      if (player.pos.left < gridRight-50) {
        player.pos.left += speed;
        player.elt.style.left = player.pos.left+"px"
      }  
    }
    if (event.isComposing || event.keyCode === 40) {
      if (player.pos.bottom < gridBottom-50) {
        player.pos.bottom += speed;
        player.elt.style.top = player.pos.bottom+"px"
      }  
    }
    if (event.isComposing || event.keyCode === 38) {
      if (player.pos.bottom > 0) {
        player.pos.bottom -= speed;
        player.elt.style.top = player.pos.bottom+"px"     
      }  
    }
    if (event.isComposing || event.keyCode === 32) {
      let missileImg = document.createElement('div')
      grid.appendChild(missileImg)
      missileImg.setAttribute('class', 'laser')
      missileImg.style.left = player.pos.left+22.5+"px"
      missiles.push(new Entity({bottom: player.pos.bottom, left: player.pos.left}, missileImg, "missile", "up"))
    }
  grid.appendChild(player.elt)
});

//generate ennemies
const ennemies = []
const ennemiesNumber = 10;
var i = 0
setInterval(() => {
  if (i < ennemiesNumber) {
    ennemyImg = document.createElement('div')
    grid.appendChild(ennemyImg)
    ennemyImg.setAttribute('class', 'alien')
    ennemies.push(new Entity({bottom: gridTop, left: gridLeft}, ennemyImg, "ennemy", "right"))

    ennemyImg = document.createElement('div')
    grid.appendChild(ennemyImg)
    ennemyImg.setAttribute('class', 'alien')
    ennemies.push(new Entity({bottom: gridTop+50, left: gridLeft}, ennemyImg, "ennemy", "right"))

    ennemyImg = document.createElement('div')
    grid.appendChild(ennemyImg)
    ennemyImg.setAttribute('class', 'alien')
    ennemies.push(new Entity({bottom: gridTop+100, left: gridLeft}, ennemyImg, "ennemy", "right"))
  }
  i++  
}, 200);

//handle ennemies movement
setInterval(() => {
  ennemies.forEach((elt => {
    elt.move(grid)
  }))
  
  missiles.forEach((elt => {
    elt.move(grid)
  }))
}, 100)