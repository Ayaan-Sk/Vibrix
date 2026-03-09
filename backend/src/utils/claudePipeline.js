const Anthropic = require('@anthropic-ai/sdk');
const axios = require('axios');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function claudePipeline(imageUrl) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const base64 = Buffer.from(response.data).toString('base64');
    const mimeType = response.headers['content-type'] || 'image/jpeg';

    const result = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64 } },
          { type: 'text', text: `You are a college notice board assistant.
Read this college notice image. Do the following:
1. Extract ALL text visible in the image (OCR).
2. Detect the language.
3. Translate to English if not already English.
4. Analyze and respond ONLY with this exact JSON, no markdown:
{
  "heading": "max 8 word title",
  "summary": "exactly 2 sentences",
  "importantDates": ["Nov 25 - Hall tickets released"],
  "detectedLanguage": "Hindi",
  "urgency": "critical|normal|low",
  "suggestedTags": ["Exam", "Urgent"],
  "extractedText": "full raw text here"
}` }
        ]
      }]
    });

    const text = result.content[0].text.trim();
    const parsed = JSON.parse(text);
    return parsed;
  } catch (error) {
    console.error('Claude Pipeline Error DETAILS:', error);
    throw new Error('Failed to process image with AI: ' + error.message);
  }
}

module.exports = { claudePipeline };
