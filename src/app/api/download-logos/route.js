import fs from 'fs';
import path from 'path';
import https from 'https';
import { NextResponse } from 'next/server';

function downloadNative(url, destPath) {
  return new Promise((resolve, reject) => {
    const options = new URL(url);
    const requestOptions = {
      hostname: options.hostname,
      path: options.pathname + options.search,
      headers: {
        'User-Agent': 'SHOP.CO-Demo-Template/1.0 (contact: admin@shopco-test.com) Web-Development-Demo',
        'Accept': 'image/svg+xml,image/*,*/*'
      }
    };

    https.get(requestOptions, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        let modifiedData = data;
        
        modifiedData = modifiedData.replace(/fill="#000000"/gi, 'fill="currentColor"');
        modifiedData = modifiedData.replace(/fill="black"/gi, 'fill="currentColor"');
        modifiedData = modifiedData.replace(/stroke="#000000"/gi, 'stroke="currentColor"');
        modifiedData = modifiedData.replace(/stroke="black"/gi, 'stroke="currentColor"');
        
        if (!modifiedData.includes('fill=')) {
          modifiedData = modifiedData.replace('<svg', '<svg fill="currentColor"');
        }

        fs.writeFileSync(destPath, modifiedData);
        resolve();
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

export async function GET() {
  const targetDir = 'c:/Users/USER/OneDrive/Desktop/Ecommerce/public/images/brands';
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const downloads = [
    { url: 'https://cdn.worldvectorlogo.com/logos/versace-logo.svg', name: 'versace.svg' },
    { url: 'https://cdn.worldvectorlogo.com/logos/zara.svg', name: 'zara.svg' },
    { url: 'https://cdn.worldvectorlogo.com/logos/gucci.svg', name: 'gucci.svg' },
    { url: 'https://cdn.worldvectorlogo.com/logos/prada.svg', name: 'prada.svg' },
    { url: 'https://cdn.worldvectorlogo.com/logos/calvin-klein.svg', name: 'calvin-klein.svg' }
  ];

  const results = [];

  for (const item of downloads) {
    const destPath = path.join(targetDir, item.name);
    try {
      await downloadNative(item.url, destPath);
      results.push(`Downloaded ${item.name}`);
    } catch (err) {
      results.push(`Error downloading ${item.name}: ${err.message}`);
    }
  }

  return NextResponse.json({ results });
}
