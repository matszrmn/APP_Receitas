var maxChildren = 30;

function createInputBoxTipoIngr(divId, index) {
    let bloco = document.createElement("p");
    let inputBox = document.createElement("input");
    
    bloco.appendChild(document.createTextNode("Tipo de ingrediente"));
    bloco.setAttribute("class", "blocoTipoIngrediente");
    
    inputBox.setAttribute("id", index);
    inputBox.setAttribute("name", index);
    inputBox.setAttribute("required", true);
    inputBox.setAttribute("maxLength", 50);
    inputBox.setAttribute("type", "text");
    inputBox.setAttribute("placeholder", "Calda, Massa, Recheio");
    inputBox.style.marginRight = "20px";
    inputBox.style.marginLeft = "20px";
    
    let buttonAdd = document.createElement("BUTTON");
    let buttonRmv = document.createElement("BUTTON");
    
    buttonAdd.setAttribute("class", "botaoPlus");
    buttonRmv.setAttribute("class", "botaoMinus");
    buttonAdd.appendChild(document.createTextNode(" + "));
    buttonRmv.appendChild(document.createTextNode(" - "));
    buttonAdd.style.marginRight = "10px";
    
    buttonAdd.onclick = function() {
        addIngrediente(divId);
    };
    buttonRmv.onclick = function() {
        removerIngrediente(divId);
    };
    bloco.appendChild(inputBox);
    bloco.appendChild(buttonAdd);
    bloco.appendChild(buttonRmv);
    return bloco;
}
function createInputBoxIngr(index, type, step, titleName) {
    let label = document.createElement("label");
    let inputBox = document.createElement("input");
    
    if(titleName) label.appendChild(document.createTextNode(titleName));
    
    inputBox.setAttribute("id", index);
    inputBox.setAttribute("name", index);
    inputBox.setAttribute("required", true);
    inputBox.setAttribute("maxLength", 50);
    inputBox.setAttribute("type", type);
    if(step) inputBox.setAttribute("step", step);
    else inputBox.setAttribute("placeholder", "Ingrediente");
    
    label.appendChild(inputBox);
    label.style.marginRight = "20px";
    return label;
}
function createSelectListIngr(index, values) {
    let selectList = document.createElement("select");
    selectList.setAttribute("id", index);
    selectList.setAttribute("name", index);
    
    let i;
    let checkItem;
    for(i=0; i<values.length; i++) {
        checkItem = document.createElement("option");
        checkItem.setAttribute("value", values[i]);
        checkItem.appendChild(document.createTextNode(values[i]));
        selectList.appendChild(checkItem);
    }
    return selectList;
}
function addIngrediente(divId) {
    let div = document.getElementById(divId);
    let index = div.childElementCount;
    if(index == maxChildren) return;
    
    let bloco = document.createElement("p");
    let checkItems = ["Unidade(s)", "Grama(s)", "mL", "Xícara(s)"];
    
    let nomeIngr = createInputBoxIngr(divId + "nomeIngr" + index, "text", false, false);
    let quantIngr = createInputBoxIngr(divId + "quantIngr" + index, "number", "0.1", "Quantidade: ");
    let selectList = createSelectListIngr(divId + "selectIngr" + index, checkItems);
    
    bloco.appendChild(nomeIngr);
    bloco.appendChild(quantIngr);
    bloco.appendChild(selectList);
    div.appendChild(bloco);
}
function addTipoIngrediente(divId) {
    let divPai = document.getElementById(divId);
    divPai.appendChild(document.createElement("br"));
    
    let index = divPai.childElementCount;
    let div = document.createElement('div');
    div.setAttribute("id", divId + index);
    
    let nomeTipoIngr = createInputBoxTipoIngr(divId + index, 'nomeTipoIngr' + index);
    div.appendChild(nomeTipoIngr);
    divPai.appendChild(div);
}
function removerIngrediente(divId) {
    let div = document.getElementById(divId);
    if(div.childElementCount > 1) div.removeChild(div.lastChild);
}
function removerTipoIngrediente(divId) {
    let div = document.getElementById(divId);
    if(div.childElementCount > 0) div.removeChild(div.lastChild);
    if(div.childElementCount > 0) div.removeChild(div.lastChild);
}