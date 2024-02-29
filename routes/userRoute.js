const express = require('express');
const user_Routes = express();
const auth = require('../middleware/auth');

const user_Controllers = require('../controllers/userController');

user_Routes.use(express.json());
user_Routes.use(express.urlencoded({ extended: true }));

user_Routes.post('/registation', user_Controllers.registation);

user_Routes.get('/refress-token',auth,user_Controllers.refressToken)

user_Routes.post('/login', user_Controllers.userLogin);

user_Routes.post('/logout', user_Controllers.userLogout);


module.exports = user_Routes;