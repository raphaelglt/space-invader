let Player = class Player {
  constructor(pos, elt) {
    this.elt = elt
    this.pos = pos;
  }
}

const squares = grid.children;
var gridTop = grid.getBoundingClientRect().top;
var gridBottom = grid.getBoundingClientRect().bottom;
var gridLeft = grid.getBoundingClientRect().left;
var gridRight = grid.getBoundingClientRect().right;

function generatePlayer() {
  const playerImg = document.createElement('div')
  grid.appendChild(playerImg)
  playerImg.setAttribute('class', 'tireur')
  return new Player({bottom: gridBottom-50, left: (gridRight/2)+50}, playerImg)
}
const player = generatePlayer()
player.elt.style.top = player.pos.bottom+"px";
player.elt.style.left = player.pos.left+"px";

console.log(gridTop, gridBottom, gridLeft, gridRight)
const speed = 15;

document.addEventListener("keydown", (event) => {
  if (event.isComposing || event.keyCode === 37) {
    if (player.pos.left > gridLeft+5) {
      grid.removeChild(player.elt);
      player.pos.left -= speed;
      player.elt.style.left = player.pos.left+"px"
      grid.appendChild(player.elt)
    }  
  }
  if (event.isComposing || event.keyCode === 39) {
    if (player.pos.left < gridRight-50) {
      grid.removeChild(player.elt);
      player.pos.left += speed;
      player.elt.style.left = player.pos.left+"px"
      grid.appendChild(player.elt)
    }  
  }
  if (event.isComposing || event.keyCode === 40) {
    if (player.pos < 220) {
      squares[player.pos].removeChild(player.elt);
      squares[player.pos+20].appendChild(player.elt)
      player.pos += speed
    }  
  }
  if (event.isComposing || event.keyCode === 38) {
    if (player.pos > 1) {
      squares[player.pos].removeChild(player.elt);
      squares[player.pos-20].appendChild(player.elt)
      player.pos -= speed
    }  
  }
});