import { fakeProductData } from '../../model/productModel';

const userResolver = {
  Query: {
    products: (_: any, { filter }: any) => {
      if (filter && filter.idCategory && filter.idCategory.length > 0) {
        return fakeProductData.filter((product) => filter.idCategory.includes(product.idCategory));
      } else {
        return fakeProductData;
      }
    },
  },
};
  
module.exports = userResolver;