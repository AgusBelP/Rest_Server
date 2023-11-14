const mongoose = require('mongoose');
require('dotenv').config()

const dbConnection = async()=>{
    try {
        mongoose.connect(process.env.CONNECTION_MON_ATLAS)
        // se conecta a la bdd de acuerdo a la versión de mongoose utilizada
        /* mongoose.connect(process.env.CONNECTION_MON_ATLAS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true 
})*/
    console.log('Base de datos conectada exitosamente');

    } catch (error) {
        console.log(error);
        throw new Error('Error en la conexión de la base de datos')
    }
};

module.exports = {
    dbConnection
}