const jwt = require('jsonwebtoken');
const pool = require('../config/db');

exports.googleCallback = (req,res) => {
    const token = jwt.sign(
    {
        id : req.user.id,
        email : req.user.email,
        name : req.user.name
    },
    process.env.JWT_SECRET,
    {expiresIn:'7d'}
    );

    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
}

exports.getMe = async(req,res) => {
    try{
        const rows = await pool.query(
            'SELECT id,name,email,avatar,created_at FROM users WHERE ID=?',
            [req.user.id]
        );
        if(rows.length === 0){
            return res.status(404).json({error:'User Not Found'});
        }
        res.json(rows[0]);
    }
    catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}