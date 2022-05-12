const express = require('express');
const {check} = require('express-validator');
const router = express.Router();
const {validarJWT} = require('../middlewares/validar-jwt');
const {validarCampos} = require('../middlewares/validar-campos');
const {isDate} = require('../helper/isDate');

const {getEventos, crearEvento, actualizarEvento, eliminarEvento} = require('../controllers/events');

// Todas tienen que validar token
// Obtener eventos

router.use(validarJWT);
/*
router.get('/', validarJWT, getEventos);
*/

router.get('/', getEventos);

router.post('/',
            [
                check('title', 'el titulo es obligatorio').not().isEmpty(),
                check('start', 'Fecha inicio es obligatorio').custom(isDate),
                check('end', 'Fecha inicio es obligatorio').custom(isDate),
                validarCampos
            ],  
            crearEvento);

router.put('/:id', actualizarEvento);

router.delete('/:id', eliminarEvento);

module.exports = router;