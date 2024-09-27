
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./database');
const Perro = require('./models/Perro');
const Adoptante = require('./models/Adoptante');
const Adopcion = require('./models/Adopcion');

const app = express();
app.use(bodyParser.json());


app.post('/perros', async (req, res) => {
  const { nombre, raza, edad, tamaño } = req.body;
  try {
    const perro = new Perro({ nombre, raza, edad, tamaño });
    await perro.save();
    res.json(perro);
  } catch (error) {
    res.json({ error });
  }
});


app.post('/adoptantes', async (req, res) => {
  const { nombre, correo, direccion } = req.body;
  try {
    const adoptante = new Adoptante({ nombre, correo, direccion });
    await adoptante.save();
    res.json(adoptante);
  } catch (error) {
    res.json({ error});
  }
});


app.post('/adopciones', async (req, res) => {
  const { perroId, adoptanteId } = req.body;
  try {
    const perro = await Perro.findById(perroId);
    if (!perro || perro.estado_adopcion === 'adoptado') {
      return res.json({ message: 'El perro ya fue adoptado o no existe' });
    }

    const adopcion = new Adopcion({ perro: perroId, adoptante: adoptanteId });
    await adopcion.save();

   
    perro.estado_adopcion = 'adoptado';
    await perro.save();

    res.json(adopcion);
  } catch (error) {
    res.json({ error });
  }
});


app.get('/perros-disponibles', async (req, res) => {
  try {
    const perros = await Perro.find({ estado_adopcion: 'disponible' });
    res.json(perros);
  } catch (error) {
    res.json({ error });
  }
});


app.get('/adopciones', async (req, res) => {
  try {
    const adopciones = await Adopcion.find().populate('perro').populate('adoptante');
    res.json(adopciones);
  } catch (error) {
    res.json({ error });
  }
});


app.listen(3000, () => {
  console.log('Servidor ejecutándose en http://localhost:3000');
});
