
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const PRODUCT_NAME = [
  'Memorandum of Receipts',
  'Condemned Items',

];

// ----------------------------------------------------------------------

const products = [...Array(2)].map((_, index) => {
  const setIndex = index + 1;

  return {
    cover: `/assets/images/products/product_${setIndex}.jpg`,
    name: PRODUCT_NAME[index],
  };
});

export default products;
