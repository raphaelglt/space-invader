const grid = document.getElementsByClassName('grille')[0]
for (let i = 0; i<12; i++) {
  const startDiv = document.createElement('div');
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
  console.log(squares[200])
}
generatePlayer() 