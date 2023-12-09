const { Router } = require("express");
const { check } = require("express-validator");
const { login, googleSignIn } = require("../controllers/auth.controller");
const { validaCampos } = require("../middlewares/validarcampos");

const router = Router();

router.post(
  "/login",
  [
    check("correo", "El correo es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validaCampos,
  ],
  login
);

router.post("/google", [check("id_token", "El id token es necesario").not().isEmpty(), validaCampos], googleSignIn);

module.exports = router;
