
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/adopcion_perros', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error al conectar a MongoDB:'));
db.once('open', () => {
    console.log('Conectado a la base de datos MongoDB');
});

module.exports = mongoose;
