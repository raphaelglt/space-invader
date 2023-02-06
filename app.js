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


    var vaisseau = document.getElementById("ennemi");
    var vaisseauLeft = vaisseau.offsetLeft;
    var vaisseauTop = vaisseau.offsetTop;
    var direction = 1;

    // Boucle de mouvement
    setInterval(function() {
        const style = getComputedStyle(grid);
      vaisseauLeft += 10 * direction;
      console.log("console : "+style.width)
      if (vaisseauLeft >= window.innerWidth - 20 || vaisseauLeft <= 0) {
        direction *= -1;
        vaisseauTop += 20;
      }
      vaisseau.style.left = vaisseauLeft + "px";
      vaisseau.style.top = vaisseauTop + "px";
    }, 100);


   