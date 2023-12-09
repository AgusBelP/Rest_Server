const validaCampos = require('../middlewares/validarcampos');
const validarJWT = require('../middlewares/validate-jwt');
const validaRoles = require('../middlewares/validar-roles');
const validarArchivoUpload = require('../middlewares/validar-archivo-upload')

module.exports = {
    ...validarArchivoUpload,
    ...validaCampos,
    ...validarJWT,
    ...validaRoles
}