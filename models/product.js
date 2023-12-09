const {Schema, model } = require('mongoose')

const ProductoSchema = Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre del producto es obligatorio'],
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
    },
    precio:{
        type: Number,
        default: 0
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion:{ type: String },
    disponible: { 
        type: Boolean,
        default: true
    },
    img:{
        type:String
    }
});

//creo un método como una función nomal porque la función flecha mantiene la referencia del 'this' fuera de la función y yo quiero hacer referencia a la instancia creada
ProductoSchema.methods.toJSON = function(){
   const {__v, estado,...data} =  this.toObject();
   
   return data //con esto por consola veo todo menos el __v y el estado
}


module.exports = model('Producto', ProductoSchema) // entre paréntesis (modelName, schema)