const Sequelize = require("sequelize");
// Após informar o usuário e a senha do banco , será efetuada a conexão com o seu banco de dados MySQL.
const connection = new Sequelize("guiaperguntas", "root", "informe_aqui_a_senha_do_seu_bancodedados_mysqlworkbench", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = connection;
