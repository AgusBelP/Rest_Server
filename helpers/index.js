const dbValidators = require('./dbValidators')
const generarJWT = require('./generarjwt')
const googleVerify = require('./google-verify')
const uploadFiles = require('./uploadFiles')

module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...uploadFiles
}