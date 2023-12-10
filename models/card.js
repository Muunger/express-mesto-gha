const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле name должно быть заполнено'],
      minlength: [2, 'Минимальная длинна поля name - 2 символа'],
      maxlength: [30, 'Максимальная длинна поля name - 30 символов'],
    },
    link: {
      type: String,
      required: [true, 'Поле link должно быть заполнено'],
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'Поле owner должно быть заполнено'],
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('card', cardSchema);
