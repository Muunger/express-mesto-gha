const express = require('express')
const mongoose = require('mongoose')
const routerUser = require('./routes/user')
const routerCard = require('./routes/card')
const bodyParser = require('body-parser')
const { HTTP_STATUS_NOT_FOUND } = require('http2').constants

const { PORT = 3000 } = process.env

const app = express()

app.use((req, res, next) => {
  req.user = {
    _id: "656efdb8944be78d9c9e85ec"
  };
  next();
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect("mongodb://127.0.0.1:27017/mestodb")

app.use('/', routerUser)
app.use('/', routerCard)
app.use('/', (req, res) => {
  return res.status(HTTP_STATUS_NOT_FOUND).send({ message: "Страница не найдена"})

})

app.listen(PORT, () => {
  console.log('Сервер запущен');
});