const express = require('express');
const multer = require('multer');
const path = require('path');
const { processScan, processLocalScan } = require('../controllers/scanController');

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

// POST /api/scan/local - accepts JSON { filename: 'uploads/xxxx.jpg' }
// This helper is temporary for testing server-side files already present in uploads/
router.post('/scan/local', express.json(), processLocalScan);

module.exports = router;
