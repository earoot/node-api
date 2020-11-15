const express = require('express');
const router = express.Router();

//Controllers
const userController = require('../Controllers/UsersController');
const storeController = require('../Controllers/StoresController');
const accountController = require('../Controllers/AccountsController');

//Models
const User = require('../Models/UserModel');

const jwt = require('jsonwebtoken');
const helper = require('../helper.js');

const validateToken = async (req, res, next) => {
  if (req.headers["auth_token"]) {
    try {
      const accessToken = req.headers["auth_token"];
      const { userEmail, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
      if (exp < Date.now().valueOf() / 1000) {
        return helper.responseJson(res, 401, 'The session has expired', {});
      }
      const user = await User.query("email").eq(userEmail).exec();
      res.locals.user = user[0];
      next();
    } catch (error) {
      return helper.responseJson(res, 401, 'The session has expired', {});
    }
  } else {
    return helper.responseJson(res, 401, 'These credentials does not match our records', {});
  }
};

router.post('/login', userController.login);
router.post('/signup', userController.register);

router.use(validateToken).get('/stores/get', storeController.get);
router.use(validateToken).post('/stores/store', storeController.store);
router.use(validateToken).delete('/stores/remove/:id', storeController.remove);

router.use(validateToken).get('/accounts/get-info', accountController.getAccountInfo);
router.use(validateToken).put('/accounts/register-transaction', accountController.registerTransaction);

module.exports = router;
