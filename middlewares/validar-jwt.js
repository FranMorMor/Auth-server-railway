// validar-jwt.js
// --------------
const { response } = require("express");
const jwt = require('jsonwebtoken'); // importamos el objeto jwt del paquete 'jsonwebtoken'

const validarJWT = ( req, res = response, next ) => {

    // leemos los 'Header'
    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            ok  : false,
            msg : 'Error en el token'
        });
    };

    try {
        // si este jwb es verificado obtenemos un objeto donde estará el payload del cual nos quedaremos
        // con el 'uid' y el 'name':
        const { uid, name } = jwt.verify( token, process.env.SECRET_JWT_SEED ); 
        // console.log( uid, name);

        // la 'req' de este middleware es la misma 'req' que en el archivo 'controllers/auth.js' ya que 
        // todos los objetos en JS se pasan por referencia: 
        req.uid  = uid;
        req.name = name;
        
    } catch (error) {
        return res.status(401).json({
            ok  : false,
            msg : 'Token no válido'
        });        
    }

    // Todo OK
    next();
}

module.exports = {
    validarJWT
}
