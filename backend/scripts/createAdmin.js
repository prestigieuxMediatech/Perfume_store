require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const createAdmin = async(req,res) => {
    const hash = await bcrypt.hash(process.env.ADMIN_PASS,10);
    await pool.query(
        `INSERT INTO admins (id,name,email,password)
        VALUES (UUID(),?,?,?)`,
        ['Owner','admin@gmail.com',hash]
    );
    console.log('Admin Created Succesfully');
    process.exit(0);
}

createAdmin().catch(console.error);