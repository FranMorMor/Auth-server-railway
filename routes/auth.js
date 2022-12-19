// Routes/Auth.js
// --------------

const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// Configurar el router
const router = Router();

// Definimos las rutas, para crear un nuevo usuario:
router.post( '/new', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({ min: 6 }),
    validarCampos   
], crearUsuario );

// Definimos las rutas, para realizar el login del usuario:
// Primer argumento es el path, segundo serán los middlewares y el ultimo es el controlador de la ruta:
router.post( '/',[ 
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({ min: 6 }),
    validarCampos
], loginUsuario);

// Definimos las rutas, para validar/revalidar token:
router.get( '/renew', validarJWT, revalidarToken);

// Exportamos el router
module.exports = router;
