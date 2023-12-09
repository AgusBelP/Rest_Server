const { Router } = require("express");
const { check, query } = require("express-validator");

const { validarJWT, validaCampos, esAdmin } = require("../middlewares");

const { checkProductId, checkCategoria } = require("../helpers/dbValidators");

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deteleProduct,
} = require("../controllers/products.controller");

const router = Router();

// Obtener todas los productos - publico
router.get(
  "/",
  [
    query("desde", 'El valor "desde" de la paginación debe ser un número').default(0).isNumeric(),
    query("limite", "La cantidad de categorias a mostrar por página debe ser un número").default(5).isNumeric(),
  ],
  validaCampos,
  getProducts
);

// Obtener un producto por id - publico
router.get(
  "/:id",
  [check("id", "No es un id válido").isMongoId(), check("id").custom(checkProductId), validaCampos],
  getProduct
);

// Crear un producto - privado para cualquiera con un token válido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("precio", "El precio debe ser un número").isInt({ min: 10 }),
    check("categoria", "No es un id de categoria válido").isMongoId(),
    check("categoria").custom(checkCategoria),
    validaCampos,
  ],
  createProduct
);

// Actualizar un producto por id - privado para cualquiera con un token válido
router.put(
  "/:id",
  validarJWT,
  check("id", "No es un id válido").isMongoId(),
  check("id").custom(checkProductId),
  validaCampos,
  updateProduct
);

// Eliminar una categoría por id - privado solo válido para un admin. Cambio de estado, no borro en la bbdd
router.delete(
  "/:id",
  [
    validarJWT,
    esAdmin,
    check("id", "No es un id válido").isMongoId(),
    check("id").custom(checkProductId),
    validaCampos,
  ],
  deteleProduct
);

module.exports = router;
