const express = require('express');
const app = express();
require('dotenv').config();
const userRoutes = require('./app/routes/user.routes');
const bootcampRoutes = require('./app/routes/bootcamp.routes');
const { User } = require('./app/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const util = require('util');
const sign = util.promisify(jwt.sign);
const { 
    verifySingUp,
    verifyToken 
} = require('./app/middleware');
const cors = require('cors');

const PORT = process.env.PORT;

// Creamos la variable de configuración para CORS
var corsOpt = {
    origin: '*', // Se debe reemplazar el * por el dominio de nuestro front
    optionsSuccessStatus: 200 // Es necesario para navegadores antiguos o algunos SmartTVs
}

app.use(cors(corsOpt));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', verifyToken); // protegemos todas las rutas de user
app.use('/api/user', userRoutes);
app.use('/api/bootcamp', bootcampRoutes);

// Registro
/**
method: POST
url: http://localhost:3000/api/signup
body:
{
    "firstName": "Nombre",
    "lastName": "Apellido",
    "email": "mail@email.com",
    "password": "mypassword"
}
*/
app.post('/api/signup', verifySingUp, async (req, res) => {
    // lógica del registro
    try {
        // obteniendo los valores de entrada
        const {
            firstName,
            lastName,
            email,
            password
        } = req.body;

        //Generamos aleatoriamente el salt
        const salt = await bcrypt.genSalt(10);
        console.log("Salt generado: " + salt);
        // Encriptando la contraseña del usuario
        const encryptedPassword = await bcrypt.hash(password, salt);

        // Password encriptado
        console.log("\nPassword encriptado: " + encryptedPassword);

        // Creando el usuario en la bases de datos
        const user = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(), // Convertimos a minuscula
            password: encryptedPassword,
        });

        // Creación del Token
        const token = await sign(
            {
                userId: user.id,
                email
            },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2m",
            }
        );
        // Token Generado
        console.log("\nToken Generado: " + token);

        // retornamos el nuevo usuario
        res.status(201).json({
            user,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// Login
/**
method: POST
url: http://localhost:3000/api/signin
body:
{
    "email": "mail@email.com",
    "password": "mypassword"
}
*/
app.post('/api/signin', async (req, res) => {
    // lógica del inicio de sesión
    try {
        const {
            email,
            password
        } = req.body;

        // Validar los datos de entrada
        if (!(email && password)) {
            res.status(400).json({ message: 'Todos los datos son requeridos, email y password' });
            return;
        }

        // Validando la existencia del usuario en la base de datos
        const user = await User.findOne({
            where: {
                email
            }
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Se genera el Token
            const token = await sign(
                {
                    userId: user.id,
                    email
                },
                process.env.TOKEN_KEY, 
                {
                    expiresIn: "2m",
                }
            );
            // Impresion por el terminal del Token generado para el usuario
            console.log("Usuario: " + email + "\nToken: " + token);

            // Retornando los datos del usuario
            res.status(200).json({
                token,
                message: 'Autenticado'
            });
            return;
        }
        res.status(401).json({ message: 'Credenciales invalidas'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => console.log(`Iniciando en puerto ${PORT}`));