let Player = class Player {
  constructor(pos, elt) {
    this.elt = elt
    this.pos = pos;
  }
}

const grid = document.getElementsByClassName('grille')[0]
for (let i = 0; i<12; i++) {
  const startDiv = document.createElement('div');
  startDiv.setAttribute('start', true);
  grid.appendChild(startDiv)
  for (let j = 0; j<18; j++) {
    const newDiv = document.createElement('div');
    grid.appendChild(newDiv)
  }
  const endDiv = document.createElement('div');
  endDiv.setAttribute('end', true);
  grid.appendChild(endDiv)
}

const squares = grid.children;

function generatePlayer() {
  const playerImg = document.createElement('img')
  playerImg.setAttribute('src', './ressources/vaisseau.png')
  playerImg.setAttribute('height', '100%')
  playerImg.setAttribute('width', '100%')
  playerImg.setAttribute('style', 'transform: rotate(180deg)')
  squares[229].appendChild(playerImg)
  return new Player(229, playerImg)
}
const player = generatePlayer()

console.log(squares.length)

document.addEventListener("keydown", (event) => {
  if (event.isComposing || event.keyCode === 37) {
    if (player.elt.parentNode.getAttribute('start') != "true") {
      squares[player.pos].removeChild(player.elt);
      squares[player.pos-1].appendChild(player.elt)
      player.pos -= 1
    }  
  }
  if (event.isComposing || event.keyCode === 39) {
    if (player.elt.parentNode.getAttribute('end') != "true") {
      squares[player.pos].removeChild(player.elt);
      squares[player.pos+1].appendChild(player.elt)
      player.pos += 1
    }  
  }
  if (event.isComposing || event.keyCode === 40) {
    if (player.pos < 220) {
      squares[player.pos].removeChild(player.elt);
      squares[player.pos+20].appendChild(player.elt)
      player.pos += 20
    }  
  }
  if (event.isComposing || event.keyCode === 38) {
    if (player.pos > 19) {
      squares[player.pos].removeChild(player.elt);
      squares[player.pos-20].appendChild(player.elt)
      player.pos -= 20
    }  
  }
});
