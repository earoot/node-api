const User = require('../Models/UserModel');
const helper = require('../helper.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const hashPassword = async (password) => {
  var salt = bcrypt.genSaltSync(10);
  return await bcrypt.hashSync(password, salt);
}

const validatePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compareSync(plainPassword, hashedPassword);
}

const validateEmail = (email) => {
  return new Promise(function(resolve, reject) {
    User.query("email").eq(email).exec((error, results) => {
        if (error) {
            console.error(error);
            return reject(error);
        }
        resolve(results['count']);
    });
  });
}

exports.register = async (req, res, next) => {
  const { email, password } = req.body;

  validateEmail(email).then(async (result) => {
    if(result>0){
      return helper.responseJson(res, 409, 'This email has already been registered', {});
    }

    const hashedPassword = await hashPassword(password);
    const user = new User({ email:email, password: hashedPassword});
    await user.save();

    return helper.responseJson(res, 201, 'The user has been successfully created', user);
  });
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.query("email").eq(email).exec();
    if (user.count===0) return helper.responseJson(res, 401, 'These credentials does not match our records', {});

    const validPassword = await validatePassword(password, user[0].password);
    if (!validPassword) return helper.responseJson(res, 401, 'These credentials does not match our records', {});

    const accessToken = jwt.sign({ userEmail: user[0].email }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });
    let userUpdated = await User.update({email: email}, { auth_token: accessToken });

    return helper.responseJson(res, 200, 'Login successfully', userUpdated, 'user');
  } catch (error) {
    next(error);
  }
};
