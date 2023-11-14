const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

require('dotenv').config()

const secret = process.env.SECRET

const validarJWT = async (req,res,next) =>{

    const token = req.header('token');

    if(!token){
        return res.status(401).send({
            error: "Es necesario un token para la autenticación"
        });
    }

    try {
        const { uid } = jwt.verify(token, secret);

        const usuario = await Usuario.findById(uid);

        if(!usuario){
             return res.status(401).json({
                msg:"Token no válido - usuario no encontrado en la bbdd"
            })
        }

        // Verifico el estado del usuario cuyo JWT estoy verificando, si es false no puede eliminar
        if(!usuario.estado){
            return res.status(401).json({
                msg:"Token no válido - usuario con estado false"
            })
        }

        req.usuario = usuario
        
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
                message: "El token no es valido"
        })
    } 
}

module.exports = {
    validarJWT
}