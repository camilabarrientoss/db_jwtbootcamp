URL repositorio: 


Para clonar: 
git clone 

Crear base de datos:
psql -U postgres
CREATE USER node_user WITH PASSWORD 'node_password'; 
CREATE DATABASE db_jwtbootcamp OWNER node_user; --creo la base de datos
\q --me conecto a la bd
psql -U node_user -d db_jwtbootcamp
\conninfo

Inicio proyecto
npm init -y
npm i express
npm i bcryptjs cors dotenv jsonwebtoken pg pg-hstore sequelize
npm i nodemon -D
