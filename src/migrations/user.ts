'use strict';

import { QueryInterface , DataTypes } from 'sequelize';
module.exports = {
  up : async ( queryInterface : QueryInterface) => {
    await queryInterface.createTable('Users', {
      userId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      username: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING(25),
      },
      email: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },      
    });
  },
  down :async (queryInterface:QueryInterface) => {
    await queryInterface.dropTable('Users');
  },
};
