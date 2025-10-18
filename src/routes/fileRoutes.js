const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { createFile, listFiles, getFile, updateFile, deleteFile } = require('../controllers/fileController');

const router = express.Router();

router.use(verifyToken);
router.post('/', createFile);
router.get('/', listFiles);
router.get('/:id', getFile);
router.patch('/:id', updateFile);
router.delete('/:id', deleteFile);

module.exports = router;