const validaCampos = require('../middlewares/validarcampos');
const validarJWT = require('../middlewares/validate-jwt');
const validaRoles = require('../middlewares/validar-roles');

module.exports = {
    ...validaCampos,
    ...validarJWT,
    ...validaRoles
}