const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const router = express.Router();

// Setup folder upload
const uploadDir = path.join(__dirname, 'upload');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup multer untuk upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '_' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

// Middleware untuk CORS
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'POST');
  next();
});

// POST /report
router.post('/', upload.single('image'), (req, res) => {
  const file = req.file;
  const {
    user_id,
    description,
    latitude,
    longitude,
    address
  } = req.body;

  if (!file) {
    return res.status(400).json({ error: 'Gambar tidak ditemukan atau gagal diunggah' });
  }

  // Validasi field
  if (!user_id || !description || !latitude || !longitude || !address) {
    return res.status(400).json({ error: 'Data tidak lengkap' });
  }

  const img_url = file.filename;
  const status = 'pending';
  const created_at = new Date();

  const sql = `INSERT INTO reports 
    (user_id, description, img_url, latitude, longitude, address, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [user_id, description, img_url, latitude, longitude, address, status, created_at], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Gagal menyimpan laporan: ' + err.message });
    }

    res.json({ success: true, message: 'Laporan berhasil dikirim' });
  });
});

module.exports = router;
