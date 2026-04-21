require('dotenv').config();
const jwt = require('jsonwebtoken');
const { getTokenFromRequest } = require('../utils/authCookies');

const adminAuth = async(req,res,next) => {
    const token = getTokenFromRequest(req, 'admin');
    if(!token){
        return res.status(401).json({error:'No Token Provided'});
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        if(!decoded.isAdmin){
            return res.status(401).json({error: 'Access Denied'});
        }
        req.admin = decoded;
        next();
    }
    catch(err){
        res.status(401).json({message:'Invalid or Expired Token'});
    }
}

module.exports = adminAuth;
