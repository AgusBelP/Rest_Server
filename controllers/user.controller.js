const { response } = require('express');
const bcrypt = require('bcryptjs')

const Usuario = require('../models/usuario');
const { Promise } = require('mongoose');


const getUser = async(req,res = response) =>{

    const { limite , desde } = req.query //ambos parámetros tienen valores por default en el express-validator antes de llegar al controlador
    const estado_true = { estado:true}

    /*  Lo siguiente lo resumo en el Promise.all pero lo dejo para referencia

    const usuarios = await Usuario.find(estado_true).limit(Number(limite)).skip(Number(desde));

    const total = await Usuario.countDocuments(estado_true); */

    const [ total, usuarios] = await Promise.all([
        Usuario.countDocuments(estado_true),
        Usuario.find(estado_true).limit(Number(limite)).skip(Number(desde))
    ])

    res.json({
        total,
        usuarios
    })
}

const postUser = async(req,res) =>{

    const { nombre, correo, password, role} = req.body;
    const usuario = new Usuario({nombre, correo, password, role});

    //Hash de la contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt)

    // Guardado en db
    await usuario.save();

    res.json({
        msg:'post API - controlador',
        usuario
    })
}

const putUser = async(req,res) =>{

    const id = req.params.id

    // me quedo con la parte que me interesa. Google indica si inició sesion con google la primra vez, eso no va a cambiar. El correo tampoco.
    const {_id, password, google, correo, ...resto} = req.body;

    if(password){
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password, salt)
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto)

    res.status(201).json(usuario)
}

const deleteUser = async (req,res) =>{

    const id = req.params.id;

    // Borrar el registro físicamente de la base
    //const usuario = await Usuario.findByIdAndDelete(id)

    // Eliminación del registro para la aplicación por cambio de estado, utilizar ESTA forma
    const usuario = await Usuario. findByIdAndUpdate(id,{estado:false})

    res.json({
        msg:`Se elimina el usuario de id ${id}`,
        usuario        
    })
}

module.exports = {
    getUser,
    postUser,
    putUser,
    deleteUser
}