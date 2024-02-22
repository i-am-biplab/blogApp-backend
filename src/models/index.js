const sequelize = require("../db/conn");
const Blog = require("./blog");
const User = require("./user");

// User.hasOne(Blog, {foreignKey: "uid"});
Blog.belongsTo(User, {foreignKey: "uid"});

(async () => {
    await sequelize.sync({force: false});
})();