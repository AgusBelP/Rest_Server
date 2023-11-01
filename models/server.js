const express = require('express');
const cors = require('cors')
require('dotenv').config()

class Server {

    constructor(){
        this.app = express(); //genero la instancia de app como una propiedad del servidor
        this.port = process.env.PORT;
        this.usersRoutes = '/api/users'

        //Middlewares
        this.middlewares();

        //Rutas de la aplicación
        this.routes();
    }

    middlewares(){
        
        // Cors
        this.app.use(cors())

        // Lectura y parseo del body
        this.app.use(express.json()); //todo lo que venga en post, put o delete la va a intentar serializar a un formato json


        // Directorio público
        this.app.use(express.static('public'));

    }

    routes(){
        
        this.app.use(this.usersRoutes,require('../routes/user.routes'))
    }

    listen(){
        this.app.listen(this.port, () => 
            console.log('Servidor corriendo en el puerto', this.port));
    }

}

module.exports = Server;