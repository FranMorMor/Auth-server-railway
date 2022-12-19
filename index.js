// Index.js

// importamos el paquete de Express
const express = require('express');
const cors = require('cors');
const path = require('path');   
const { dbConnection } = require('./db/config');
const { response } = require('express');

// accedemos al archivo '.env' con las variables de entorno.
require('dotenv').config();

console.log( process.env );

// creamos el servidor/aplicación de Express
const app = express();

// Conexión a la Base de datos
dbConnection();

// Directorio Público (acceso a la carpeta 'public')
app.use( express.static('public') )

// CORS
app.use( cors() );

// Nos permite leer la información que recibimos en el body
app.use( express.json() );

/* Lo asteriscamos porque era un ejemplo
// GET, cuando recibamos una petición al '/' se ejecutará esta función:
app.get('/', ( req, res ) => {
//    console.log('Petición en el /');
//  res.status(404/500).json({
    res.json({
        ok  : true,
        msg : 'Todo Ok',
        uid : 1234
    });
});
*/

// Configuramos nuestras rutas con un middleware de Express (use), que es una función que se ejecuta cuando el
// interprete valida nuestras lineas de código:
app.use( '/api/auth', require( './routes/auth' ) );

// Manejar otras rutas; para atrapar con el comodín aquellas rutas que no tengamos definidas en nuestro 
// backend. Tendremos que definir el path donde tenemos nuestro 'index.html':
// __dirname es el path donde está desplegado nuestro servidor
app.get('*', (req, res = response) => {
    res.sendFile( path.resolve( __dirname, 'public/index.html' ) );
})

// levantamos la aplicación de Express escuchando todo lo que nos llegue por el puerto = 4000 por ejemplo 
// y añadimos una función callback que se ejecutará cuando esté levantado nuestro servidor.
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
});





