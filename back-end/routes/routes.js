const express = require('express');
const axios = require('axios');
const { MongoClient } = require('mongodb');
const router = express.Router();
const Log = require('../models/logs');

// MongoDB connection
const url = process.env.MONGO_URL || 'mongodb://localhost:27017';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
let db;

// Connect to MongoDB
client.connect((err) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
  } else {
    console.log('Connected to MongoDB');
    db = client.db('car_logs');
  }
});

// GET api/listCars
router.get('/api/listCars', async (req, res) => {
  try {
    const response = await axios.get('http://api-test.bhut.com.br:3000/api/cars');
    res.json(response.data);
  } catch (err) {
    console.error('Error fetching data from external API:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST api/createCar
router.post('/api/createCar', async (req, res) => {
  const carData = req.body;
  axios.post('http://api-test.bhut.com.br:3000/api/cars', carData)
    // .then((response) => {
    //   const createdCar = response.data;
    //   console.log(response.data);

    //   // Salvando a chamada de API no banco de dados
    //   const log = new Log({
    //     data_hora: new Date(),
    //     car_id: createdCar.id,
    //   });

    //   log.save()
    // })
    .catch((error) => {
      console.error('Erro na chamada para a API externa:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    });
});

// GET api/logs
router.get('/api/logs', async (req, res) => {
  try {
    const logs = await db.collection('logs').find().toArray();
    res.json(logs);
  } catch (err) {
    console.error('Error fetching data from model Logs:');
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
