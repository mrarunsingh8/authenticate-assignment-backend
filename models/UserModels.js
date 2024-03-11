import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const UserModel = sequelize.define("user", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.BIGINT
    },
    name: {        
        type: DataTypes.STRING(20),
        allowNull: true
    },
    phone:{
        type: DataTypes.STRING(15),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email:{
        type: DataTypes.STRING(50),
        allowNull: true
    }
},{
    indexes:[
        {
            fields: ["name"]
        },
        {
            fields: ["phone"]
        },
        {
            fields: ["email"]
        }
    ],
    defaultScope: {
        attributes: { exclude: "password"}
    },
    paranoid: false
});

await UserModel.sync({alter: true});

export default UserModel;