const { Router } = require('express');
const{ check, query } = require('express-validator');

const { validarJWT, 
        validar_campos,  
        esAdmin} = require('../middlewares');

const { crearCategoria, 
        getCategorias, 
        getCategoria, 
        actualizarCategoria, 
        eliminarCategoria } = require('../controllers/categories.controller');

const { checkCategoria } = require('../helpers/dbValidators');

const router = Router();

// Obtener todas las categorías - publico
router.get('/', [
    query('desde', 'El valor "desde" de la paginación debe ser un número').default(0).isNumeric(),
    query('limite', 'La cantidad de categorias a mostrar por página debe ser un número').default(5).isNumeric(),
    ],
    validar_campos,
    getCategorias
)

// Obtener la categria por id - publico
router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(checkCategoria),
    validar_campos],
    getCategoria
)

// Crear una categoría - privado para cualquiera con un token válido
router.post('/', [validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validar_campos],
    crearCategoria)

// Actualizar una categoría por id - privado para cualquiera con un token válido
router.put('/:id', validarJWT,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(checkCategoria),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validar_campos,
    actualizarCategoria)

// Eliminar una categoría por id - privado solo válido para un admin. Cambio de estado, no borro en la bbdd
router.delete('/:id',
    [validarJWT,
    esAdmin,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(checkCategoria),
    validar_campos],
    eliminarCategoria)

module.exports = router