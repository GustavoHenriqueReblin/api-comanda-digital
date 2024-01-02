import { fakeProductData } from '../../model/productModel';

const userResolver = {
    Query: {
        products: (_: any, { filter }: any) => {
            if (filter && filter.idCategory !== undefined) {
                return fakeProductData.filter((product) => product.idCategory === filter.idCategory);
              } else {
                return fakeProductData;
              }
        }
    }
  };
  
  module.exports = userResolver;