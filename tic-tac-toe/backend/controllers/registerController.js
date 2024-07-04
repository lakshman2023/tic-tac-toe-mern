const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerNewUser = async (req, res) => {
    const {email, username, password} = req.body;
    if(!username || !password) {
        return res.status(400).json({'message' : 'Username and password are required'});
    }

    const foundUser = await User.findOne({username : username}).exec();
    if(foundUser){
        return res.status(409).json({'message' : 'Username already taken!'});
    }

    try {
        const hashedPwd = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            "username" : username,
            "email" : email,
            "password" : hashedPwd,
            "rating" : 1000
        });

        const payload  = {
            user : {
                id : newUser._id
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {'expiresIn' : '1h'});

        return res.status(201).send({token});
    } catch (error) {
        console.log(error);
        return res.status(500).json({'message' : error.message});
    }
};

module.exports = {registerNewUser};