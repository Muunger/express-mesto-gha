const routerUser = require('express').Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

routerUser.get('/users', getUsers);

routerUser.get('/users/:userId', getUserById);

routerUser.post('/users', createUser);

routerUser.patch('/users/me', updateUserInfo);

routerUser.patch('/users/me/avatar', updateUserAvatar);

module.exports = routerUser;
