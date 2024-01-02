import { fakeProductData } from '../../model/productModel';

const userResolver = {
    Query: {
        products: () => {
            return fakeProductData;
        }
    }
  };
  
  module.exports = userResolver;