const router = require('express').Router();
const { loginUser } = require('../controllers/loginController');
const { registerNewUser } = require('../controllers/registerController');

router.post('/register', registerNewUser);

router.post('/login', loginUser);

router.post('/logout', (req, res) => { 
    res.send({ message: 'Logout successful. Token removed from client side.' });
});

module.exports = router;