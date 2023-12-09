const { Router } = require('express');
const { check } = require('express-validator');

const { cargarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads.controller');
const { checkColecciones } = require('../helpers/dbValidators');
const { validarArchivoUpload, validaCampos } = require('../middlewares');

const router = Router();

router.get(
    '/:coleccion/:id',
    [
        check('id', 'No es un id válido').isMongoId(),
        check('coleccion').custom((c) => checkColecciones(c, ['usuarios', 'productos'])),
        validaCampos,
    ],
    mostrarImagen
);

router.post('/', validarArchivoUpload, cargarImagen);

router.put(
    '/:coleccion/:id',
    [
        validarArchivoUpload,
        check('id', 'No es un id válido').isMongoId(),
        check('coleccion').custom((c) => checkColecciones(c, ['usuarios', 'productos'])),
        validaCampos,
    ],
    actualizarImagenCloudinary
);

module.exports = router;
