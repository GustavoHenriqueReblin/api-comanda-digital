import { fakeCategoryData } from '../../model/categoryModel';

const categoryResolver = {
    Query: {
        categories: () => {
            return fakeCategoryData;
        }
    }
};
  
export default categoryResolver;