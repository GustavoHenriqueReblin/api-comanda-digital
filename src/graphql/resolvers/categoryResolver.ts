import { fakeCategoryData } from '../../model/categoryModel';

const userResolver = {
    Query: {
        categories: () => {
            return fakeCategoryData;
        }
    }
};
  
module.exports = userResolver;