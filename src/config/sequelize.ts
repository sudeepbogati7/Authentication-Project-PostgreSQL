import { Sequelize  } from "sequelize-typescript";
import { User } from '../models/User';
import * as pg from 'pg';

const sequelize = new Sequelize({
    dialect : 'postgres',
    host : 'localhost',
    port : 5432,
    username : 'sudeep',
    password : 'sudeep1234',
    database : 'authentication-Project',
    models : [User],
    logging : console.log,
    dialectModule : pg
});

export default sequelize;

