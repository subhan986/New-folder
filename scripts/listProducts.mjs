import fs from 'fs/promises';
import path from 'path';

const productsFilePath = path.join(process.cwd(), 'src', 'lib', 'products.json');

async function listProducts() {
  try {
    const data = await fs.readFile(productsFilePath, 'utf-8');
    const products = JSON.parse(data);

    if (!products || products.length === 0) {
      console.log('No products found in the file.');
      return;
    }

    console.log('--- List of All Products ---');
    products.forEach(product => {
      console.log(`ID: ${product.id}, Name: ${product.name}`);
    });
    console.log('--------------------------');

  } catch (error) {
    console.error('Error reading or parsing products.json:', error);
  }
}

listProducts();
