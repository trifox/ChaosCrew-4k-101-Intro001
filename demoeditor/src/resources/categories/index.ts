import { CategoriesCreate } from "./CategoriesCreate";
import { CategoriesEdit } from "./CategoriesEdit";
import { CategoriesList } from "./CategoriesList";
import { CategoriesShow } from "./CategoriesView";

 
 export default{
    name: 'categories',
    list:CategoriesList,
    edit:CategoriesEdit,
    show:CategoriesShow,
    create:CategoriesCreate,
 }