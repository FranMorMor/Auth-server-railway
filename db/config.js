// const { Mongoose } = require("mongoose");
/*
const mongoose = require("mongoose");

const dbConnection = () => {

// esperamos a que la base de datos esté conectada para continuar:        
     mongoose.connect( process.env.BD_CNN, {
        useNewUrlParser: true,
        useUnifiedTopology: true
//        useCreateIndex: true
    }).then( () =>
        console.log('Base de datos online')).catch( err => console.log(err));
}
*/

const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        await mongoose.connect(process.env.BD_CNN, {
            useNewUrlParser: true
            /*useUnifiedTopology: true
            useCreateIndex: true*/
        });

       console.log ('se ha cargado la BBDD')

    } catch (error) {
        console.log(error);
        throw new Error('se ha producido un error en el servidor');
    }
};


module.exports = {
    dbConnection
};
