var playing = true;
const grid = document.getElementsByClassName('grille')[0]
const gridTop = grid.getBoundingClientRect().top;
const gridBottom = grid.getBoundingClientRect().bottom;
const gridLeft = grid.getBoundingClientRect().left;
const gridRight = grid.getBoundingClientRect().right;
//set speed
var count_score=0;
const playerSpeed = 30;
const ennemySpeed = playerSpeed/10
const missileSpeed = playerSpeed/3

const gamemode = "normal"
var difficulty = 1

if (sessionStorage.getItem("level")) {
  difficulty = parseInt(sessionStorage.getItem("level"))
}

const pseudoElt = document.getElementById('pseudo')
pseudoElt.innerHTML = sessionStorage.getItem('pseudo')

const mainTheme = new Audio("./ressources/main_theme.mp3")
mainTheme.volume = 0.1
mainTheme.play()

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
    if (elm2) {
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
    } else {
      return false
    }  
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
  location.reload()
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
if (sessionStorage.getItem('player_number') === "2") var player2 = generatePlayer()

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

//generation des ennemis, des missiles, de la map,etc...
generateEnnemies()  

var missilesEnnemy = []
var missiles = []

//generate ennemies
var ennemies = []
const ennemiesNumber = 10;
var map = {}; // You could also use an array

//deplacement du joueur 2 par rapport aux touces presser
//handle player input
document.addEventListener("keydown", (event) => {
  onkeydown = onkeyup = function(e){
    e = e || event; // to deal with IE
    map[e.keyCode] = e.type == 'keydown';
    if (playing) {
    grid.removeChild(player.elt);
      if (map["90"] === true && player2) {
        //moving top
        if (player2.pos.bottom > 0) {
          player2.pos.bottom -= playerSpeed;
          player2.elt.style.top = player2.pos.bottom+"px"     
        }  
      }
      if (map["81"] === true && player2) {
        //moving left
        if (player2.pos.left > gridLeft+5) {
          player2.pos.left -= playerSpeed;
          player2.elt.style.left = player2.pos.left+"px"
        }  
      }
      if (map["68"] === true && player2) {
        //moving right
        if (player2.pos.left < gridRight-50) {
          player2.pos.left += playerSpeed;
          player2.elt.style.left = player2.pos.left+"px"
        }  
      }
      if (map["83"] === true && player2) {
        //moving bottom
        if (player2.pos.bottom < gridBottom-50) {
          player2.pos.bottom += playerSpeed;
          player2.elt.style.top = player2.pos.bottom+"px"
        }  
      }
      //apparition du missile sur la position du joueur 2 avant d'etre tiré
      if (map["16"] === true) {
        const pewSound = new Audio("./ressources/pew.mp3")
        pewSound.volume = 0.3
        pewSound.play()
        let missileImg = document.createElement('div')
        grid.appendChild(missileImg)
        missileImg.setAttribute('class', 'laser')
        missileImg.style.left = player2.pos.left+22.5+"px"
        missileImg.style.top = player2.pos.bottom+"px"
        missiles.push(new Entity({bottom: player2.pos.bottom, left: player2.pos.left}, missileImg, "missile", "up", missileSpeed))
      }

      //changement de position du joueur 1 par rapport a la touche presser
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
      //apparition du missile sur la position du joueur 1 avant d'etre tiré
      if (map["32"] === true) {
        const pewSound = new Audio("./ressources/pew.mp3")
        pewSound.volume = 0.3
        pewSound.play()
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

//fonction des ennemis envoyant des missiles contre le ou les joueurs
function sendMissileEnnemy() {
  if (ennemies.length > 0) {
    const randomEnnemy = Math.floor(Math.random() * ennemies.length)
    if (typeof randomEnnemy !== "undefined") {
      let missileImg = document.createElement('div')
      grid.appendChild(missileImg)
      missileImg.setAttribute('class', 'ennemy-laser')
      const widthMissile = parseInt(getComputedStyle(ennemies[randomEnnemy].elt).width.slice(0, -2))
      const randomPlace = Math.floor(Math.random() * widthMissile)
      missileImg.style.left = ennemies[randomEnnemy].pos.left+randomPlace+"px"
      missileImg.style.top = ennemies[randomEnnemy].pos.bottom+"px"
      missileImg.style.top = 0+"px"
      missilesEnnemy.push(new Entity({bottom: ennemies[randomEnnemy].pos.bottom, left: ennemies[randomEnnemy].pos.left+randomPlace}, missileImg, "missile-ennemy", "down", missileSpeed/2))
    }
  }  
}
intervalManager(true, sendMissileEnnemy, 1000/difficulty)

//message de victoire quand tout les ennemis sont morts
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

  //message de defete quand un missile ennemis vous a tuer 
  missilesEnnemy.forEach((missile) => {
    missile.move(grid)
    if ((missile.checkCollision(player) || missile.checkCollision(player2)) && missile.type === "missile-ennemy") {
      handleModal('open', "Les ennemis vous ont tués")
      intervalManager(false)
      playing = false
      player.elt.setAttribute('class', 'boom')
      setTimeout(() => {
        if (missile.checkCollision(player2)) grid.removeChild(player2.elt)
        if (missile.checkCollision(player)) grid.removeChild(player.elt)
      }, 500)
    }
  })
  
  //gestion des colision entre les missile joueur et les ennemis pour faire disparaitre les vaisseaux ennemis
  missiles.forEach((missile => {
    missile.move(grid)
    ennemies.forEach((ennemy => {
      if (missile.checkCollision(ennemy) && missile.type === "missile") {
        const explosionSound = new Audio("./ressources/explosion.mp3")
        explosionSound.volume = 0.2
        explosionSound.play()

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
        //compteur du score incrementation et enregistrement dans un localstorage
        count_score++;
        sessionStorage.setItem("ScorePlayer", count_score*difficulty*2);

        var scorevaleur=count_score*difficulty*2;
        var hscorevaleur=sessionStorage.getItem("hScore");
        if(scorevaleur>hscorevaleur){
          sessionStorage.setItem("hScore", scorevaleur);
        }
      }
    }))
  }))
}, 8)

//affichage des scores et des high score

setInterval(function () {
  // Récupérez les données du stockage local
  var storedValuehscore = sessionStorage.getItem("hScore");

  // Sélectionnez la balise de texte HTML à laquelle vous souhaitez affecter la valeur
  var textElementhscore = document.getElementById("affichageHighScore");

  // Affectez la valeur au contenu de la balise de texte HTML
  textElementhscore.textContent = storedValuehscore;
  
}, 10 );

setInterval(function () {
  // Récupérez les données du stockage local
  var storedValue = sessionStorage.getItem("ScorePlayer");

  // Sélectionnez la balise de texte HTML à laquelle vous souhaitez affecter la valeur
  var textElement = document.getElementById("affichageScore");

  // Affectez la valeur au contenu de la balise de texte HTML
  textElement.textContent = storedValue;

}, 10 );