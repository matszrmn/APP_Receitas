const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const urlExists = require("url-exists");


let database = "ep";
let defaultCollection = "receitas";
let url = "mongodb://localhost:27017/";

let MongoParser = require('mongodb');
let MongoClient = require('mongodb').MongoClient;


//Load View Engine
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'pug');

app.use("./view", express.static("./view"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



function exibirListaDeReceitas(response) {
    MongoClient.connect(url, { useNewUrlParser: true }, function(error, mongo) {
        if (error) throw error;
        
        let db = mongo.db(database);
        db.collection(defaultCollection).find({}).sort({_id:-1}).limit(30).toArray(function(error, result) {
			if (error) throw error;
			
			response.render('home/index', {
				receitas: result,
			});
			mongo.close();
		});
	});
}
function exibirReceitaPorID(req, response, update) {
    MongoClient.connect(url, { useNewUrlParser: true }, function(error, mongo) {
        if (error) throw error;
        
        let db = mongo.db(database);
        let currentId = new MongoParser.ObjectId(req.params.id);
        
        db.collection(defaultCollection).find({_id:currentId}).toArray(function(error, result) {
			if (error) throw error;
			
			if(!result[0]) exibirListaDeReceitas(response);
			else if(!update) {
				return response.render('details/details', {
					receita: result[0]
				});
			}
			else {
				return response.render('change/receita', {
					receita: result[0],
					mensagemErro: '',
					mensagemSucesso: ''
				});
			}
			mongo.close();
        });
    });
}
function exibirPesquisa(pesquisa, response) {
    MongoClient.connect(url, { useNewUrlParser: true }, function(error, mongo) {
        if (error) throw error;
        
        let db = mongo.db(database);
        db.collection(defaultCollection).find({titulo: new RegExp(pesquisa)}).sort({_id:-1}).limit(30).toArray(function(error, result) {
			if (error) throw error;
			
			response.render('home/index', {
				receitas: result,
			});
			mongo.close();
        });
    });
}
function inserirReceita(novaReceita, response) {
    MongoClient.connect(url, { useNewUrlParser: true }, function(error, mongo) {
        if (error) throw error;
        
        let db = mongo.db(database);
        db.collection(defaultCollection).insertOne(novaReceita, function(error, result) {
            let feedback;
            if(error)   feedback = ["Erro ao Inserir", ""];
            else        feedback = ["", "Receita Inserida!"];
            response.render('add/receita', {
                mensagemErro: feedback[0],
                mensagemSucesso: feedback[1]
            });
			mongo.close();
        });
    });
}
function atualizarReceita(req, response, novaReceita) {
    MongoClient.connect(url, { useNewUrlParser: true }, function(error, mongo) {
        if (error) throw error;
        
        let db = mongo.db(database);
        let currentId = new MongoParser.ObjectId(req.params.id);
        
        db.collection(defaultCollection).updateOne({_id:currentId}, { $set: novaReceita }, function(error, result) {
            let feedback;
            if(error) feedback = ["Erro ao Modificar Receita", ""];
            else feedback = ["", "Receita Modificada!"];
            response.render('change/receita', {
                receita: novaReceita,
                mensagemErro: feedback[0],
                mensagemSucesso: feedback[1]
            });
			mongo.close();
        });
    });
}
function preencherIngredientes(req, documento) {
    let i = 1;
    let j = 1;
    let ingredientes = [];
    let subSecao = 'nomeTipoIngr' + i;
    
    let nomeAtual;
    let quantAtual;
    let unidAtual;
    
    let lista;
    while(req.body[subSecao]) {
        j = 1;
        lista = [];
        nomeAtual = 'Ingrs' + i + 'nomeIngr' + j;
        quantAtual = 'Ingrs' + i + 'quantIngr' + j;
        unidAtual = 'Ingrs' + i + 'selectIngr' + j;
        
        while(req.body[nomeAtual]) {
            lista.push(req.body[quantAtual] + " " + req.body[unidAtual] + " de " + req.body[nomeAtual]);
            j++;
            nomeAtual = 'Ingrs' + i + 'nomeIngr' + j;
            quantAtual = 'Ingrs' + i + 'quantIngr' + j;
            unidAtual = 'Ingrs' + i + 'selectIngr' + j;
        }
        ingredientes.push({ [req.body[subSecao]] : lista});
        i += 2;
        subSecao = 'nomeTipoIngr' + i;
    }
    documento.ingredientes = ingredientes;
}
function preencherPassos(req, documento) {
    let i = 0;
    let atributoAtual;
    let atributo;
    atributoAtual = 'Passos' + i;
    atributo = [];
    while(req.body[atributoAtual]) {
        atributo.push(req.body[atributoAtual]);
        i++;
        atributoAtual = 'Passos' + i;
    }
    documento['Modo de preparo'] = atributo;
}
function criarReceitaJSON(req) {
    let novaReceita = {};
    let dateNow = new Date();
    
    urlExists(req.body.ImgURL, function(err, exists) {
        if(err) console.log(err);
        if (exists) novaReceita.img_url = req.body.ImgURL;
        else novaReceita.img_url = null;
    });
    novaReceita.titulo = req.body.Titulo;
    novaReceita.autor = req.body.Autor;
    novaReceita.data = [dateNow.getDate(), dateNow.getMonth()+1, dateNow.getFullYear()].join('/');
    novaReceita.tempo = req.body.Tempo;
    novaReceita.rendimento = req.body.Rendimento;
    novaReceita.dificuldade = req.body.Dificuldade;
    novaReceita.likes = 0;
    
    preencherIngredientes(req, novaReceita);
    preencherPassos(req, novaReceita);
    return novaReceita;
}
function removerReceita(receitaID, response) {
    MongoClient.connect(url, { useNewUrlParser: true }, function(error, mongo) {
        if (error) throw error;
        
        let db = mongo.db(database);
        let currentId = new MongoParser.ObjectId(receitaID);
        
        db.collection(defaultCollection).deleteOne({_id:currentId}, function(error, result) {
            if(error) console.log(error);
			mongo.close();
        });
    });
    exibirListaDeReceitas(response);
}


//Home
app.get('/', function(req, response) {
    exibirListaDeReceitas(response);
});


//Exibir Receita por ID
app.get('/receitas/:id', function(req, response) {
    exibirReceitaPorID(req, response, false);
});


//Add Receita
app.get('/add/receita', function(req, response) {
    response.render('add/receita', {
        mensagemSucesso: '',
        mensagemErro: ''
    });
});
app.post('/add/receita', function(req, response) {
    let novaReceita = criarReceitaJSON(req);
    inserirReceita(novaReceita, response);
});


//Update Receita
app.get('/update/:id', function(req, response) {
    exibirReceitaPorID(req, response, true);
});
app.post('/update/:id', function(req, response) {
    let novaReceita = criarReceitaJSON(req);
    atualizarReceita(req, response, novaReceita);
});


app.post('/remove/:id', function(req, response) {
    removerReceita(req.params.id, response);
});


app.get('/search', function(req, response) {
    exibirPesquisa(req.query.Pesquisa, response);
});

//Start Server
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
    console.log("Server listening at port 3000");
});
