const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
dotenv.config();

//Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

//Connect
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true } ,() => 
  console.log('Connected to DB.')
);

//Middlewares
app.use(express.json());

//Routes Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000, () => console.log('Server online on port 3000'));