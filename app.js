const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const routerUser = require('./routes/user')
const routerCard = require('./routes/card')
const bodyParser = require('body-parser')


const { PORT, MONGO_URI } = process.env

const app = express()

app.use((req, res, next) => {
  req.user = {
    _id: "656efdb8944be78d9c9e85ec"
  };
  next();
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect(MONGO_URI)

app.use('/', routerUser)
app.use('/', routerCard)

app.listen(PORT, () => {
  console.log('Сервер запущен');
});