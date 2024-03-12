let idCodeOut = "Accidente";
function menuActive(navNum, idCodeIn){
    var activeMenuElem = document.getElementsByClassName("col-3");
    /*var activeElem = document.getElementById(idCodeIn);
    var deactiveElem = document.getElementById(idCodeOut);*/
    for(var i=0;i<activeMenuElem.length;i++){
        switch (i == navNum){
            case true:
                activeMenuElem[i].classList.add("active");
                break;
            default:
                activeMenuElem[i].classList.remove("active");
        }
    }
    idCodeIn.classList.remove("hide");
    idCodeOut.classList.add("hide");
    idCodeOut = idCodeIn;
}