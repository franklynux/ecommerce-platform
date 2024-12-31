import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupBrandAssets() {
  try {
    // Define paths
    const brandPath = join(dirname(__dirname), 'src', 'assets', 'brand');
    const publicPath = join(dirname(__dirname), 'public');
    
    // Create directories if they don't exist
    await fs.mkdir(brandPath, { recursive: true });
    await fs.mkdir(publicPath, { recursive: true });
    
    // Logo SVG content
    const logoSvg = `<?xml version="1.0" standalone="no"?>
<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Background Circle -->
  <circle cx="256" cy="256" r="256" fill="#2563EB"/>
  
  <!-- Paw Print (centered and larger) -->
  <g fill="white" transform="translate(106, 106) scale(2.5)">
    <!-- Main Pad -->
    <circle cx="60" cy="70" r="35"/>
    <!-- Toe Pads -->
    <circle cx="35" cy="35" r="20"/>
    <circle cx="85" cy="35" r="20"/>
    <circle cx="25" cy="70" r="20"/>
    <circle cx="95" cy="70" r="20"/>
  </g>
</svg>`;

    // OG Image SVG content
    const ogImageSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#2563EB"/>
            <stop offset="100%" style="stop-color:#1D4ED8"/>
        </linearGradient>
    </defs>
    
    <!-- Background -->
    <rect width="1200" height="630" fill="url(#bgGradient)"/>
    
    <!-- Logo -->
    <g transform="translate(150, 165)">
        <circle cx="150" cy="150" r="120" fill="white"/>
        
        <!-- Paw Print -->
        <g transform="translate(60, 60) scale(1.8)" fill="url(#bgGradient)">
            <circle cx="25" cy="30" r="15"/>
            <circle cx="15" cy="15" r="8"/>
            <circle cx="35" cy="15" r="8"/>
            <circle cx="10" cy="30" r="8"/>
            <circle cx="40" cy="30" r="8"/>
        </g>
    </g>
    
    <!-- Text -->
    <g fill="white" font-family="Inter, system-ui, sans-serif">
        <text x="400" y="280" font-size="72" font-weight="700">Pet Accessories</text>
        <text x="400" y="350" font-size="36" font-weight="500" opacity="0.9">Your One-Stop Shop for Pet Supplies</text>
    </g>
</svg>`;
    
    // Save the SVG files
    const logoPath = join(brandPath, 'logo.svg');
    const ogImagePath = join(brandPath, 'og-image.svg');
    
    await fs.writeFile(logoPath, logoSvg);
    await fs.writeFile(ogImagePath, ogImageSvg);
    
    // Also save logo to public directory
    await fs.writeFile(join(publicPath, 'logo.svg'), logoSvg);
    
    console.log('Brand assets created successfully:');
    console.log(`- Logo SVG: ${logoPath}`);
    console.log(`- OG Image SVG: ${ogImagePath}`);
    console.log(`- Public Logo: ${join(publicPath, 'logo.svg')}`);
  } catch (error) {
    console.error('Error creating brand assets:', error);
    process.exit(1);
  }
}

setupBrandAssets();