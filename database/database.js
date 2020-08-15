const Sequelize = require("sequelize");

const connection = new Sequelize("guiaperguntas", "root", "99845993", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = connection;
