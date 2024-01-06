import { fakeCategoryData } from '../../model/categoryModel';

const categoryResolver = {
    Query: {
        categories: () => {
            return fakeCategoryData;
        }
    }
};
  
module.exports = categoryResolver;