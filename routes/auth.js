/*
    path: api/login
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { crearUsuario, login, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/new', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El Correo Electrónico es obligatorio').trim().not().isEmpty(),
    check('email', 'El Correo Electrónico no es válido').trim().isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('password', 'La contraseña debe tener más de 5 caracteres').isLength({min: 6}),
    validarCampos
], crearUsuario);

router.post('/', [
    check('email', 'El Correo Electrónico es obligatorio').trim().not().isEmpty(),
    check('email', 'El Correo Electrónico no es válido').trim().isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('password', 'La contraseña debe tener más de 5 caracteres').isLength({min: 6}),
    validarCampos
], login  );

// validarJWT
router.get('/renew', validarJWT, renewToken);

module.exports = router;