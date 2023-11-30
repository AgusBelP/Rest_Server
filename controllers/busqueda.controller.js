const {ObjectId} = require('mongoose').Types

const {Usuario, Categoria, Producto} = require('../models/index')

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'users'
];

const buscarUsuarios = async(termino ="", res) => {

    // busqueda por userId

    const esMongoId = ObjectId.isValid(termino); //mongoose ayuda con esto, si el termino es un id de mongo valido devuelve true, sino false

    if(esMongoId){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }

    // busqueda por nombre o correo del usuario

    const regExp = new RegExp(termino, 'i'); //expresión regular, con esto des sensibilizo la búsqueda asi si busco "Test" encuentra todos los usuarios cuyo nombre incluya esa palabra en vez de tener que escribir literal el nombre. Lo mismo con el mail

    const usuarios = await Usuario.find({   //model.find siempre devuelve un arreglo
        $or:[
            {nombre:regExp},
            {correo: regExp}
        ],
        $and: [{estado:true}]

    }); 

    res.json({
            results: usuarios
    })
}

const buscarCategorias = async(termino ="", res) => {

     // busqueda por categoriaId
    
    const esMongoId = ObjectId.isValid(termino); //mongoose ayuda con esto, si el termino es un id de mongo valido devuelve true, sino false

    if(esMongoId){
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }

    // busqueda por nombre 

    const regExp = new RegExp(termino, 'i'); //expresión regular, con esto des sensibilizo la búsqueda asi si busco "Test" encuentra todos los usuarios cuyo nombre incluya esa palabra en vez de tener que escribir literal el nombre. Lo mismo con el mail

    const categorias = await Categoria.find({nombre:regExp, estado:true});   //model.find siempre devuelve un arreglo

    res.json({
            results: categorias
    })

}

const buscarProductos = async(termino ="", res) => {

     // busqueda por categoriaId
    
    const esMongoId = ObjectId.isValid(termino); //mongoose ayuda con esto, si el termino es un id de mongo valido devuelve true, sino false

    if(esMongoId){
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        })
    }

    // busqueda por nombre 

    const regExp = new RegExp(termino, 'i'); //expresión regular, con esto des sensibilizo la búsqueda asi si busco "Test" encuentra todos los usuarios cuyo nombre incluya esa palabra en vez de tener que escribir literal el nombre. Lo mismo con el mail

    const productos = await Producto.find({nombre:regExp, estado:true}).populate('categoria', 'nombre');  //model.find siempre devuelve un arreglo
      

    res.json({
            results: productos
    })

}


const buscar = (req,res) => {

    const { coleccion, termino} = req.params

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg:`Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        case 'users':
            buscarUsuarios(termino, res);
            break;
        default:
            res.status(500).json({msg:'Se me olvidó hacer esta búsqueda'})
            break;
    }

}

module.exports = {
    buscar
}