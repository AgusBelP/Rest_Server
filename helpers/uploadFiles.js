const path = require('path');

const { v4: uuidv4 } = require('uuid');

const uploadFile = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'JPG', 'gif'], carpeta = "") => {

    return new Promise((resolve,reject) => {
        const { archivo } = files;

        const nombreSplit = archivo.name.split('.'); // separo el nombre del archivo usndo el punto como separación
        const extension = nombreSplit[nombreSplit.length - 1]
        
        // Validación de la extensión

        if(!extensionesValidas.includes(extension)){

            return reject(`La extensión ${extension} del archivo no es permitida. Las extensiones permitidas son ${extensionesValidas}`)
          
        }

        // Creo un nombre para el archivo utilizando un identificador único
        const nombreTemporal = uuidv4() + '.' + extension

        // Ruta de la carpeta en la que voy a guardar el archivo
        const uploadPath =  path.join(__dirname, '/../uploads/', carpeta , nombreTemporal); // uno las rutas porque __dirname apunta a la carpeta de controladores y yo quiero subir el archivo a la carpeta de uploads

        // Guardo el archivo, con el método "mv" lo muevo a donde yo quiero, en este caso uploadPath
        archivo.mv(uploadPath, (err) => {
            
            if (err) {
                reject(err)
            }

            resolve (nombreTemporal);
        }); 
    })

   



}

module.exports = {
    uploadFile
}