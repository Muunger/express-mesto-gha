const User = require("../models/user");
const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require("http2").constants;

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(HTTP_STATUS_OK).send(users);
  } catch (error) {
    if (res.status(HTTP_STATUS_NOT_FOUND)) {
      return res.send({ message: "Пользователи не найдены" });
    }
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    return res.status(HTTP_STATUS_OK).send(user);
  } catch (error) {
    if (res.status(HTTP_STATUS_NOT_FOUND)) {
      return res.send({ message: "Пользователь по указанному id не найден" });
    }
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    return res.status(HTTP_STATUS_CREATED).send(newUser);
  } catch (error) {
    if (res.status(HTTP_STATUS_BAD_REQUEST)) {
      return res.send({
        message: "Переданы некорректные данные при создании пользователя",
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
      { new: true, runValidators: true }
    );
    return res.status(HTTP_STATUS_OK).send(userInfo);
  } catch (error) {
    if (res.status(HTTP_STATUS_BAD_REQUEST)) {
      return res.send({
        message: "Переданы некорректные данные при обновлении профиля",
      });
    }
    if (res.status(HTTP_STATUS_NOT_FOUND)) {
      return res.send({ message: "Пользователь с указанным id не найден" });
    }
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ error: error.message });
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const userAvatar = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true }
    );
    return res.status(HTTP_STATUS_OK).send(userAvatar);
  } catch (error) {
    if (res.status(HTTP_STATUS_BAD_REQUEST)) {
      return res.send({
        message: "Переданы некорректные данные при обновлении профиля",
      });
    }
    if (res.status(HTTP_STATUS_NOT_FOUND)) {
      return res.send({ message: "Пользователь с указанным id не найден" });
    }
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ error: error.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
};
