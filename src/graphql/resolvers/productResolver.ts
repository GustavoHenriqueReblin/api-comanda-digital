import { getProducts } from "../../model/productModel";

const productResolver = {
  Query: {
    products: async (_: any, { filter }: any) => {
      const categoriesIds = filter.categoriesIds && filter.categoriesIds.length > 0 ? filter.categoriesIds : [];
      const productsIds = filter.productsIds && filter.productsIds.length > 0 ? filter.productsIds : [];

      return await getProducts(categoriesIds, productsIds);
    },
  },
};

  
module.exports = productResolver;