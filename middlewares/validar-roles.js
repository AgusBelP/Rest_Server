const esAdmin = (req,res,next) => {

    if(!req.usuario){
        return res.status(500).json({
            msg: 'Se quiere validar el token primero'
        })
    }
    
    const {role, nombre} = req.usuario

    if(role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg:`El ${nombre} no tiene los permisos necesarios`
        })
    }

    next()

};

const tieneRol = (... roles) => {
    return(req,res,next) =>{
        
        if(!req.usuario){
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validra el token primero'
            })
        }

        if(!roles.includes(req.usuario.role)){
        return res.status(401).json({
            msg:`El servicio requiere uno de estos roles: ${roles}`
            })
        }

        next()
    }
    
}

module.exports = {
    esAdmin,
    tieneRol
}