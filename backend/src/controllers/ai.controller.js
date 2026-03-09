const Notice = require('../models/Notice');
const CalendarEvent = require('../models/CalendarEvent');
const Anthropic = require('@anthropic-ai/sdk');
const cloudinary = require('../config/cloudinary');
const { claudePipeline } = require('../utils/claudePipeline');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image provided' });

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'notices',
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.processImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) return res.status(400).json({ error: 'No imageUrl provided' });

    const result = await claudePipeline(imageUrl);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.translateNotice = async (req, res) => {
  try {
    const { notice_id, targetLanguage } = req.body;
    const notice = await Notice.findById(notice_id);
    if (!notice) return res.status(404).json({ error: 'Notice not found' });

    const content = notice.content || notice.extractedText || '';
    if (!content) return res.status(400).json({ error: 'No content to translate' });

    const result = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Translate the following college notice content to ${targetLanguage}. Return ONLY the translated text.\n\nContent: ${content}`
      }]
    });

    res.json({ translatedContent: result.content[0].text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
