const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Bootcamp = sequelize.define('bootcamp', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El name es requerido'
            },
            notEmpty: {
                msg: 'Debe ingresar un name'
            }
        }
    },
    tittle: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El titulo es requerido'
            },
            notEmpty: {
                msg: 'Debe ingresar un titulo'
            }
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El description es requerido'
            },
            notEmpty: {
                msg: 'Debe ingresar un description'
            }
        }
    }
});

module.exports = Bootcamp;