var playing = true;
const grid = document.getElementsByClassName('grille')[0]
var gridTop = grid.getBoundingClientRect().top;
var gridBottom = grid.getBoundingClientRect().bottom;
var gridLeft = grid.getBoundingClientRect().left;
var gridRight = grid.getBoundingClientRect().right;
console.log(gridBottom)

//import { Entity } from "./entity.js"
let Entity = class Entity {
  constructor(pos, elt, type, direction) {
    this.elt = elt;
    this.pos = pos;
    this.type = type;
    this.direction = direction;
  }

  move(grid) {
    if (playing || this.type !== "ennemy") {
      grid.removeChild(this.elt)
      if (this.direction === "right") {
        if (this.pos.left < gridRight-50) {
          this.pos.left += ennemySpeed;
          this.elt.style.left = this.pos.left+"px"
        } else {
          this.pos.bottom += 150;
          this.elt.style.top = this.pos.bottom+"px"
          this.direction = "left"
          if (this.pos.bottom > gridBottom) {
            playing = false
            handleModal("open", "Les ennemis sont sortis...")
          }
        }
      }
      if (this.direction === "left") {
        if (this.pos.left > gridLeft+5) {
          this.pos.left -= ennemySpeed;
          this.elt.style.left = this.pos.left+"px"
        } else {
          this.pos.bottom += 150;
          this.elt.style.top = this.pos.bottom+"px"
          this.direction = "right"
          if (this.pos.bottom > gridBottom) {
            playing = false
            handleModal("open", "Les ennemis sont sortis...")
          }
        }
      }
      if (this.direction === "up") {
        if (this.pos.bottom<-50) {
          missiles.shift()
        }
        this.pos.bottom -= missileSpeed;
        this.elt.style.top = this.pos.bottom+"px"
      }
      grid.appendChild(this.elt)
  
    
  }
  }


  checkCollision(elm2) {
    var elm1Rect = this.elt.getBoundingClientRect();
    var elm2Rect = elm2.elt.getBoundingClientRect();
  
    const collision = (elm1Rect.right >= elm2Rect.left &&
        elm1Rect.left <= elm2Rect.right) &&
      (elm1Rect.bottom >= elm2Rect.top &&
        elm1Rect.top <= elm2Rect.bottom);

    if (this.type === "ennemy" && elm2.type === "player" && collision && playing) {
      playing = false
      handleModal("open", "Vous avez perdu contre les ennemis...")
    }
    
    return collision
  }
}

function handleModal(type, msg="") {
  if (type === "close") {
    modal.style.display = "none";
  } else if (type === "open") {
    const endParagraph = document.getElementById('end-message')
    endParagraph.innerHTML = msg
    modal.style.display = "block";

   
  }
  
  
}

var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

function restartGame() {
  ennemies.forEach((ennemy) => {
    grid.removeChild(ennemy.elt)
  })
  ennemies = []
  ennemiesCreated = false

  grid.removeChild(player.elt)
  player = generatePlayer()
  generateEnnemies()
  handleModal("close")

  playing = true
}

const audio = document.getElementById('music')

function generatePlayer() {
  const playerImg = document.createElement('div')
  playerImg.style.top = gridBottom-50+"px";
  playerImg.style.left = (gridRight/2)+50+"px";
  grid.appendChild(playerImg)
  playerImg.setAttribute('class', 'tireur')
  return new Entity({bottom: gridBottom-50, left: (gridRight/2)+50}, playerImg, "player", null)
}
var player = generatePlayer()

var ennemiesCreated = false
function generateEnnemies() {
  var i = 0
  const intervalId = setInterval(() => {
    if (i < ennemiesNumber) {
      ennemyImg = document.createElement('div')
      grid.appendChild(ennemyImg)
      ennemyImg.setAttribute('class', 'alien')
      ennemies.push(new Entity({bottom: gridTop, left: gridLeft}, ennemyImg, "ennemy", "right"))

      ennemyImg = document.createElement('div')
      grid.appendChild(ennemyImg)
      ennemyImg.setAttribute('class', 'alien')
      ennemyImg.style.top = gridTop+50+"px"
      ennemies.push(new Entity({bottom: gridTop+50, left: gridLeft}, ennemyImg, "ennemy", "right"))

      ennemyImg = document.createElement('div')
      grid.appendChild(ennemyImg)
      ennemyImg.setAttribute('class', 'alien')
      ennemyImg.style.top = gridTop+100+"px"
      ennemies.push(new Entity({bottom: gridTop+100, left: gridLeft}, ennemyImg, "ennemy", "right"))

      i++
      ennemiesCreated = true;
    } else {
      clearInterval(intervalId)
    }
  }, 200);
}
generateEnnemies()  

//set speed
const playerSpeed = 30;
const ennemySpeed = playerSpeed/10
const missileSpeed = playerSpeed/3

const missiles = []



//generate ennemies
var ennemies = []
const ennemiesNumber = 10;

//handle player input
document.addEventListener("keydown", (event) => {
  if (playing) {
    grid.removeChild(player.elt);
      if (event.isComposing || event.keyCode === 37) {
        //moving left
        if (player.pos.left > gridLeft+5) {
          player.pos.left -= playerSpeed;
          player.elt.style.left = player.pos.left+"px"
        }  
      }
      if (event.isComposing || event.keyCode === 39) {
        //moving right
        if (player.pos.left < gridRight-50) {
          player.pos.left += playerSpeed;
          player.elt.style.left = player.pos.left+"px"
        }  
      }
      if (event.isComposing || event.keyCode === 40) {
        //moving bottom
        if (player.pos.bottom < gridBottom-50) {
          player.pos.bottom += playerSpeed;
          player.elt.style.top = player.pos.bottom+"px"
        }  
      }
      if (event.isComposing || event.keyCode === 38) {
        //moving top
        if (player.pos.bottom > 0) {
          player.pos.bottom -= playerSpeed;
          player.elt.style.top = player.pos.bottom+"px"     
        }  
      }
      if (event.isComposing || event.keyCode === 32) {
        let missileImg = document.createElement('div')
        grid.appendChild(missileImg)
        missileImg.setAttribute('class', 'laser')
        missileImg.style.left = player.pos.left+22.5+"px"
        missileImg.style.top = player.pos.bottom+"px"
        missiles.push(new Entity({bottom: player.pos.bottom, left: player.pos.left}, missileImg, "missile", "up"))
      }
    grid.appendChild(player.elt)
    }  
});

//handle ennemies movement
setInterval(() => {
  if (ennemies.length === 0 && playing && ennemiesCreated) {
    playing = false
    handleModal("open", "Vous avez gagné contre les ennemis !!")
  }

  ennemies.forEach((elt => {
    elt.checkCollision(player)
    elt.move(grid)
  }))
  
  missiles.forEach((missile => {
    missile.move(grid)
    ennemies.forEach((ennemy => {
      if (missile.checkCollision(ennemy)) {
        let indexMissile = missiles.indexOf(missile)
        missiles.splice(indexMissile, 1)
        grid.removeChild(missile.elt)

        let indexEnnemy = ennemies.indexOf(ennemy)
        ennemies.splice(indexEnnemy, 1)
        grid.removeChild(ennemy.elt)
      }
    }))
  }))
}, 8)




setInterval(() => {
  ennemies.forEach(ennemy => {
    if (player.checkCollision(ennemy)) {
      console.log('Player died!');
      
    }
  });
}, 16);





