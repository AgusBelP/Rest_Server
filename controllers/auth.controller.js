const Usuario = require("../models/usuario");
const bcrypt = require('bcryptjs');

const { generarJWT } = require("../helpers/generarjwt");
const { googleVerify } = require("../helpers/google-verify");


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

const googleSignIn = async(req,res) => {

    const { id_token } = req.body;

    try {

        const {nombre, img, correo} = await googleVerify(id_token)

        //Verificación de existencia del correo en la bbdd
        let usuario = await Usuario.findOne({correo})

        if(!usuario){
            // Tengo que crear el usuario
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true,
                role:'USER_ROLE'
            }

            usuario = new Usuario(data);

            await usuario.save();
        }

        // Si el usuario en bbdd tiene el estado en false no lo dejo loguearse
        if(!usuario.estado){
            return res.status(401).json({
                msg:'Hable con el administrador, usuario bloqueado'
            });
        }

        //Generación de JWT
        const token = await generarJWT( usuario.id);

        res.json({
        usuario,
        token
    })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'El token no se pudo verificar'
        })
    }
}

module.exports ={
    login,
    googleSignIn
}