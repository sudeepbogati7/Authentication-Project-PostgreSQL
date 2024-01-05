"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_typescript_1 = require("sequelize-typescript");
var User_1 = require("../models/User");
var pg = require("pg");
var sequelize = new sequelize_typescript_1.Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'sudeep',
    password: 'sudeep1234',
    database: 'authentication-Project',
    models: [User_1.User],
    logging: console.log,
    dialectModule: pg
});
exports.default = sequelize;
