function excluirReceita(receitaID) {
    let resp = confirm("Tem certeza que deseja excluir esta receita?");
    if(resp) {
        let url = "https://mongo-db-matszrmn.c9users.io/remove/" + receitaID;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.send();
        window.setTimeout(function() {
            window.location.replace("https://mongo-db-matszrmn.c9users.io/");
        }, 1000);
    }
}