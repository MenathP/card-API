const fs = require('fs');
const path = require('path');
const openaiService = require('../services/openaiService');

// Controller to handle uploaded card image, call OpenAI to extract fields
async function processScan(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    const filePath = req.file.path;

    // call service that sends image to OpenAI and parses response
    const extracted = await openaiService.extractCardFromImage(filePath);

    // respond with parsed fields and image URL
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${path.basename(filePath)}`;

    res.json({ success: true, data: extracted, imageUrl });
  } catch (err) {
    console.error('processScan error:', err);
    res.status(500).json({ error: 'Failed to process image' });
  }
}

module.exports = { processScan };
