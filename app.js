// Bring Express
const express = require('express');
// Bring Mongoose
const mongoose = require('mongoose');
// Bring Body Parser
const bodyParser = require('body-parser');

//Init app
const app = express();

//DECLARE ROUTES
const products = require('./routes/api/searchorders');

// Use Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))

// DB Config
const db = require('./config/database').mongoURI;

// SET this function
mongoose.set('useFindAndModify', false);
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

