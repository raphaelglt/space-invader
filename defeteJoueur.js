var casejoueur;
var ennemis;
var numberOfennemis;
function defetejoueur(){
    if (casejoueur==ennemis) {
        return "Vous avez perdu";
    }
}
function winPlayer(){
    if(numberOfennemis==0){
        return "aucun ennemis sur la carte. vous avez gagné!"
    }
}