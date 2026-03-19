const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  console.log('Processing: ' + filePath);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Grey swaps for light theme
  // text-lexis-grey (light) should become text-lexis-dark-grey (dark) on white BG
  // However, let's use tailwind standard text-gray-600 for safety, or text-[#333333]
  content = content.replace(/text-lexis-grey/g, 'text-[#333333]');
  
  // bg-lexis-dark-grey (#3333) should become bg-gray-200 or bg-[#f1f1f1]
  content = content.replace(/bg-lexis-dark-grey/g, 'bg-[#f1f1f1]');

  fs.writeFileSync(filePath, content, 'utf8');
}

walkDir('./app', processFile);
walkDir('./components', processFile);
