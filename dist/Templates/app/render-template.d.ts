import { IProductWithUnitsSold } from '../../Products/domain/IProduct';
export interface TemplateVariables {
    products?: IProductWithUnitsSold[];
}
export declare function renderTemplate(template: string, vars: TemplateVariables): string;
