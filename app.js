const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Init app
const app = express();

//DECLARE ROUTES
const products = require('./routes/api/searchorders');

// Use Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


// DB Config
const db = require('./config/database').mongoURI;


// Connect to MongoDB
mongoose
  .connect(
    db, 
    { useFindAndModify: false })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

//USE ROUTES
app.use('/api/product', products);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

// @route   GET /
// @desc    /
// @access  Public
app.get('/', (req, res) => res.json({ msg: 'ganymede' }));