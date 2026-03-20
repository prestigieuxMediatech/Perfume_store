require('dotenv').config();
const jwt = require('jsonwebtoken');


exports.auth = (req,res,next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({error:'No Token Provided'});
    }

    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(err){
        res.status(401).json({error:'Invalid or Expired Token Provided'});
    }
};