const { Categoria, Role, Usuario, Producto } = require('../models');


const checkRole = async (role = '') => {
        const existeRol = await Role.findOne({role});
        if(!existeRol){
            throw new Error(`El rol ${role} no es válido`)
        }
};

const checkEmail =  async(correo = '') => {
    const existeEmail = await Usuario.findOne({ correo: correo })
    if(existeEmail){
        throw new Error(`El correo ${correo} ya se encuentra registrado`)
    }
}

const checkMongoId =  async(id) => {
    const existeId = await Usuario.findById(id)
    if(!existeId){
        throw new Error(`El id ${id} no existe`)
    }
}

const checkCategoria =  async(id) => {
    const existeCategoria = await Categoria.findById(id)
    if(!existeCategoria){
        throw new Error(`El id ${id} de categoría buscada no existe`)
    }
}


const checkProductId =  async(id) => {
    const existeProducto = await Producto.findById(id)
    if(!existeProducto){
        throw new Error(`El id ${id} de producto buscado no existe`)
    }
}

const checkColecciones = async(coleccion ="", colecciones = []) => {

    if(!colecciones.includes(coleccion)){
        throw new Error(`La colección ${coleccion} no es permitida. Las colecciones son ${colecciones}`)
    }

    return true
}


module.exports = {
    checkRole,
    checkEmail,
    checkMongoId,
    checkCategoria,
    checkProductId,
    checkColecciones
}