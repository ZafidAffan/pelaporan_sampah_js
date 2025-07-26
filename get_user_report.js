const express = require('express');
const db = require('./db'); // pastikan db.js sudah konek ke MySQL

const router = express.Router();

router.get('/', (req, res) => {
  const userId = parseInt(req.query.user_id);

  if (!userId) {
    return res.status(400).json({ error: 'Parameter user_id tidak ditemukan atau tidak valid' });
  }

  const sql = `
    SELECT report_id, description, address, status, img_url AS image_path, created_at
    FROM reports
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Gagal mengambil data', detail: err.message });
    }

    res.json(results);
  });
});

module.exports = router;
