const { Router } = require('express');
const{ check } = require('express-validator');
const { login } = require('../controllers/auth.controller');
const { validar_campos } = require('../middlewares/validarcampos');


const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validar_campos
],login );

module.exports = router