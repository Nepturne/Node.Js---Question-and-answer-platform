// Projeto Node.js = [ Plataforma Guia Perguntas com Node.js - Estilo Yahoo Respostas ]
// Instalar o Node.js versão LTS marcando o checkbox de instalação do NPM[Node Package Manager]
// npm init / npm instal express --save / npm install nodemon -g          /
// npm install ejs --save              /  npm instal body-parser --save  /
// npm install sequelize --save       /   npm install mysql2 --save     /

// Importando e inicializando o express & Importando o body-parser:
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database.js");
const Pergunta = require("./database/Pergunta.js");
const Resposta = require("./database/Resposta.js");

// Database:-------------------------------------------------------------------
// Conexão com o banco de dados:
connection
  .authenticate()
  .then(() => {
    console.log("Conexão com o banco de dados efetuada com sucesso!");
  })
  .catch((msgError) => {
    console.log(msgError);
  });
// ----------------------------------------------------------------------------

app.set("view engine", "ejs"); // Declara ao Express que o EJS é o View Engine:
app.use(express.static("public")); // Permite a aplicação usar arquivos estáticos na pasta 'public'

app.use(bodyParser.urlencoded({ extended: false })); // Faz a decodificação dos dados vindos do form em um formato JS para poder ser utilizado pelo backend.
app.use(bodyParser.json()); // Permite que o express leia dados vindos do formulário no formato JSON.

//Rotas:
// O método render procura uma pasta na raiz do entry point chamada views e renderiza o arquivo nomeado.
app.get("/", (req, res) => {
  Pergunta.findAll({ raw: true, order: [["id", "DESC"]] })
    .then((perguntas) => {
      //console.log(perguntas);
      res.render("index.ejs", {
        perguntas: perguntas,
      });
    })
    .catch((msgError) => {
      console.log(msgError);
    });
});

// Rota para cadastro de perguntas:
app.get("/perguntar", (req, res) => {
  res.render("perguntar.ejs");
});

// Rota para receber dados do form da rota /perguntar:
app.post("/salvarpergunta", (req, res) => {
  // Recuperando os dados dos inputs do form
  var titulo = req.body.titulo;
  var descricao = req.body.descricao;
  // Verificando se os inputs existem se os 2 foram informados
  // Caso existam pegue o Model da tabela do banco de dados e faça um INSERT na table perguntas
  if (titulo && descricao) {
    // O comando create efetua o [INSERT INTO perguntas VALUES(...); etc]
    Pergunta.create({
      // nomedocamponatabela: variável com os dados informados no formulário
      titulo: titulo,
      descricao: descricao,
    })
      .then(() => {
        res.redirect("/"); // Se der certo redirecione para rota principal
      })
      .catch((msgError) => {
        console.log(msgError); // Caso não passe a mensagem de erro para o parâmetro msgError e exiba no console.
      });
  } else {
    res.send(
      "Não foram enviados dados para efetuar uma pergunta em nosso sistema :("
    );
  }
});

// Rota para que ao clicar numa pergunta seja direcionado para página da pergunta clicada
// Caso o id da pergunta não exista no banco de dados redireciona para rota principal "/"
app.get("/pergunta/:id", (req, res) => {
  var id = req.params.id;
  Pergunta.findOne({
    where: { id: id }, // O método findOne e o findAll , permite usar o where como condição de seleção
    // assim como nos bancos de dados
  })
    .then((pergunta) => {
      if (pergunta != undefined) {
        Resposta.findAll({
          where: { perguntaId: pergunta.id },
          raw: true,
          order: [["id", "DESC"]],
        }).then((respostas) => {
          // Pergunta achada no banco
          res.render("pergunta.ejs", {
            pergunta: pergunta,
            respostas: respostas,
          });
        });
      } else {
        // Pergunta não achada no banco
        res.redirect("/");
      }
    })
    .catch((msgError) => {
      console.log(msgError);
    });
});

// Rota para receber as respostas de uma pergunta na view pergunta.ejs e salva-las no banco de dados.
app.post("/responder", (req, res) => {
  var corpo = req.body.corpo;
  var perguntaId = req.body.pergunta;
  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId,
  })
    .then(() => {
      res.redirect("/pergunta/" + perguntaId); // Se der certo redirecionar para a página respondida[Refresh]
    })
    .catch((msgError) => {
      console.log(msgError);
    });
});

// Ligando o express para ouvir requisições na porta 4000.
app.listen(4000, (error) => {
  if (error) {
    console.log("App não foi iniciado corretamente!");
  } else {
    console.log("App rodando!");
  }
});
//---------------------------------------------------------
