const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    host: process.env.HOST,
    username: process.env.UNAME,
    password: process.env.PASSWD,
    database: process.env.DB,
    dialect: process.env.DIALECT
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully");
    } catch (error) {
        console.log("Unable to connect to the database");
    }
})();

module.exports = sequelize;