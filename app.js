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