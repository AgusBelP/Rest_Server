const {Schema, model } = require('mongoose')

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre de la categoria es obligatorio'],
        unique : true
    },
    estado:{
        type:Boolean,
        default: true,
        required: true
    },
    usuario:{
        type:Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }

});

//creo un método como una función nomal porque la función flecha mantiene la referencia del 'this' fuera de la función y yo quiero hacer referencia a la instancia creada
CategoriaSchema.methods.toJSON = function(){
   const {__v, estado,...data} =  this.toObject();
   
   return data //con esto por consola veo todo menos el __v y el estado
}


module.exports = model('Categoria', CategoriaSchema) // entre paréntesis (modelName, schema)