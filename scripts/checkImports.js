const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src/components');

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('useCart') && content.includes('CartContext.jsx')) {
    console.log(`Found incorrect import in: ${filePath}`);
    const newContent = content.replace(
      /import {[^}]*useCart[^}]*} from ['"].*CartContext.jsx['"]/,
      `import { useCart } from '../../hooks/useCart'`
    );
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Fixed import in:', filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      checkFile(filePath);
    }
  });
}

walkDir(componentsDir);