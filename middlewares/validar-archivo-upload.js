
const validarArchivoUpload = (req, res, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {  //en el body la key con la que se sube la foto es ""archivo" por eso valido req.files.archivo
        return res.status(400).json({
            msg: 'No se adjuntaron archivos para subir - validar archivo subido'
        });   
    }

    next();
}

module.exports = {
    validarArchivoUpload
}