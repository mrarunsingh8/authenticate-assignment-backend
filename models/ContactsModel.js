import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import UserModel from "./UserModel.js";

const ContactModel = sequelize.define("contact", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.BIGINT
    },
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: UserModel,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    name: {        
        type: DataTypes.STRING(20),
        allowNull: true
    },
    phone:{
        type: DataTypes.STRING(15),
        allowNull: false
    },
    email:{
        type: DataTypes.STRING(50),
        allowNull: true
    }
},{
    paranoid: false
});

await ContactModel.sync({alter: true});

UserModel.hasMany(ContactModel, { foreignKey: 'user_id' });
ContactModel.belongsTo(UserModel, {foreignKey: "user_id"});
export default ContactModel;