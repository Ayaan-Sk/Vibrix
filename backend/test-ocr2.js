require('dotenv').config();
const { claudePipeline } = require('./src/utils/claudePipeline');
const fs = require('fs');

async function testOCR() {
  try {
    const testImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/200px-React-icon.svg.png';
    fs.writeFileSync('ocr-output.txt', 'Testing OCR with: ' + testImageUrl + '\n');
    console.log('Testing OCR with:', testImageUrl);
    const result = await claudePipeline(testImageUrl);
    fs.appendFileSync('ocr-output.txt', 'OCR Success: ' + JSON.stringify(result, null, 2));
  } catch (e) {
    fs.appendFileSync('ocr-output.txt', 'OCR Error: ' + e.toString() + '\n' + e.stack);
  }
}

testOCR();
