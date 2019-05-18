var maxChildren = 30;

function createTextAreaPasso(index) {
    let passo = document.createElement("textarea");
    
    passo.setAttribute("id", index);
    passo.setAttribute("name", index);
    passo.setAttribute("required", true);
    passo.setAttribute("maxLength", "5000");
    passo.setAttribute("rows", "6");
    passo.setAttribute("cols", "60");
    return passo;
}
function addPasso(divId) {
    let div = document.getElementById(divId);
    let index = div.childElementCount;
    if(index == maxChildren) return;
    
    let passo = createTextAreaPasso(divId + index);
    let bloco = document.createElement("p");
    bloco.setAttribute("id", "p" + divId + index);
    
    bloco.appendChild(document.createTextNode(index + 1 + ". "));
    bloco.appendChild(passo);
    div.appendChild(bloco);
}
function removerPasso(divId) {
    let div = document.getElementById(divId);
    div.removeChild(div.lastChild);
}