const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const loginUser = async (req, res) => {
    try {
        const {username, password} = req.body;

        const foundUser = await User.findOne({username : username}).exec();
        if(!foundUser){
            return res.status(400).send({error : 'Invalid username'});
        }

        const match = bcrypt.compare(password, foundUser.password);

        if(!match){
            return res.status(400).send({error : 'Invalid credentials'});
        }

        const payload = {
            user : {
                id : foundUser._id
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {'expiresIn' : '1h'});

        res.send({token});
    } catch (error) {
        res.status(500).send({error : `Server error while logging in: ${error}`});
    }

};

module.exports = {loginUser};