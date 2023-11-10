const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo:{
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'La clave es obligatoria']
    },
    img:{
        type: String
    },
    role:{
        type: String,
        required: [true, 'El rol es obligatorio']
    },
    estado:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    },
});

//creo un método como una función nomal porque la función flecha mantiene la referencia del 'this' fuera de la función y yo quiero hacer referencia a la instancia creada
UsuarioSchema.methods.toJSON = function(){
   const {__v, password, ...usuario} =  this.toObject();
   return usuario //con esto por consola veo todo menos el __v y la contraseña
}

module.exports=  model('Usuario', UsuarioSchema )
