const { Router } = require('express');
const{ check, query} = require('express-validator')

const userController = require('../controllers/user.controller');

const { validar_campos } = require('../middlewares/validarcampos');
const { checkRole, checkEmail, checkMongoId } = require('../helpers/dbValidators');


const router = Router();

router.get('/', [
   query('desde', 'El valor "desde" de la paginación debe ser un número').default(0).isNumeric(),
   query('limite', 'La cantidad de usuarios a mostrar por página debe ser un número').default(5).isNumeric(),
],
validar_campos,
userController.getUser)

router.put('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(checkMongoId),
    check('role').custom(checkRole), //podría decidir no chequearlo poruqe implica que siempre lo tienen que pasar
    validar_campos
]
,userController.putUser)

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y debe tener por lo menos 6 letras').isLength({min:6}),
    check('correo', 'Esto no es un correo valido').isEmail(),
    check('correo').custom(checkEmail),
    check('role').custom(checkRole), // equivale a role => checkRole(role) porque va el argumento del primer check
    validar_campos
], userController.postUser)

router.delete('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(checkMongoId),
    validar_campos
],userController.deleteUser)

module.exports = router
