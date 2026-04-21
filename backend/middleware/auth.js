require('dotenv').config();
const jwt = require('jsonwebtoken');
const { getTokenFromRequest } = require('../utils/authCookies');


exports.auth = (req,res,next) => {
    const token = getTokenFromRequest(req, 'user');
    if(!token){
        return res.status(401).json({error:'No Token Provided'});
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(err){
        res.status(401).json({error:'Invalid or Expired Token Provided'});
    }
};
