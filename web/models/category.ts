export interface CategoryModel {
    id?: number;
    name?: string;
    description?: string;
    image?: string;
    parent?: number;
    children?: CategoryModel[];
}