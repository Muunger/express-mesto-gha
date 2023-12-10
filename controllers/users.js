const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('http2').constants;
const User = require('../models/user');

const { NotFoundError } = require('../utils/NotFoundError');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(HTTP_STATUS_OK).send(users);
  } catch (error) {
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(
      () => new NotFoundError('Пользователь по указанному id не найден'),
    );
    return res.status(HTTP_STATUS_OK).send(user);
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные' });
      case 'NotFoundError':
        return res.status(error.status).send({ message: error.message });
      default:
        return res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ error: error.message });
    }
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    return res.status(HTTP_STATUS_CREATED).send(newUser);
  } catch (error) {
    if (res.status(HTTP_STATUS_BAD_REQUEST)) {
      return res.send({
        message: 'Переданы некорректные данные при создании пользователя',
      });
    }
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ error: error.message });
  }
};

const updateUserInfo = async (req, res) => {
  try {
    const { name, about } = req.body;
    const userInfo = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    ).orFail(
      () => new NotFoundError('Пользователь по указанному id не найден'),
    );
    return res.status(HTTP_STATUS_OK).send(userInfo);
  } catch (error) {
    switch (error.name) {
      case 'CaseError':
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      case 'ValidationError':
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Допустимое количество символов от 2 до 30',
        });
      case 'NotFoundError':
        return res.status(error.status).send({ message: error.message });
      default:
        return res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ error: error.message });
    }
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const userAvatar = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    ).orFail(
      () => new NotFoundError('Пользователь по указанному id не найден'),
    );
    return res.status(HTTP_STATUS_OK).send(userAvatar);
  } catch (error) {
    switch (error.name) {
      case 'CaseError':
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      case 'NotFoundError':
        return res.status(error.status).send({ message: error.message });
      default:
        return res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ error: error.message });
    }
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
};
