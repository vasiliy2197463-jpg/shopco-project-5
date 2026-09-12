import fs from 'fs';
import path from 'path';

const srcDir = 'C:/Users/USER/.gemini/antigravity/brain/6ca243dc-1685-4f6f-b188-502244797f91';
const projectDir = 'c:/Users/USER/OneDrive/Desktop/Ecommerce';

const pDir = path.join(projectDir, 'public/images/products');
const hDir = path.join(projectDir, 'public/images/hero');
const stDir = path.join(projectDir, 'public/images/styles');

// Create directories
fs.mkdirSync(pDir, { recursive: true });
fs.mkdirSync(hDir, { recursive: true });
fs.mkdirSync(stDir, { recursive: true });

// Copy products
const productCopies = [
  ['product_1_1785746676650.png', 'product-1.png'],
  ['product_2_1785746687633.png', 'product-2.png'],
  ['product_3_1785746699074.png', 'product-3.png'],
  ['product_4_1785746710477.png', 'product-4.png'],
  ['product_5_1785746729293.png', 'product-5.png'],
  ['product_6_1785746739617.png', 'product-6.png'],
  ['product_7_1785746748811.png', 'product-7.png'],
  ['product_8_1785746759589.png', 'product-8.png'],
  ['product_9_1785746779901.png', 'product-9.png'],
  ['product_10_1785746789511.png', 'product-10.png'],
  ['product_11_1785746799403.png', 'product-11.png'],
  ['product_12_1785746811266.png', 'product-12.png']
];

productCopies.forEach(([src, dest]) => {
  const srcPath = path.join(srcDir, src);
  const destPath = path.join(pDir, dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${src} -> ${dest}`);
  } else {
    console.log(`Source not found: ${srcPath}`);
  }
});

// Copy Hero
const heroSrc = path.join(srcDir, 'media__1785750736154.png');
const heroDest = path.join(hDir, 'hero-banner.png');
if (fs.existsSync(heroSrc)) {
  fs.copyFileSync(heroSrc, heroDest);
  console.log('Copied hero banner');
}

// Download styles using native https module
import https from 'https';

const styleDownloads = [
  { url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600', name: 'casual.png' },
  { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600', name: 'formal.png' },
  { url: 'https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?q=80&w=600', name: 'party.png' },
  { url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600', name: 'gym.png' }
];

styleDownloads.forEach(({ url, name }) => {
  const destPath = path.join(stDir, name);
  const file = fs.createWriteStream(destPath);
  https.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded style image: ${name}`);
    });
  }).on('error', (err) => {
    fs.unlink(destPath, () => {});
    console.error(`Error downloading ${name}:`, err.message);
  });
});

console.log('Image copy script configured!');
