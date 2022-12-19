// jwt.js
// ------

const jwt = require('jsonwebtoken'); 


const generarJWT = ( uid, name, email ) => {

    const payload = { uid, name, email };

// creamos una promesa donde internamente ejecutamos la firma de ese JWT:    
    return new Promise( (resolve, reject) => {
        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '24h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject( err );
            } else {
                resolve( token );
            }            
        })
    })
}

module.exports = {
    generarJWT
}
