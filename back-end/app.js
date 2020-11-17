const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// const stuffRoutes = require('./routes/stuff');
// const userRoutes = require('./routes/user');

// const path = require('path');

const app = express();

// Connexion à la base de données
mongoose.connect('mongodb+srv://wa1:wa1@cluster0.leg1q.mongodb.net/cluster0?retryWrites=true&w=majority',
  { useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// CORS + parser pour exploiter les données plus facilement
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
app.use(bodyParser.json());

// app.use('/images', express.static(path.join(__dirname, 'images')));

// app.use('/api/stuff', stuffRoutes);
// app.use('/api/auth', userRoutes);

module.exports = app;