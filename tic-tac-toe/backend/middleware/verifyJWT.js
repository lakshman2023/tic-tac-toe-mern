const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    // const authHeader = req.headers.authorization || req.headers.Authorization;
    // if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    // const token = authHeader.split(' ')[1];
    // jwt.verify(
    //     token,
    //     process.env.ACCESS_TOKEN_SECRET,
    //     (err, decoded) => {
    //         if (err) return res.sendStatus(403); //invalid token
    //         req.user = decoded.UserInfo.username;
    //         req.roles = decoded.UserInfo.roles;
    //         next();
    //     }
    // );
    try {

        const authHeader = req.headers.authorization || req.headers.Authorization;

        if(!authHeader?.includes('Bearer ')){
            return res.status(401).send({error :`No token, authorization denied for req ${JSON.stringify(req)}`});
        }

        const token = authHeader.split(' ')[1];
        if(!token){
            return res.status(401).send({error : 'No token, authorization denied'});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        //console.log("JWT verified successfully");
        next();
    } catch (error) {
        return res.status(401).send({error : `Error occurred while validating JWT : ${error}`});
    }
}

module.exports = verifyJWT;