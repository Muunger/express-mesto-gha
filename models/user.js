const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле name должно быть заполнено'],
      minlength: [2, 'Минимальная длинна поля name - 2 символа'],
      maxlength: [30, 'Максимальная длинна поля name - 30 символов'],
    },
    about: {
      type: String,
      required: [true, 'Поле about должно быть заполнено'],
      minlength: [2, 'Минимальная длинна поля about - 2 символа'],
      maxlength: [30, 'Максимальная длинна поля about - 30 символов'],
    },
    avatar: {
      type: String,
      required: [true, 'Поле avatar должно быть заполнено'],
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL',
      },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

module.exports = mongoose.model('user', userSchema);
