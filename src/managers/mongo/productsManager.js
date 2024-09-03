import Product from "./models/product.model.js";
import mongoose from 'mongoose'

class ProductsManager{
    async loadProducts(query = {}, limit = 10, page = 1, sort = null) {
        const options = {
            skip: (page - 1) * limit,
            limit: limit,
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : null
        };
        try {
            const products = await Product.find(query)
                                          .sort(options.sort)
                                          .skip(options.skip)
                                          .limit(options.limit)
                                          .exec();
    
            const totalProducts = await Product.countDocuments(query);
    
            return {
                products,
                currentPage: page,
                totalPages: Math.ceil(totalProducts / limit),
                totalProducts
            }
        }catch(error){
            throw new Error('Products load failed' + error.message)
        }

    }

    async saveProduct(productData) {
        try {
            const product = new Product(productData);
            await product.save();
            return product;
        } catch (error) {
            console.error('Error saving product:', error);
            throw new Error('Could not save product');
        }
      }

      async deleteProductById(productId){
        try {
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                throw new Error('Invalid product ID');
            }
             const result = await Product.findByIdAndDelete(productId)

             if (!result) {
                throw new Error(`Product with ID ${productId} not found.`);
            }
            return `Product ${productId}, erased succesfully`
        } catch (error) {
            console.error('Error deleting product:', error.message)
            throw new Error("Couldn't erase product"+ error.message)
        }
      }
      async getProductById(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid product ID');
            }
            const product = await Product.findById(id)
            if (!product) {
                throw new Error(`Product with ID ${id} not found.`);
            }
            return product;
        } catch (error) {
            console.error('Error finding product:', error.message)
            throw new Error("Couldn't find product:"+ error.message)
        }
      }
    async updateProduct(id, updatedData){
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid product ID');
            }
            const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {new:true})
            return updatedProduct

        } catch (error) {
            console.error('Error updating product:', error);
            throw new Error('Could not update product');
        }
    }
    async find(params, operation) {
        try {
          return await productModel.find(params, operation);
        } catch (error) {
          return null;
        }
      }
  
}

export default ProductsManager