const {
    Bootcamp,
    User
} = require('../models');

const createBootcamp = async (req, res) => {
    try {
        const {
            name,
            tittle,
            description
        } = req.body;
        // Validar los datos de entrada
        if (!(name && tittle && description)) {
            res.status(400).json({ message: 'Todos los campos son requeridos' });
            return;
        }
        const boot = await Bootcamp.create({
            name,
            tittle,
            description
        });
        console.log(`Se ha creado el bootcamp ${JSON.stringify(boot, null, 4)}`);
        res.status(201).json({
            message: `bootcamp ${boot.name} fue creado con éxito`,
            bootcamp: boot
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

const addUserToBootcamp = async (req, res) => {
    try {
        const { bootcampId, userId } = req.body;
        console.log('bootcampId:', bootcampId);
        console.log('userId:', userId);
        const boot = await Bootcamp.findByPk(bootcampId);
        if (!boot) {
            console.log(`No se encontró bootcamp con id ${bootcampId}`);
            res.status(404).json({
                message: `No se encontró bootcamp con id ${bootcampId}`
            });
            return;
        }
        console.log('boot:', boot);
        const usuario = await User.findByPk(userId);
        if (!usuario) {
            console.log(`No se encontró usuario con id ${userId}`);
            res.status(404).json({
                message: `No se encontró usuario con id ${userId}`
            });
            return;
        }
        console.log('usuario:', usuario);
        await boot.addUser(usuario);
        console.log(`Agredado el usuario id ${usuario.id} al bootcamp con id ${boot.id}`);
        res.status(201).json({
            message: `Se agregó el usuario id ${usuario.id} al bootcamp con id ${boot.id}`,
            bootcamp: boot
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

const findBootcampById = async (req, res) => {
    try {
        const { id } = req.params;
        const boot = await Bootcamp.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'password'],
                    through: {
                        attributes: []
                    }
                }
            ]
        });
        if (!boot) {
            res.status(404).json({
                message: `bootcamp id ${id} no fue encontrado`
            });
            return;
        }
        console.log(`Se ha encontrado el bootcamp ${JSON.stringify(boot, null, 4)}`);
        res.status(200).json({
            message: `bootcamp ${boot.name} fue encontrado con éxito`,
            bootcamp: boot
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

const findAllBootcamps = async (req, res) => {
    try {
        const boot = await Bootcamp.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                    through: {
                        attributes: []
                    }
                }
            ]
        });
        console.log(`Se han encontrado los bootcamps ${JSON.stringify(boot, null, 4)}`);
        res.status(200).json({
            message: `se encontraron ${boot.length} bootcamps`,
            bootcamp: boot
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

const updateBootcampById = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            tittle,
            description
        } = req.body;
        if (!(id && name && tittle && description)) {
            res.status(400).json({ message: 'Todos los campos son requeridos' });
            return;
        }
        const actualizados = await Bootcamp.update(
            {
                name,
                tittle,
                description
            },
            {
                where: { id }
            }
        );
        console.log(`actualizados: ${actualizados}`);
        console.log(`Bootcamp id ${id} fue actualizado con éxito`);
        if (!actualizados[0]) {
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

const deleteBootcampById = async (req, res) => {
    try {
        const { id } = req.params;
        const borrados = await Bootcamp.destroy({
            where: { id }
        });
        console.log(`borrados: ${borrados}`);
        console.log(`Bootcamp id ${id} fue borrado con éxito`);
        if (!borrados) {
            res.status(404).json({
                message: `usuario id ${id} no fue encontrado`
            });
            return;
        }
        res.status(201).json({
            message: `usuario id ${id} fue borrado con éxito`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createBootcamp,
    addUserToBootcamp,
    findBootcampById,
    findAllBootcamps,
    updateBootcampById,
    deleteBootcampById
}