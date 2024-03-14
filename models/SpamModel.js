import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import UserModel from "./UserModel.js";

const SpamModel = sequelize.define("spam", {
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: UserModel,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    phone:{
        type: DataTypes.STRING(15),
        allowNull: false
    }
},{
    indexes: [
        {
            fields: ["user_id", "phone"],
            unique: true,
            name: "spam-by-user_id-phone"
        }
    ],
    updatedAt: false,
    paranoid: false
});

SpamModel.removeAttribute('id');

await SpamModel.sync({alter: true});

UserModel.hasMany(SpamModel, { foreignKey: 'user_id' });

SpamModel.belongsTo(SpamModel, { foreignKey: 'phone' });

export default SpamModel;