require('dotenv').config();
const { claudePipeline } = require('./src/utils/claudePipeline');

async function testOCR() {
  try {
    // some sample image URL (e.g., Wikimedia placeholder)
    const testImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/200px-React-icon.svg.png';
    console.log('Testing OCR with:', testImageUrl);
    const result = await claudePipeline(testImageUrl);
    console.log('OCR Success:', result);
  } catch (e) {
    console.error('OCR Error:', e);
  }
}

testOCR();
