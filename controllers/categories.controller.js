const {Categoria} = require("../models");

//Antes: validar el id ingresado en la ruta (que exista)


const getCategorias = async(req,res) => {

    const { limite , desde } = req.query //ambos parámetros tienen valores por default en el express-validator antes de llegar al controlador

    const estado_true = {estado:true}

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(estado_true),
        Categoria.find(estado_true).limit(Number(limite)).skip(Number(desde)).populate('usuario', 'nombre')
    ])

    res.json({
        total,
        categorias
    })
}

const getCategoria = async(req,res) => {
    
    const id = req.params.id

    const categoriaDb = await Categoria.findById(id).populate('usuario', 'nombre')

    if(!categoriaDb || !categoriaDb.estado){
        return res.status(400).json({msg:'La categoría buscada no existe o esta inactiva'})
    }

    res.json({
        categoriaDb
    })

}

const crearCategoria = async(req,res) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDb = await Categoria.findOne({nombre});

    if(categoriaDb){
        return res.status(400).json({
            msg:`La categoría ${categoriaDb.nombre} ya existe`
        })
    }

    //Genero el objeto a guardar

    const data = {
        nombre,
        usuario : req.usuario._id    //del validate-jwt ya viene el req.usuario y en la bbdd se guarda el id como _id
    }

    const categoria = new Categoria(data);

    // Guardo en bbdd

    await categoria.save()

    res.status(201).json(categoria)
}

// actualizar categoria por nombre y el nuevo nombre no tiene que existir

const actualizarCategoria = async(req,res) => {
    
    const id = req.params.id;

    const {estado, usuario, ...data} = req.body

    data.nombre = data.nombre.toUpperCase();

    data.usuario = req.usuario._id

    const nombreCategoria = await Categoria.findOne({nombre : data.nombre});

    if(nombreCategoria){
        return res.status(400).json({
            msg:`La categoría ${nombreCategoria.nombre} ya existe`
        })
    }

    const nuevaCategoria = await Categoria.findByIdAndUpdate({_id: id}, {nombre: data.nombre}, {new: true})
                                            .populate('usuario', 'nombre')

    res.status(201).json(nuevaCategoria)
}

const eliminarCategoria = async(req,res) => {

    const id = req.params.id;

    // Cambio el estado a false de la categoría que se desea borrar
    const categoriaEliminada = await Categoria.findByIdAndUpdate(id,{estado:false}, {new:true})

    res.json({
        msg:"La categoría eliminada es",
        categoriaEliminada})
}


module.exports = {
    getCategorias,
    getCategoria,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
}