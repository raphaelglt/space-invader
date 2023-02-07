export let Entity = class Entity {

  
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
    grid.appendChild(this.elt)

    
  player.forEach(enemy => {
    let distance = Math.sqrt(Math.pow(this.pos.left - enemy.pos.left, 2) + Math.pow(this.pos.bottom - enemy.pos.bottom, 2));
    if (distance < 30) {
      
      alert("Vous avez été touché par un ennemi ! Vous avez perdu.");
    }
  });


    
  }
  
}