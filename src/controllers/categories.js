// Import any needed model functions
import { getAllCategories, getCategoryDetails, getProjectsByCategoryId, getCategoriesByProjectId } from '../models/categories.js';

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};  

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    const categoryDetails = await getCategoryDetails(categoryId);
    const projectsInCategory = await getProjectsByCategoryId(categoryId);
    const title = 'Category Details';

    res.render('category', {title, categoryDetails, projectsInCategory});
};

// Export any controller functions
export { showCategoriesPage, showCategoryDetailsPage };