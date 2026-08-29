const fs = require('fs');
const path = require('path');

// Ensure directory exists
const samplesDir = path.join(__dirname, '..', 'public', 'samples');
if (!fs.existsSync(samplesDir)) {
  fs.mkdirSync(samplesDir, { recursive: true });
}

console.log('Sample directory ready at:', samplesDir);
