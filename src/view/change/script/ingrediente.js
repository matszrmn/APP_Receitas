var maxChildren = 30;

function createInputBoxIngr(index, type, step, titleName, defaultValue) {
    let label = document.createElement("label");
    let inputBox = document.createElement("input");
    
    if(titleName) label.appendChild(document.createTextNode(titleName));
    label.setAttribute("id", "lbl" + index);
    
    inputBox.setAttribute("id", index);
    inputBox.setAttribute("name", index);
    inputBox.setAttribute("required", true);
    inputBox.setAttribute("maxLength", 50);
    inputBox.setAttribute("type", type);
    if(step) inputBox.setAttribute("step", step);
    else inputBox.setAttribute("placeholder", "Ingrediente");
    if(defaultValue) inputBox.setAttribute("value", defaultValue);
    
    label.appendChild(inputBox);
    label.style.marginRight = "20px";
    return label;
}
function createSelectListIngr(index, values, divId, defaultValue) {
    let selectList = document.createElement("select");
    selectList.setAttribute("id", "select" + divId + index);
    selectList.setAttribute("name", "select" + divId + index);
    
    let i;
    let checkItem;
    for(i=0; i<values.length; i++) {
        checkItem = document.createElement("option");
        checkItem.setAttribute("value", values[i]);
        checkItem.appendChild(document.createTextNode(values[i]));
        if(values[i] === defaultValue) checkItem.setAttribute("selected", "selected");
        selectList.appendChild(checkItem);
    }
    return selectList;
}
function addIngrediente(divId, nome, quant, unidade) {
    let div = document.getElementById(divId);
    let index = div.childElementCount;
    if(index == maxChildren) return;
    
    let bloco = document.createElement("p");
    bloco.setAttribute("id", "p" + divId + index);
    
    let nomeIngr = createInputBoxIngr(divId + index, "text", false, false, nome);
    let quantIngr = createInputBoxIngr("quant" + divId + index, "number", "0.1", "Quantidade: ", quant);
    let checkItems = ["Unidade(s)", "Grama(s)", "mL", "Xícara(s)"];
    let selectList = createSelectListIngr(index, checkItems, divId, unidade);
    
    bloco.appendChild(nomeIngr);
    bloco.appendChild(quantIngr);
    bloco.appendChild(selectList);
    div.appendChild(bloco);
}
function removerIngrediente(divId) {
    let div = document.getElementById(divId);
    div.removeChild(div.lastChild);
}