import { triggerAsyncId } from "async_hooks";
import Cart from "./models/cart.model.js";

export default class CartManager {
    async loadCarts(){
        try{
            return await Cart.find().populate('productsInCart.product')
        }catch(error){
            throw new Error('Carts load failed' + error.message)
        }
    }
    async loadOneCart(cartId){
        try{
            return await Cart.findById(cartId).populate('productsInCart.product')
        }catch(error){
            throw new Error('Carts load failed' + error.message)
        }
    }
    
    async saveCart(cartData){
        try {
            const newCart = new Cart(cartData);
            return await newCart.save();
        } catch (error) {
            throw new Error('Carts saving failed' + error.message)
        }
    }
    async updateCart(id, updatedData){
        try {
            await Cart.findByIdAndUpdate(id, updatedData, { new: true }).populate('productsInCart.product')
        } catch (error) {
            throw new Error('Carts updating failed' + error.message)
        }
    }
    /*async populateCart(data, operation) {
        try {
          return data.populate(operation);
        } catch (error) {
          console.log({ status: "error", message: "An error occurred", error });
          return null;
        }
      }*/
      async populateCart(data, fieldsToPopulate) {
        try {
            if (!fieldsToPopulate) {
                console.log({ status: "error", message: "No fields specified to populate" });
                return data;
            }
            return await data.populate(fieldsToPopulate).execPopulate();
        } catch (error) {
            console.log({ status: "error", message: "An error occurred during population", error });
            return null;
        }
    }
    
    async deleteProductFromCart(cartId, productId){
        try {
            const cart = await Cart.findById(cartId);
            cart.productsInCart = cart.productsInCart.filter(p=>p.product.toString() !== productId)
            return await cart.save();
        } catch (error) {
            throw new Error('Cart product delete failed' + error.message)
        }
    }
    async clearCart(cartId){
        try {
            const cart = await Cart.findById(cartId);
            cart.productsInCart = [];
            return await cart.save();
        } catch (error) {
            throw new Error('Cart deleting failed' + error.message)
        }
    }
}