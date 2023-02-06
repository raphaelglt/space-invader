let Entity = class Entity {
  constructor(pos, elt, type, direction) {
    this.elt = elt;
    this.pos = pos;
    this.type = type;
    this.direction = direction
  }
}

const grid = document.getElementsByClassName('grille')[0]

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

console.log(gridTop, gridBottom, gridLeft, gridRight)
const speed = 30;

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
  grid.appendChild(player.elt)
});

let ennemyImg = document.createElement('div')
grid.appendChild(ennemyImg)
ennemyImg.setAttribute('class', 'alien')
ennemy = new Entity({bottom: gridTop, left: gridLeft}, ennemyImg, "ennemy", "right")

ennemyImg = document.createElement('div')
grid.appendChild(ennemyImg)
ennemyImg.setAttribute('class', 'alien')
ennemy = new Entity({bottom: gridTop, left: gridLeft}, ennemyImg, "ennemy", "right")

setInterval(() => {
  grid.removeChild(ennemy.elt)
  console.log(ennemy.direction)
  if (ennemy.direction === "right") {
    if (ennemy.pos.left < gridRight-50) {
      ennemy.pos.left += speed;
      ennemy.elt.style.left = ennemy.pos.left+"px"
    } else {
      ennemy.pos.bottom += speed*3;
      ennemy.elt.style.top = ennemy.pos.bottom+"px"
      ennemy.direction = "left"
    }
  }
  if (ennemy.direction === "left") {
    if (ennemy.pos.left > gridLeft+5) {
      ennemy.pos.left -= speed;
      ennemy.elt.style.left = ennemy.pos.left+"px"
    } else {
      ennemy.pos.bottom += speed*3;
      ennemy.elt.style.top = ennemy.pos.bottom+"px"
      ennemy.direction = "right"
    }
  }
  grid.appendChild(ennemy.elt)
  
}, 100)