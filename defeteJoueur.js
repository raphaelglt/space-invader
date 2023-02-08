var casejoueur;
var ennemis;
var numberOfennemis;
var scoreUser;
var namePlayer;
function defetejoueur(){
    if (casejoueur==ennemis) {
        return "Vous avez perdu";
    }
}
function winPlayer(){
    if(numberOfennemis==0){
        return "aucun ennemis sur la carte. vous avez gagné! voici votre score:"
    }
}

localStorage.setItem("score", scoreUser);
localStorage.getItem("score");
localStorage.setItem("namePlayer", namePlayer);
localStorage.getItem("namePlayer");