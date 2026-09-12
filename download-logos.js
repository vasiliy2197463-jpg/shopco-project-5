const fs = require('fs');
const path = require('path');
const https = require('https');

const officialLogos = [
  { name: 'versace-official.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Versace-3.svg' },
  { name: 'zara-official.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg' },
  { name: 'gucci-official.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Gucci_Logo.svg' },
  { name: 'prada-official.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Prada-Logo.svg' },
  { name: 'calvin-klein-official.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Calvin_klein_logo.svg' }
];

const downloadDir = path.join(process.cwd(), 'public/images/brands');
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };
    
    https.get(url, options, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlink(dest, () => {});
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download, status code: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function start() {
  console.log("Starting brand logos download...");
  for (const logo of officialLogos) {
    const dest = path.join(downloadDir, logo.name);
    try {
      console.log(`Downloading ${logo.name}...`);
      await downloadFile(logo.url, dest);
      console.log(`[SUCCESS] Downloaded ${logo.name}`);
    } catch (err) {
      console.error(`[ERROR] Failed to download ${logo.name}:`, err.message);
    }
  }
  console.log("Download process complete!");
}

start();
