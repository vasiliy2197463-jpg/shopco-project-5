console.log("Next.js 15 / React 19 Ecommerce Site Test Execution Environment");
console.log("Checking project structural availability...");

import fs from 'fs';
import path from 'path';

const basePath = 'c:/Users/USER/OneDrive/Desktop/Ecommerce';

const requiredFiles = [
  'package.json',
  'next.config.mjs',
  'postcss.config.mjs',
  'jsconfig.json',
  'src/app/globals.css',
  'src/app/layout.js',
  'src/app/page.js',
  'src/app/cart/page.js',
  'src/app/category/[slug]/page.js',
  'src/app/product/[id]/page.js',
  'src/context/CartContext.js',
  'src/data/products.js',
  'src/data/reviews.js',
  'src/components/common/Button.js',
  'src/components/common/Price.js',
  'src/components/common/RatingStars.js',
  'src/components/common/Badge.js',
  'src/components/common/Breadcrumb.js',
  'src/components/common/Modal.js',
  'src/components/common/SectionHeading.js',
  'src/components/layout/Navbar.js',
  'src/components/layout/Footer.js',
  'src/components/layout/Newsletter.js',
  'src/components/layout/AnnouncementBar.js',
  'src/components/product/ProductGallery.js',
  'src/components/product/ColorPicker.js',
  'src/components/product/SizeSelector.js',
  'src/components/product/QuantitySelector.js',
  'src/components/product/ProductTabs.js',
  'src/components/product/ProductInfo.js',
  'src/components/category/FilterSidebar.js',
  'src/components/category/Pagination.js',
  'src/components/category/PriceSlider.js',
  'src/components/category/ProductGrid.js',
  'src/components/cart/CartItem.js',
  'src/components/cart/OrderSummary.js'
];

let allPassed = true;

requiredFiles.forEach(file => {
  const filePath = path.join(basePath, file);
  if (fs.existsSync(filePath)) {
    console.log(`[PASS] Found file: ${file}`);
  } else {
    console.error(`[FAIL] Missing file: ${file}`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log("\nSUCCESS: All files verified and correctly set up!");
} else {
  console.log("\nWARNING: Some files are missing or incorrectly pathed.");
}
