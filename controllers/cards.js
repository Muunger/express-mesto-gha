const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('http2').constants;
const Card = require('../models/card');
const { NotFoundError } = require('../utils/NotFoundError');

const getCard = async (req, res) => {
  try {
    const cards = await Card.find({}).populate(['owner']);
    return res.status(HTTP_STATUS_OK).send(cards);
  } catch (error) {
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ error: error.message });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const newCard = await Card.create({ name, link, owner: req.user._id });
    return res.status(HTTP_STATUS_CREATED).send(newCard);
  } catch (error) {
    if (res.status(HTTP_STATUS_BAD_REQUEST)) {
      return res.send({
        message: 'Переданы некорректные данные при создании карточки',
      });
    }
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ error: error.message });
  }
};

const deleteCard = async (req, res) => {
  try {
    const delCard = await Card.findByIdAndDelete(req.params.cardId).orFail(
      () => new NotFoundError('Передан несуществующий id карточки'),
    );
    return res.status(HTTP_STATUS_OK).send(delCard);
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Карточка с указанным id не найдена' });
      case 'NotFoundError':
        return res.status(error.status).send({ message: error.message });
      default:
        return res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ error: error.message });
    }
  }
};

const likeCard = async (req, res) => {
  try {
    const like = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).orFail(() => new NotFoundError('Передан несуществующий id карточки'));
    return res.status(HTTP_STATUS_OK).send(like);
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при постановки/снятия лайка',
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

const dislikeCard = async (req, res) => {
  try {
    const dislike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).orFail(() => new NotFoundError('Передан несуществующий id карточки'));
    return res.status(HTTP_STATUS_OK).send(dislike);
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при постановки/снятия лайка',
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
  getCard,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
