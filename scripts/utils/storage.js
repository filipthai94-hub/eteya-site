const fs = require('fs');
const path = require('path');

function saveJson(data, filename) {
  const dir = path.join(__dirname, '..', 'output');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filepath = path.join(dir, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✅ Saved: ${filepath}`);
  return filepath;
}

function loadJson(filename) {
  const filepath = path.join(__dirname, '..', 'output', filename);
  if (!fs.existsSync(filepath)) return null;
  return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
}

module.exports = { saveJson, loadJson };