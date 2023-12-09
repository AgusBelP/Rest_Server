const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { uploadFile } = require('../helpers/uploadFiles');
const { Usuario, Producto } = require('../models');
const { CLOUD_SDK_CLIENT_ID } = require('google-auth-library/build/src/auth/googleauth');

const cargarImagen = async (req, res) => {
    try {
        // prueba para archivos de texto:  const nombre = await uploadFile(req.files, ['txt', 'md'], 'textos');
        const nombre = await uploadFile(req.files, undefined, 'imgs'); //el segundo argumento son las extensiones validas, como quiero subir imagenes y ya declaré por defecto las extensiones válidas para imagenes en la definición de la función "uploadFile" aca pongo undefined

        res.json({ nombre });
    } catch (error) {
        res.status(400).json({ msg: error });
    }
};

// esta función queda como ejemplo pero en la API uso la que sube las imagenes a Cloudinary
const actualizarImagen = async (req, res) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`,
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`,
                });
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto',
            });
    }

    // Eliminar imagen prvia

    if (modelo.img) {
        // Eliminación de la imagen existente en el servidor

        const pathImagen = path.join(__dirname, '/../uploads', coleccion, modelo.img);

        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen); // solo se elimina si existe en el modelo (primer if) y si existe en la colección en la que la estoy buscando
        }
    }

    modelo.img = await uploadFile(req.files, undefined, coleccion); //el segundo argumento son las extensiones validas, como quiero subir imagenes y ya declaré por defecto las extensiones válidas para imagenes en la definición de la constante "uploadFile" aca pongo undefined

    // guardo en el modelo
    await modelo.save();

    res.json(modelo);
};

const mostrarImagen = async (req, res) => {
    const { id, coleccion } = req.params;

    const pathImagenNotFound = path.join(__dirname, '/../assets/no-image.jpg');

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.sendFile(pathImagenNotFound);
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.sendFile(pathImagenNotFound);
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto',
            });
    }

    // Busco la imagen

    if (modelo.img) {
        // Busco el path de la imagen solicitada
        const pathImagen = path.join(__dirname, '/../uploads', coleccion, modelo.img);

        // Envío la imagen
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    // Si el usuario o producto solicitado existe pero no tiene foto se envía el siguiente placeholder:

    res.sendFile(pathImagenNotFound);
};

const actualizarImagenCloudinary = async (req, res) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`,
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`,
                });
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto',
            });
    }

    // Eliminar imagen previa (si existe)

    if (modelo.img) {
        // Eliminación de la imagen existente en Cloudinary

        const nombreArr = modelo.img.split('/');

        const nombre = nombreArr[nombreArr.length - 1];

        const [public_id] = nombre.split('.'); // public_id es el id publico donde se encuentra la imagen en Cloudinary

        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.archivo; // req.files.archivo devuelve un objeto con una llave que se llama tempFilePath, la cual tiene una ruta temporaria para el archivo que se quiere subir. Ese es el parámetro que se le pasa a Cloudinary para subir la img

    const { secure_url } = await cloudinary.uploader.upload(tempFilePath); // upload devuelve una promesa, por eso el await.

    modelo.img = secure_url;

    // guardo en el modelo
    await modelo.save();

    res.json(modelo);
};

module.exports = {
    cargarImagen,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary,
};
