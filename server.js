const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const passportJWT = require('./middlewares/passportJWT')();
const errorHandler = require('./middlewares/errorHandler');

const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/auth', { useNewUrlParser: true });

app.use(bodyParser.json());
app.use(passportJWT.initialize());

app.use('/api/auth', authRoutes);
app.use(errorHandler);

app.listen(8000, () => {
  console.log('Listening');
});
