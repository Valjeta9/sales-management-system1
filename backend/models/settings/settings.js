import { DataTypes } from "sequelize";
import { sequelize } from "../../src/config/db.js";

const Settings = sequelize.define("Settings", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    business_name: DataTypes.STRING,
    logo_path: DataTypes.STRING,
    contact_email: DataTypes.STRING,
    contact_phone: DataTypes.STRING,
    tax_rate: DataTypes.DECIMAL,
    currency: DataTypes.STRING,
    appearance: DataTypes.ENUM("dark", "light"),
}, {
    tableName: "settings",
    timestamps: false,
});

export default Settings;
