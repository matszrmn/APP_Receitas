/*global $*/

let infos;
let disponiveis;
let indisponiveis = {};
let valorAnt = {};

let LinkedList = function() {
    this.inicio = null;
    this.length = 0;
};
LinkedList.prototype.addInicio = function(value) {
    const novo = { value };
    novo.next = this.inicio;
    this.inicio = novo;
    this.length++;
};
LinkedList.prototype.addOrdenado = function(value) {
    const novo = { value };
    novo.next = this.inicio;
    
    if(this.length == 0 || value <= this.inicio.value) this.inicio = novo;
    else {
        let ant = this.inicio;
        let atual = ant.next;
        
        while(atual != null) {
            if(value <= atual.value) break;
            ant = atual;
            atual = atual.next;
        }
        novo.next = atual;
        ant.next = novo;
    }
    this.length++;
};
LinkedList.prototype.removerInicio = function() {
    if (this.length == 0) return null;
    
    const value = this.inicio.value;
    this.inicio = this.inicio.next;
    this.length--;
    return value;
};
LinkedList.prototype.remover = function(value) {
    if(this.length == 0) return null;
    if (this.inicio.value === value) return this.removerInicio();
    
    let ant = this.inicio;
    let atual = ant.next;
    
    while(atual) {
        if(atual.value === value) break;
        ant = atual;
        atual = atual.next;
    }
    if (atual === null) return null;
    ant.next = atual.next;
    this.length--;
    return value;
};
function inicializarListasDeInformacoes() {
    infos = ["Vitamina A", "Vitamina B1", "Vitamina B2", "Vitamina C", "Vitamina K"];
    disponiveis = new LinkedList();
    
    let i;
    for(i=infos.length-1; i>=0; i--) {
        disponiveis.addInicio(infos[i]);
    }
}
function createInputBoxInfoNutri(index, divId, value) {
    let label = document.createElement("label");
    let inputBox = document.createElement("input");
    
    label.setAttribute("id", "percent" + divId + "lbl" + index);
    
    inputBox.setAttribute("id", "percent" + divId + index);
    inputBox.setAttribute("name", "percent" + divId + index);
    inputBox.setAttribute("required", true);
    inputBox.setAttribute("type", "number");
    inputBox.setAttribute("step", "0.01");
    inputBox.setAttribute("placeholder", "% VD");
    inputBox.setAttribute("min", 0);
    inputBox.setAttribute("max", 100);
    if(value) inputBox.setAttribute("value", value);
    
    label.appendChild(inputBox);
    label.appendChild(document.createTextNode(" %"));
    return label;
}
function changeOrSwap(div, divId, listID, listValue) {
    if(indisponiveis[listValue]) {
        let i;
        let currentId;
        let currentList;
        for(i=0; i<div.childElementCount; i++) {
            currentId = "select" + divId + i;
            if(listID === currentId) continue;
            
            currentList = document.getElementById(currentId);
            if(currentList.value === listValue) {
                $('#' + currentList.id + ' option:contains(' + valorAnt[listID] + ')').prop({selected: true});
                break;
            }
        }
        valorAnt[currentList.id] = valorAnt[listID];
    }
    else {
        indisponiveis[valorAnt[listID]] = false;
        disponiveis.addOrdenado(valorAnt[listID]);
        disponiveis.remover(listValue);
    }
    indisponiveis[listValue] = true;
    valorAnt[listID] = listValue;
}
function createSelectListInfoNutri(index, divId, value) {
    let div = document.getElementById(divId);
    let selectList = document.createElement("select");
    selectList.setAttribute("id", "select" + divId + index);
    selectList.setAttribute("name", "select" + divId + index);
    
    let checkItem;
    let i;
    for(i=0; i<infos.length; i++) {
        checkItem = document.createElement("option");
        checkItem.setAttribute("value", infos[i]);
        checkItem.appendChild(document.createTextNode(infos[i]));
        if(infos[i] === value) checkItem.setAttribute("selected", "selected");
        selectList.appendChild(checkItem);
    }
    indisponiveis[value] = true;
    valorAnt[selectList.id] = value;
    
    selectList.onchange = function() {
        changeOrSwap(div, divId, selectList.id, selectList.value);
    };
    selectList.style.marginRight = "20px";
    return selectList;
}
function addInfoNutri(divId, info, quant) {
    let div = document.getElementById(divId);
    let index = div.childElementCount;
    
    if(disponiveis == null) inicializarListasDeInformacoes();
    if(disponiveis.length == 0) return;
    
    if(!info) info = disponiveis.removerInicio();
    let selectList = createSelectListInfoNutri(index, divId, info);
    let inputBox = createInputBoxInfoNutri(index, divId, quant);
    let bloco = document.createElement("p");
    bloco.setAttribute("id", "p" + divId + index);
    
    bloco.appendChild(selectList);
    bloco.appendChild(inputBox);
    div.appendChild(bloco);
}
function removerInfoNutri(divId) {
    let div = document.getElementById(divId);
    disponiveis.addOrdenado(div.lastChild.firstChild.value);
    indisponiveis[div.lastChild.firstChild.value] = false;
    div.removeChild(div.lastChild);
}