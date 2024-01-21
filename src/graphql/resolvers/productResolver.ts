import { fakeProductData } from '../../model/productModel';

const productResolver = {
  Query: {
    products: (_: any, { filter }: any) => {
      const hasCategoryFilter = filter.categoriesIds && filter.categoriesIds.length > 0;
      const hasProductFilter = filter.productsIds && filter.productsIds.length > 0;

      if (hasCategoryFilter && hasProductFilter) {
        return fakeProductData.filter((product) =>
          filter.categoriesIds.includes(product.idCategory) && filter.productsIds.includes(product.id)
        );
      }

      if (hasCategoryFilter) {
        return fakeProductData.filter((product) => filter.categoriesIds.includes(product.idCategory));
      }

      if (hasProductFilter) {
        return fakeProductData.filter((product) => filter.productsIds.includes(product.id));
      }

      return fakeProductData;
    },
  },
};

  
module.exports = productResolver;