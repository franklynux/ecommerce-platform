import sharp from 'sharp';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateImages() {
  try {
    // Define paths
    const rootDir = dirname(__dirname);
    const LOGO_PATH = join(rootDir, 'src', 'assets', 'brand', 'logo.svg');
    const OG_IMAGE_PATH = join(rootDir, 'src', 'assets', 'brand', 'og-image.svg');
    const PUBLIC_PATH = join(rootDir, 'public');
    const ICONS_PATH = join(PUBLIC_PATH, 'icons');

    // Ensure all directories exist
    await fs.mkdir(ICONS_PATH, { recursive: true });

    // Verify source files exist
    await fs.access(LOGO_PATH);
    await fs.access(OG_IMAGE_PATH);

    // Generate favicon PNG from logo
    await sharp(LOGO_PATH)
      .resize(1024, 1024)
      .png()
      .toFile(join(PUBLIC_PATH, 'logo-for-favicon.png'));
    console.log('Generated logo-for-favicon.png');

    // Generate OG image
    await sharp(OG_IMAGE_PATH)
      .resize(1200, 630)
      .png()
      .toFile(join(PUBLIC_PATH, 'og-image.png'));
    console.log('Generated og-image.png');

    // Generate various icon sizes
    const sizes = [
      { size: 16, name: 'favicon-16x16.png' },
      { size: 32, name: 'favicon-32x32.png' },
      { size: 192, name: 'android-chrome-192x192.png' },
      { size: 512, name: 'android-chrome-512x512.png' },
      { size: 180, name: 'apple-touch-icon.png' },
    ];

    for (const { size, name } of sizes) {
      await sharp(LOGO_PATH)
        .resize(size, size)
        .png()
        .toFile(join(ICONS_PATH, name));
      console.log(`Generated ${name}`);
    }

    // Generate maskable icon with padding
    await sharp(LOGO_PATH)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 37, g: 99, b: 235, alpha: 1 } // #2563EB
      })
      .png()
      .toFile(join(ICONS_PATH, 'maskable-icon.png'));
    console.log('Generated maskable-icon.png');

    console.log('\nAll images generated successfully!');
    console.log(`Check your files in:`);
    console.log(`- ${PUBLIC_PATH}`);
    console.log(`- ${ICONS_PATH}`);
  } catch (error) {
    console.error('Error generating images:', error);
    process.exit(1);
  }
}

generateImages();