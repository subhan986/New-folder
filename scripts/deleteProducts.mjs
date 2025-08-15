import fs from 'fs/promises';
import path from 'path';

const productsFilePath = path.join(process.cwd(), 'src', 'lib', 'products.json');
const idsToDelete = [
  'prod-1754390278603', // hello
  'prod-1754588640356', // sideboard 2
  'prod-1754588651340'  // sideboard 2
];

async function deleteProducts() {
  try {
    const data = await fs.readFile(productsFilePath, 'utf-8');
    let products = JSON.parse(data);

    const initialCount = products.length;
    const updatedProducts = products.filter(product => !idsToDelete.includes(product.id));
    const finalCount = updatedProducts.length;

    await fs.writeFile(productsFilePath, JSON.stringify(updatedProducts, null, 2), 'utf-8');

    console.log(`Successfully deleted ${initialCount - finalCount} product(s).`);
    console.log('The products.json file has been updated.');

  } catch (error) {
    console.error('Error updating products.json:', error);
  }
}

deleteProducts();
