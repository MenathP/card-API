const express = require('express');
const multer = require('multer');
const path = require('path');
const { processScan } = require('../controllers/scanController');

const router = express.Router();

// configure multer to save uploads to /uploads
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: function (_req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${unique}${ext}`);
  }
});

const upload = multer({ storage });

// POST /api/scan - accepts form-data with field `image`
router.post('/scan', upload.single('image'), processScan);

module.exports = router;
