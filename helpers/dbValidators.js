const Role = require('../models/role')
const Usuario = require('../models/usuario')

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


module.exports = {
    checkRole,
    checkEmail,
    checkMongoId
}