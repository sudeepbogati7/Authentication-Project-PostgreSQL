"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var sequelize_1 = require("./src/config/sequelize");
var app = express();
var PORT = process.env.PORT || 3000;
//middlewares 
app.use(express.json());
app.use(bodyParser.json());
//routes 
var auth_1 = require("./src/routes/auth");
app.use("/api/users", auth_1.default);
sequelize_1.default.sync({ force: true }) // Set force to true to drop and recreate tables on every start (for development)
    .then(function () {
    console.log('Database synchronized');
    app.listen(PORT, function () {
        console.log("Server is running on port ".concat(PORT));
    });
})
    .catch(function (error) {
    console.error('Error synchronizing database:', error);
});
