const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');

const loggerMiddleware = require('./middlewares/loggerMiddleware');

const router = require('./routes');

const app = express();

app.use(express.static('media'));
app.use(cors({ credentials: true, origin: process.env.CLIENT }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(loggerMiddleware);
app.use('/api', router);

const startApp = (req, res) => {
  try {
    mongoose.set('strictQuery', false);
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log('MongoDB connected'));
      
    const PORT = process.env.PORT ?? 5000;
    app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
  } catch (error) {
    req.logger.error(error);
  }
};

startApp();
