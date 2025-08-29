// admin_login.js
const express = require('express');
const bcrypt = require('bcrypt'); // untuk verifikasi password hash
const session = require('express-session');
const pool = require('./config/db'); // gunakan db.js kamu

const router = express.Router();

// setup session (mirip PHP session)
router.use(
  session({
    secret: process.env.SESSION_SECRET || 'rahasia123',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // true kalau pakai https
  })
);

// Endpoint POST /admin/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan password wajib diisi.' });
  }

  pool.query(
    'SELECT admin_id, name, password FROM admin WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) {
        console.error('DB error:', err);
        return res.status(500).json({ error: 'Kesalahan server.' });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: 'Email tidak ditemukan.' });
      }

      const admin = results[0];

      // cek password
      const match = await bcrypt.compare(password, admin.password);
      if (!match) {
        return res.status(401).json({ error: 'Password salah.' });
      }

      // simpan ke session
      req.session.admin_id = admin.admin_id;
      req.session.admin_name = admin.name;

      return res.json({
        success: true,
        message: 'Login berhasil',
        admin: {
          id: admin.admin_id,
          name: admin.name,
          email
        }
      });
    }
  );
});

// contoh route untuk cek session
router.get('/me', (req, res) => {
  if (!req.session.admin_id) {
    return res.status(401).json({ error: 'Belum login' });
  }
  return res.json({
    id: req.session.admin_id,
    name: req.session.admin_name
  });
});

module.exports = router;
