require('dotenv').config();
const jwt = require('jsonwebtoken');

const adminAuth = async(req,res,next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({error:'No Token Provided'});
    }

    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        if(!decoded.isAdmin){
            return res.status(401).json({error: 'Access Denied'});
        }
        req.admin = decoded;
        next();
    }
    catch(err){
        res.status(500).json({message:'Invalid or Expired Token'});
    }
}

module.exports = adminAuth;