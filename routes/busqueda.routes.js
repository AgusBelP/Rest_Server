const {Router} = require('express');
const { buscar } = require('../controllers/busqueda.controller');

const router = Router();

router.get('/:coleccion/:termino', buscar)


module.exports = router