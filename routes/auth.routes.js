const { Router } = require('express');
const{ check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth.controller');
const { validar_campos } = require('../middlewares/validarcampos');


const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validar_campos
],login );

router.post('/google', [
    check('id_token', 'El id token es necesario').not().isEmpty(),
    validar_campos
], googleSignIn);

module.exports = router