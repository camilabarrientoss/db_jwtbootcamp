const {
    User,
    Bootcamp
} = require('../models');
const bcrypt = require('bcryptjs');

const findUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const usuario = await User.findByPk(userId, {
            include: [
                {
                    model: Bootcamp,
                    as: 'bootcamp',
                    attributes: ['id', 'name', 'tittle' , 'description'],
                    through: {
                        attributes: []
                    }
                }
            ]
        });
        if (!usuario) {
            res.status(404).json({
                message: `usuario id ${id} no fue encontrado`
            });
            return;
        }
        console.log(`Se ha encontrado el usuario ${JSON.stringify(usuario, null, 4)}`);
        res.status(200).json({
            message: `usuario ${usuario.email} fue encontrado con éxito`,
            user: usuario
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

const findAllUsers = async (req, res) => {
    try {
        const usuarios = await User.findAll({
            include: [
                {
                    model: Bootcamp,
                    as: 'bootcamp',
                    attributes: ['id', 'name'],
                    through: {
                        attributes: []
                    }
                }
            ]
        });
        console.log(`Se han encontrado los usuarios ${JSON.stringify(usuarios, null, 4)}`);
        res.status(200).json({
            message: `se encontraron ${usuarios.length} usuarios`,
            users: usuarios
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.body;
        // Validar los datos de entrada
        if (!(user.email && user.password && user.firstName && user.lastName && id)) {
            res.status(400).json({ message: 'Todos los campos son requeridos' });
            return;
        }
        const usuario = await User.findByPk(id);
        let actualizados = [], actualizado;

        if (usuario) {
            //Generamos aleatoriamente el salt
            const salt = await bcrypt.genSalt(10);
            console.log("Salt generado: " + salt);
            const encryptedPassword = await bcrypt.hash(user.password, salt);
            if ((usuario.firstName !== user.firstName) ||
                (usuario.lastName !== user.lastName) ||
                (usuario.email !== user.email) ||
                (usuario.password !== encryptedPassword)) {
                actualizados = await User.update({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    password: encryptedPassword
                }, {
                    where: { id: id }
                });
                actualizado = actualizados[0];
                console.log(`actualizados: ${actualizados}`);
                console.log(`Se ha actualizado el usuario con id ${user.id}`);
            } else {
                actualizado = -1;
            }
        } else {
            actualizado = 0;
        }
        if (!actualizado) {
            res.status(404).json({
                message: `bootcamp id ${id} no fue encontrado`
            });
            return;
        }
        res.status(201).json({
            message: `bootcamp id ${id} fue actualizado con éxito`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

const deleteUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const borrados = await User.destroy({
            where: { id }
        });
        console.log(`borrados: ${borrados}`);
        if (!borrados) {
            res.status(404).json({
                message: `usuario id ${id} no fue encontrado`
            });
            return;
        }
        console.log(`Usuario id ${id} fue borrado con éxito`);
        res.status(201).json({
            message: `usuario id ${id} fue borrado con éxito`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    findUserById,
    findAllUsers,
    updateUser,
    deleteUserById
}