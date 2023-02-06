function myMove() {
    var elem =document.getElementById ("alien");
    var pos = 0;
    var id = setInterval(frame, 5);

    function frame(){
        if (pos==285){
            clearInterval(id);
        }else{
            pos++;
            elem.style;left = pos +"px";

        }
    }
}