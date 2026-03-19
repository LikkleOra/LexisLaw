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
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return;
  console.log('Processing: ' + filePath);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Branding Updates
  content = content.replace(/LexisLaw/g, 'Mokoena Legal');
  content = content.replace(/LEXISLAW/g, 'MOKOENA');
  
  // 2. Safe Background Swaps
  // We use temporary tokens to avoid circular replacements
  content = content.replace(/bg-lexis-black/g, '__BG_WHITE__');
  content = content.replace(/bg-white/g, '__BG_BLACK__');
  content = content.replace(/__BG_WHITE__/g, 'bg-white');
  content = content.replace(/__BG_BLACK__/g, 'bg-lexis-black');

  // 3. Safe Text Swaps
  content = content.replace(/text-white/g, '__TXT_BLACK__');
  content = content.replace(/text-black/g, '__TXT_WHITE__');
  content = content.replace(/__TXT_BLACK__/g, 'text-black');
  content = content.replace(/__TXT_WHITE__/g, 'text-white');

  // 4. Cards & Borders
  content = content.replace(/bg-\[\#121212\]/g, 'bg-[#f4f4f4]');
  content = content.replace(/border-white/g, 'border-black');
  content = content.replace(/border-b-white/g, 'border-b-black');
  content = content.replace(/border-t-white/g, 'border-t-black');

  // 5. Opacity classes adjust (e.g. text-white/50 -> text-black/50)
  // These might already be handled by the direct text/border replace, but just in case:
  // Actually, since border-white gets replaced by border-black, border-white/10 becomes border-black/10 safely!

  fs.writeFileSync(filePath, content, 'utf8');
}

walkDir('./app', processFile);
walkDir('./components', processFile);
