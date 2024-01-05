"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const bodyParser = require('body-parser');
const sequelize_1 = __importDefault(require("./src/config/sequelize"));
const app = express();
const PORT = process.env.PORT || 3000;
//middlewares 
app.use(express.json());
app.use(bodyParser.json());
//routes 
const auth_1 = __importDefault(require("./src/routes/auth"));
app.use("/api/users", auth_1.default);
sequelize_1.default.sync({ force: true }) // Set force to true to drop and recreate tables on every start (for development)
    .then(() => {
    console.log('Database synchronized');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error('Error synchronizing database:', error);
});
