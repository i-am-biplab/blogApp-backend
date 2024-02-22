const { DataTypes } = require("sequelize");
const sequelize = require("../db/conn");


const Blog = sequelize.define("Blog", {
    blogid: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    sl_no: {
        type: DataTypes.INTEGER.UNSIGNED,
        unique: true,
        autoIncrement: true
    },
    uid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    b_title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    b_desc: {
        type: DataTypes.STRING,
        allowNull: false
    },
    img: {
        type: DataTypes.STRING
    }
},
{
    paranoid: true
});

module.exports = Blog;