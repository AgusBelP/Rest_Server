const {Producto, Categoria} = require("../models");

//Antes: validar el id ingresado en la ruta (que exista)


const getProducts = async(req,res) => {

    const { limite , desde } = req.query //ambos parámetros tienen valores por default en el express-validator antes de llegar al controlador

    const estado_true = {estado:true}

    const [total, productos] = await Promise.all([
        Producto.countDocuments(estado_true),
        Producto.find(estado_true)
                .limit(Number(limite))
                .skip(Number(desde))
                .populate('usuario', 'nombre')
                .populate('categoria', 'nombre')
    ])

    res.json({
        total,
        productos
    })
}

const getProduct = async(req,res) => {
    
    const id = req.params.id

    const productoDb = await Producto.findById(id)
                                        .populate('usuario', 'nombre')
                                        .populate('categoria', 'nombre')

    if(!productoDb || !productoDb.estado){
        return res.status(400).json({msg:'El producto buscado no existe o esta inactivo'})
    }

    res.json({
        productoDb
    })

}

const createProduct = async(req,res) => {

    const {estado, usuario, ...body} = req.body //me aseguro de ignorar si desde el front me envian el estado o el usuario

    const productoDb = await Producto.findOne({nombre : body.nombre});

    if(productoDb){
        return res.status(400).json({
            msg:`El producto ${productoDb.nombre} ya existe`
        })
    }

    //Genero el objeto a guardar

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario : req.usuario._id    //del validate-jwt ya viene el req.usuario y en la bbdd se guarda el id como _id
    
    }

    const producto = new Producto(data);

    // Guardo en bbdd

    await producto.save()

    res.status(201).json(producto)
}

// actualizar categoria por nombre y el nuevo nombre no tiene que existir

const updateProduct = async(req,res) => {
    
    const id = req.params.id;

    const {estado, usuario, ...data} = req.body

   if(data.nombre){                 //si cambian el nombre tengo que revisar que no este duplicado
        data.nombre = data.nombre.toUpperCase();

        const nombreProducto = await Producto.findOne({nombre : data.nombre});

        if(nombreProducto){
            return res.status(400).json({
                msg:`La categoría ${nombreProducto.nombre} ya existe`
            })
        }
    }

    data.usuario = req.usuario._id

    const nuevoProducto = await Producto.findByIdAndUpdate({_id: id},data,{new: true})

    res.status(201).json(nuevoProducto)
}

const deteleProduct = async(req,res) => {

    const id = req.params.id;

    // Cambio el estado a false de la categoría que se desea borrar
    const productoEliminado = await Producto.findByIdAndUpdate(id,{estado:false}, {new:true})

    res.json({
        msg:"La categoría eliminada es",
        productoEliminado})
}


module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deteleProduct
}