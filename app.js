var playing = true;
const grid = document.getElementsByClassName('grille')[0]
const gridTop = grid.getBoundingClientRect().top;
const gridBottom = grid.getBoundingClientRect().bottom;
const gridLeft = grid.getBoundingClientRect().left;
const gridRight = grid.getBoundingClientRect().right;
//set speed
const playerSpeed = 30;
const ennemySpeed = playerSpeed/10
const missileSpeed = playerSpeed/3

const gamemode = "normal"
const difficulty = 3

const ennemyMissileInterval = null
function intervalManager(flag, animate, time) {
  if(flag)
    intervalID =  setInterval(animate, time);
  else
    clearInterval(intervalID);
}

let Entity = class Entity {
  constructor(pos, elt, type, direction, speed, lifepoints=1) {
    this.elt = elt;
    this.pos = pos;
    this.type = type;
    this.direction = direction
    this.speed = speed
    this.lifepoints = lifepoints
  }

  move(grid) {
    var replace = true;
    if (playing || this.type !== "ennemy") {
      grid.removeChild(this.elt)
      if (this.direction === "right") {
        if (this.pos.left < gridRight-50) {
          this.pos.left += this.speed;
          this.elt.style.left = this.pos.left+"px"
        } else {
          this.pos.bottom += 150;
          this.elt.style.top = this.pos.bottom+"px"
          this.direction = "left"
          if (this.pos.bottom > gridBottom) {
            intervalManager(false)
            playing = false
            handleModal("open", "Les ennemis sont sortis...")
          }
        }
      }
      if (this.direction === "left") {
        if (this.pos.left > gridLeft+5) {
          this.pos.left -= this.speed;
          this.elt.style.left = this.pos.left+"px"
        } else {
          this.pos.bottom += 150;
          this.elt.style.top = this.pos.bottom+"px"
          this.direction = "right"
          if (this.pos.bottom > gridBottom) {
            intervalManager(false)
            playing = false
            handleModal("open", "Les ennemis sont sortis...")
          }
        }
      }
      grid.appendChild(this.elt)
      if (this.direction === "up") {
        if (this.pos.bottom<-100) {
          replace = false
          missiles.shift()
        } else {
          this.pos.bottom -= this.speed;
          this.elt.style.top = this.pos.bottom+"px"
        }
      }
      if (this.direction === "down") {
        if (this.pos.bottom>gridBottom) {
          replace = false
          missilesEnnemy.shift()
        } else {
          this.pos.bottom += this.speed;
          this.elt.style.top = this.pos.bottom+"px"
        }
      }
    }
    grid.appendChild(this.elt)
  }

  checkCollision(elm2) {
    var elm1Rect = this.elt.getBoundingClientRect();
    var elm2Rect = elm2.elt.getBoundingClientRect();
  
    const collision = (elm1Rect.right >= elm2Rect.left &&
        elm1Rect.left <= elm2Rect.right) &&
      (elm1Rect.bottom >= elm2Rect.top &&
        elm1Rect.top <= elm2Rect.bottom);

    if (this.type === "ennemy" && elm2.type === "player" && collision && playing) {
      intervalManager(false)
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
  missilesEnnemy = []
  ennemies = []
  ennemiesCreated = false

  var missileDiv = grid.getElementsByClassName("laser");
  while (missileDiv[0]) {
    grid.removeChild(missileDiv[0]);
  }

  if (player.elt.getAttribute('class') === "tireur") {
    grid.removeChild(player.elt)
  }
  player = generatePlayer()
  generateEnnemies()
  handleModal("close")

  intervalManager(true, sendMissileEnnemy, 2000)
  playing = true
}

const audio = document.getElementById('music')

function generatePlayer() {
  const playerImg = document.createElement('div')
  playerImg.style.top = gridBottom-50+"px";
  playerImg.style.left = (gridRight/2)+50+"px";
  grid.appendChild(playerImg)
  playerImg.setAttribute('class', 'tireur')
  return new Entity({bottom: gridBottom-50, left: (gridRight/2)+50}, playerImg, "player", null, null)
}
var player = generatePlayer()

var ennemiesCreated = false
function generateEnnemies() {
  var i = 0
  const intervalId = setInterval(() => {
    if (i < ennemiesNumber) {
      let className;
      let lifepoints;
      switch (difficulty) {
        case 1:
          className = "alien"
          lifepoints = 1
          break;

        case 2:
          className = "boss"
          lifepoints = 2
          break;

        case 3:
          className = "big-boss"
          lifepoints = 20
          break;

        case 4:
          className = "ultimate-boss"
          lifepoints = 100
          break;
      
        default:
          className = "alien"
          lifepoints = 1
          break;
      }

      ennemyImg = document.createElement('div')
      grid.appendChild(ennemyImg)
      ennemyImg.setAttribute('class', className)
      ennemies.push(new Entity({bottom: gridTop, left: gridLeft}, ennemyImg, "ennemy", "right", ennemySpeed-(difficulty/2), lifepoints))

      if (difficulty === 4) {
        clearInterval(intervalId)
      } 

      if (difficulty <= 2) {
        ennemyImg = document.createElement('div')
        grid.appendChild(ennemyImg)
        ennemyImg.setAttribute('class', className)
        ennemyImg.style.top = gridTop+50+"px"
        ennemies.push(new Entity({bottom: gridTop+50, left: gridLeft}, ennemyImg, "ennemy", "right", ennemySpeed-(difficulty/2), lifepoints))

        ennemyImg = document.createElement('div')
        grid.appendChild(ennemyImg)
        ennemyImg.setAttribute('class', className)
        ennemyImg.style.top = gridTop+100+"px"
        ennemies.push(new Entity({bottom: gridTop+100, left: gridLeft}, ennemyImg, "ennemy", "right", ennemySpeed-(difficulty/2), lifepoints))
      }
      i++
      ennemiesCreated = true;
    } else {
      clearInterval(intervalId)
    }
  }, 200*difficulty*2);
}
generateEnnemies()  

var missilesEnnemy = []
var missiles = []

//generate ennemies
var ennemies = []
const ennemiesNumber = 10;
var map = {}; // You could also use an array

//handle player input
document.addEventListener("keydown", (event) => {
  onkeydown = onkeyup = function(e){
    e = e || event; // to deal with IE
    map[e.keyCode] = e.type == 'keydown';
    if (playing) {
    grid.removeChild(player.elt);
      if (map["37"] === true) {
        //moving left
        if (player.pos.left > gridLeft+5) {
          player.pos.left -= playerSpeed;
          player.elt.style.left = player.pos.left+"px"
        }  
      }
      if (map["39"] === true) {
        //moving right
        if (player.pos.left < gridRight-50) {
          player.pos.left += playerSpeed;
          player.elt.style.left = player.pos.left+"px"
        }  
      }
      if (map["40"] === true) {
        //moving bottom
        if (player.pos.bottom < gridBottom-50) {
          player.pos.bottom += playerSpeed;
          player.elt.style.top = player.pos.bottom+"px"
        }  
      }
      if (map["38"] === true) {
        //moving top
        if (player.pos.bottom > 0) {
          player.pos.bottom -= playerSpeed;
          player.elt.style.top = player.pos.bottom+"px"     
        }  
      }
      if (map["32"] === true) {
        const pewSound = new Audio("./ressources/pew.mp3")
        //pewSound.play()
        let missileImg = document.createElement('div')
        grid.appendChild(missileImg)
        missileImg.setAttribute('class', 'laser')
        missileImg.style.left = player.pos.left+22.5+"px"
        missileImg.style.top = player.pos.bottom+"px"
        missiles.push(new Entity({bottom: player.pos.bottom, left: player.pos.left}, missileImg, "missile", "up", missileSpeed))
      }
    grid.appendChild(player.elt)
  } 
  }
});

function sendMissileEnnemy() {
  const randomEnnemy = Math.floor(Math.random() * ennemies.length)
  if (typeof randomEnnemy !== "undefined") {
    let missileImg = document.createElement('div')
    grid.appendChild(missileImg)
    missileImg.setAttribute('class', 'ennemy-laser')
    missileImg.style.left = ennemies[randomEnnemy].pos.left+22.5+"px"
    missileImg.style.top = ennemies[randomEnnemy].pos.bottom+"px"
    console.log(ennemies[randomEnnemy].pos)
    missileImg.style.top = 0+"px"
    missilesEnnemy.push(new Entity({bottom: ennemies[randomEnnemy].pos.bottom, left: ennemies[randomEnnemy].pos.left}, missileImg, "missile-ennemy", "down", missileSpeed/2))
  }
}
intervalManager(true, sendMissileEnnemy, 2000)

//handle ennemies movement
setInterval(() => {
  if (ennemies.length === 0 && playing && ennemiesCreated) {
    intervalManager(false)
    playing = false
    handleModal("open", "Vous avez gagné contre les ennemis !!")
  }

  ennemies.forEach((elt => {
    elt.checkCollision(player)
    elt.move(grid)
  }))

  missilesEnnemy.forEach((missile) => {
    missile.move(grid)
    if (missile.checkCollision(player) && missile.type === "missile-ennemy") {
      handleModal('open', "Les ennemis vous ont tués")
      intervalManager(false)
      playing = false
      player.elt.setAttribute('class', 'boom')
      setTimeout(() => {
        grid.removeChild(player.elt)
      }, 500)
    }
  })
  
  missiles.forEach((missile => {
    missile.move(grid)
    ennemies.forEach((ennemy => {
      if (missile.checkCollision(ennemy) && missile.type === "missile") {
        const explosionSound = new Audio("./ressources/explosion.mp3")
        //explosionSound.play()

        let indexMissile = missiles.indexOf(missile)
        missiles.splice(indexMissile, 1)
        grid.removeChild(missile.elt)
        
        if (ennemy.lifepoints > 1) {
          ennemy.lifepoints--
        } else {
          ennemy.elt.setAttribute('class', 'boom')
          let indexEnnemy = ennemies.indexOf(ennemy)
          ennemies.splice(indexEnnemy, 1)
          setTimeout(() => {
            grid.removeChild(ennemy.elt)
          }, 500)
        }
      }
    }))
  }))
}, 8)