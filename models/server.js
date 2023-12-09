const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');
require('dotenv').config()

class Server {

    constructor(){
        this.app = express(); //genero la instancia de app como una propiedad del servidor
        this.port = process.env.PORT;
        this.paths = {
            auth:'/api/auth',
            bsqueda:'/api/buscar',
            categories: '/api/categories',
            products: '/api/products',
            users: '/api/users',
            uploads: '/api/uploads'
        }
        
        

        // Conexión a la bbdd
        this.databaseConnection();

        //Middlewares
        this.middlewares();

        //Rutas de la aplicación
        this.routes();
    }

    async databaseConnection(){
        await dbConnection();
    }

    middlewares(){
        
        // Cors
        this.app.use(cors())

        // Lectura y parseo del body
        this.app.use(express.json()); //todo lo que venga en post, put o delete la va a intentar serializar a un formato json


        // Directorio público
        this.app.use(express.static('public'));

        //Manejo de carga de arhcivovs 
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath : true
        }));

    }

    routes(){
        
        this.app.use(this.paths.auth,require('../routes/auth.routes'));
        this.app.use(this.paths.bsqueda,require('../routes/busqueda.routes'));
        this.app.use(this.paths.categories,require('../routes/categories.routes'))
        this.app.use(this.paths.products,require('../routes/products.routes'))
        this.app.use(this.paths.users,require('../routes/user.routes'))
        this.app.use(this.paths.uploads,require('../routes/uploads.routes'))
    }

    listen(){
        this.app.listen(this.port, () => 
            console.log('Servidor corriendo en el puerto', this.port));
    }

}

module.exports = Server;