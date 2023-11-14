const Usuario = require("../models/usuario");
const bcrypt = require('bcryptjs');

const { generarJWT } = require("../helpers/generarjwt");


const login = async (req, res) => {

    const {correo,password} = req.body;

    try {
        
        // Verificar si el email existe
        const usuarioInDb = await Usuario.findOne({correo})
        if(!usuarioInDb){
            return res.status(400).json({ msg:'Usuario/password incorrectos -1'})
        }
        // Verificar si el usuario esta activo
        if(usuarioInDb.estado === false){
            return res.status(400).json({ msg:'Usuario/password incorrectos - 2'})
        }
        // Verificar la contraseña
        const checkPassword = await bcrypt.compare(password, usuarioInDb.password)
        if(!checkPassword){
            return res.status(400).json({ msg:'Usuario/password incorrectos - 3'})
        }
        //Generación de JWT
        const token = await generarJWT( usuarioInDb.id);

        res.json ({
        msg:'AUTENTICACION EXITOSA',
        usuarioInDb,
        token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:'Algo salió mal'
        })
    }
}

module.exports ={
    login
}