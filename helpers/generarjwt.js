const jwt = require('jsonwebtoken');
require('dotenv').config()

const secret = process.env.SECRET

const generarJWT = ( uid ) => {
    const payload = { uid };
    const token = jwt.sign(payload, secret, { expiresIn: '4h' })
    return token
}

module.exports = {
    generarJWT
}