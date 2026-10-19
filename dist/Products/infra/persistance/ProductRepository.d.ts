import { Pool } from 'pg';
import { IProduct, IProductWithUnitsSold } from '../../domain/IProduct';
import { IProductRepository } from '../../domain/IProductRepository';
/**
 * @class ProductRepository
 * @description Implements the IProductRepository interface for managing product data.
 *              This implementation interacts with a PostgreSQL database.
 */
export declare class ProductRepository implements IProductRepository {
    private pool;
    constructor(pool: Pool);
    /**
     * Retrieves a product by its unique identifier, including its images.
     * @param {number} businessId - The ID of the business.
     * @param {string} id - The ID of the product to retrieve.
     * @returns {Promise<IProduct | null>} A promise that resolves to the product if found, otherwise null.
     */
    getById(businessId: number, id: string): Promise<IProduct | null>;
    /**
     * Retrieves all products, including their images and units sold in the last month.
     * @param {number} businessId - The ID of the business.
     * @returns {Promise<IProduct[]>} A promise that resolves to an array of products.
     */
    getAll(businessId: number): Promise<IProductWithUnitsSold[]>;
    /**
     * Retrieves a list of products with pagination.
     * @param {number} businessId - The ID of the business.
     * @param {number} limit - The maximum number of products to return.
     * @param {number} offset - The number of products to skip.
     * @param {boolean} active_only - Whether to only return active products or all products.
     * @returns {Promise<IProduct[]>} A promise that resolves to an array of products.
     */
    list(businessId: number, limit: number, offset: number, active_only?: boolean): Promise<IProductWithUnitsSold[]>;
    /**
     * Creates a new product.
     * @param {number} businessId - The ID of the business.
     * @param {Omit<IProduct, 'business_id' | 'created_at' | 'updated_at'>} product - The product data.
     * @returns {Promise<IProduct>} A promise that resolves to the created product.
     */
    create(businessId: number, product: Omit<IProduct, 'business_id' | 'created_at' | 'updated_at'>): Promise<IProduct>;
    /**
     * Updates an existing product.
     * @param {number} businessId - The ID of the business.
     * @param {string} id - The ID of the product to update.
     * @param {Partial<IProduct>} updates - An object containing the fields to update.
     * @returns {Promise<IProduct | null>} A promise that resolves to the updated product if found, otherwise null.
     */
    update(businessId: number, id: string, updates: Partial<IProduct>): Promise<IProduct | null>;
    /**
     * Deletes a product by its unique identifier.
     * @param {number} businessId - The ID of the business.
     * @param {string} id - The ID of the product to delete.
     * @returns {Promise<boolean>} A promise that resolves to true if the product was deleted, otherwise false.
     */
    delete(businessId: number, id: string): Promise<boolean>;
    /**
     * Deletes a specific image from a product.
     * @param {number} businessId - The ID of the business.
     * @param {string} productId - The ID of the product.
     * @param {string} imageId - The ID of the image to delete.
     * @returns {Promise<boolean>} A promise that resolves to true if the image was deleted/dissociated, otherwise false.
     */
    deleteImage(businessId: number, productId: string, imageId: string): Promise<boolean>;
    getProductSales(businessId: number, productId: string): Promise<{
        quantity: number;
        created_at: Date;
    }[]>;
}
export declare const productRepository: ProductRepository;
