// controllers/auth.js
// -------------------

// Asignación del tipado
const { response } = require('express');
// Usuario
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

// Definimos las rutas, para crear un nuevo usuario:
// -------------------------------------------------
const crearUsuario = async ( req, res = response ) => {

//    console.log( req.body );
    const { name, email, password } = req.body;
//    console.log( name, email, password );

    try {
        // Verificar email
        // 'findOne' va a buscar un email que sea igual al que tenemos en argumentos  
        const usuario = await Usuario.findOne({ email: email });
        if ( usuario ) {
            return res.status(400).json({
                ok  : false,
                msg : 'El usuario ya existe con ese email'
            });
        };

        // Crear el usuario con el modelo
        const dbUser = new Usuario( req.body );

        // Hashear la contraseña
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync( password, salt );

        // Generar el JsonWebToken
        const token = await generarJWT(dbUser.id, dbUser.name );

        // Generar usuario de DB
        await dbUser.save();

        // Generar respuesta exitosa
        return res.status(201).json({
            ok  : true,
            uid : dbUser.id,
            name: name,
            email,
            token    
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok  : false,
            msg : 'Contactar con el administrador'
        });        
    };
};


// Definimos las rutas, para realizar el login de  usuario:
// --------------------------------------------------------
const loginUsuario = async ( req, res = response ) => {

    const { email, password } = req.body;
//    console.log( email, password );

    try {
        // Verificar email
        const dbUser = await Usuario.findOne({ email: email });
        if ( !dbUser ) {
            return res.status(400).json({
                ok  : false,
                msg : 'Las credenciales no son válidas'
            });
        };

        // Confirmar si el password hace match. compareSync sirve para saber si una contraseña 
        // encriptada hace match con otra contraseña que ya tenemos encriptada. De esta forma validamos el 
        // password que recibimos contra el password que ya tenemos en la bdd(dbUser.password):
        const validPassword = bcrypt.compareSync( password, dbUser.password );
        if ( !validPassword ) {
            return res.status(400).json({
                ok  : false,
                msg : 'El password no es válido'
            });
        };

        // Aqui ya tenemos un usuario y contraseña válidos y por lo tanto podemos generar el JWT:
        // Generar el JsonWebToken
        const token = await generarJWT(dbUser.id, dbUser.name );

        // Generar respuesta exitosa
        return res.status(200).json({
            ok   : true,
            uid  : dbUser.id,
            name : dbUser.name,
            email: dbUser.email,
            token    
        });
      
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok  : false,
            msg : 'Contactar con el administrador 2'
        });        
    };
};


// Definimos las rutas, para validar/revalidar token de usuario:
// -------------------------------------------------------------
const revalidarToken = async ( req, res = response ) => {
 
    // leemos las propiedades uid y name del 'req' que hemos establecido en el middleware validarJWT
//    const { uid, name } = req;
    const { uid } = req;

    // Leer la base de datos y guardar toda la información del usuario en dbUser:
    const dbUser = await Usuario.findById(uid); 

    const token = await generarJWT( uid, dbUser.name );


    return res.json({
        ok  : true,
        uid,
        name: dbUser.name,
        email: dbUser.email,
        token
    });
};

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
};

