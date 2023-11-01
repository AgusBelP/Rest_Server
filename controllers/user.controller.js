const { response } = require('express')

const getUser = (req,res = response) =>{

        const { nombre = "no name", id} = req.query; //si no envío el nombre en el query param lo define como no name

        res.json({
            msg:'get API - controlador',
            nombre,
            id
        })
    }

const postUser = (req,res) =>{

    const { nombre, edad } = req.body;

    res.json({
        msg:'post API - controlador',
        nombre,
        edad
    })
}

const putUser = (req,res) =>{

    const id = req.params.id

    res.status(201).json({
        msg:'put API - controlador',
        id
    })
}

const deleteUser = (req,res) =>{
    res.json({
        msg:'delete API - controlador'
    })
}

module.exports = {
    getUser,
    postUser,
    putUser,
    deleteUser
}