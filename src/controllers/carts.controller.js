/*import mongoose from "mongoose";

import { productsService, cartsService, usersService, ticketService } from "../managers/index.js";
import { error } from "console";

const getNewCart = async(req, res)=>{
    try {
        const newCart = {
            productsInCart: []
        };
        await cartsService.saveCart(newCart);
        res.status(201).send(newCart);
    } catch (error) {
        console.error('Error creating new cart:', error.message);
        res.status(500).send({ status: "error", error: 'Error creating new cart: ' + error.message });
    }
}

const getCartById = async(req, res)=>{
    try { 
        const cid = req.params.cid;
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            return res.status(400).send({ status: "error", error: "Invalid cart ID" });
        }
        const cart = await cartsService.loadOneCart(cid)
    
        if (!cart) {
            return res.status(404).send({ status: "error", error: "Cart not found" });
        }
        res.send(cart.productsInCart);
    }catch (error) {
        console.error('Error cart not found:', error.message);
        res.status(500).send({ status: "error", error: 'Error cart not found: ' + error.message });
    }
}

const addProductToCart = async(req, res)=>{
    try {
        const cid = req.params.cid
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            return res.status(400).send({ status: "error", error: "Invalid cart ID" });
        }
        const pid = req.params.pid;
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).send({ status: "error", error: "Invalid product ID" });
        }

        const cart = await cartsService.loadOneCart(cid)
        if (!cart) {
            return res.status(404).send({ status: "error", error: "Cart not found" });
        }

        const product = await productsService.getProductById(pid)
        if (!product) {
            return res.status(404).send({ status: "error", error: "Product not found" });
        }

        const existingProductInCart = cart.productsInCart.find(item => item.product.toString() === pid);

        if (existingProductInCart) {
            existingProductInCart.quantity += 1;
        } else {
            cart.productsInCart.push({ product: pid, quantity: 1 });
        }

        await cartsService.saveCart(cart)
        res.send(`${product} succesfully added to cart with ID ${cid}`)
    } catch (error) {
        console.error('Error cart or product not found:', error.message);
        res.status(500).send({ status: "error", error: 'Error cart or product not found: ' + error.message });
    }
}
const updateProductsInCart = async (req, res) => {
    const newValues = req.body;
  
    if (!newValues || !Array.isArray(newValues)) {
      return res
        .status(400)
        .send({ status: "error", error: "Invalid data format" });
    }
  
    for (const product of newValues) {
      if (
        !product.quantity ||
        typeof product.quantity !== "number" ||
        product.quantity < 0
      ) {
        return res
          .status(400)
          .send({ status: "error", error: "Invalid product format" });
      }
  
      if (!mongoose.Types.ObjectId.isValid(product._id)) {
        try {
          const objectId = mongoose.Types.ObjectId(product._id);
          product.product = objectId;
        } catch (error) {
          console.error("Error converting product.id to ObjectId:", error);
          return res
            .status(400)
            .send({ status: "error", error: "Invalid product format (id)" });
        }
      }
    }
  
    const cartId = req.params.cid;
  
    const cart = await cartsService.loadOneCart(cartId);
  
    if (cart === null) {
     return res.send({ status: "error", error: message });
    }
  
    const productIds = newValues.map((product) => product.product);
  
    const products = await productsService.find({
      _id: { $in: productIds },
    });
  
    if (products.length !== products.length) {
     return res.send({ status: "error", error: message });
    }
  
    const updateCart = await cartsService.updateCart(
      { _id: cartId },
      { $set: { products: newValues } }
    );
  
    if (updateCart === null) {
      operationResult = null;
      return res.send({ status: "error", error: message });
    }
  
    const updatedCart = await cartsService.loadOneCart(cartId);
  
    const populateCart = await cartsService.populateCart(updatedCart);
  
    res.send({
      status: "success",
      message: "Products in cart successfully updated",
      cart: populateCart,
    });
  };

const deleteProductById = async (req, res) => {
  
    const cartId = req.params.cid;
  
    const productId = req.params.pid;
  
    const cart = await cartsService.loadOneCart(cartId);
  
    if (!cart) {
      return res.send({ status: "error", error: "not a valid cart id" });
     }
  
    const product = await productsService.getProductById(productId);
  
    if (!product) {
      return res.send({ status: "error", error: "not a valid product id" });
     }
  
    const productInCart = await productsService.find({
      _id: cartId,
      "products.product": productId,
    });
  
    console.log(productInCart);
  
    if (productInCart.length < 1) {
       res.send({ status: "error", error: "empty cart" });
    }
  
    const updatedCart = await cartsService.updateCart(
      { _id: cartId },
      { $pull: { products: { product: productId } } }
    ); 
    const populateCart = await cartsService.populateCart(updatedCart);

    res.send({
      status: "success",
      message: "Product deleted successfully",
      cart: populateCart,
    }); 
  }
  
const clear = async (req, res) => {
    let operationResult;
  
    const cartId = req.params.cid;
  
    const cart = await cartsService.loadOneCart(cartId);
  
    if (!cart) {
    
      return res.send({ status: "error", error: "Not a valid id cart" });
    }
  
    const result = await cartsService.clearCart(cartId);
  
    res.send({
      status: "success",
      message: "Cart cleaned successfully",
      cart: result,
    });
  };
const purchase = async (req, res) => {
    const buyerId = req.user.id;
  
    const buyer = await usersService.getUserById(buyerId)
  
    if (buyer === null || !buyer.email) {
      return res
        .status(404)
        .send({ status: "error", message: "Couldn't complete purchase" });
    }
  
    const email = buyer.email;
  
    const buyerCart = req.params.cid;
  
    const cart = await cartsService.loadOneCart(buyerCart)
  
    if (cart < 0) {
      return res
        .status(500)
        .send({ status: "error", error: error});
    }
  
    const cartProducts = cart.productsInCart;
  
    const inStock = [];
    const outOfStock = [];
  
    cartProducts.forEach((item) => {
      const { product, quantity } = item;
  
      if (product.stock >= quantity) {
        let amount = product.price * quantity;
        inStock.push({
          id: product._id,
          total: amount,
          quantity: quantity,
          stock: product.stock,
        });
      } else {
        outOfStock.push({
          id: product._id,
          quantity: quantity,
          available: product.stock,
        });
      }
    });
  
    if (outOfStock.length >= 1) {
      return res.status(406).send({
        status: "error",
        message: "Your cart has products out of stock",
        payload: outOfStock,
      });
    }
  
    if (inStock.length < 1) {
      return res.status(406).send({
        status: "error",
        message: "Couldn't complete purchase, your cart is empty",
        payload: outOfStock,
      });
    }
  
    let totalAmount;
  
    totalAmount = inStock.reduce((sum, product) => sum + product.total, 0);
  
 
  
    const dateTimeOfPurchase = new Date().toISOString();
  
    const purchaseInfo = {
      amount: totalAmount,
      client: email,
      dateTimeOfPurchase,
      code: _id,
    };
  
    const ticket = await ticketService.createTicket(purchaseInfo);
  
   
  
    inStock.forEach((product) => {
      let newStock = product.stock - product.quantity;
      let operation = productsService.updateProduct(product.id, newStock);
  
      if (operation < 0) {
        const { errorName, httpCode } = getErrorDetails(cart);
        return res.status(httpCode).send({ status: "error", error: errorName });
      }
    });
  
  
    await cartsService.clearCart(buyerCart);
  
    
    res.status(201).send({
      status: "success",
      message: "Ticket created successfully",
      payload: ticket,
    });
  };
  
export default {getNewCart, getCartById, addProductToCart, purchase, deleteProductById, updateProductsInCart, clear}
*/
import mongoose from "mongoose";
import { productsService, cartsService, usersService, ticketService } from "../managers/index.js";

const getNewCart = async (req, res) => {
    try {
        const newCart = { productsInCart: [] };
        await cartsService.saveCart(newCart);
        res.status(201).send(newCart);
    } catch (error) {
        console.error('Error creating new cart:', error.message);
        res.status(500).send({ status: "error", error: 'Error creating new cart: ' + error.message });
    }
};

const getCartById = async (req, res) => {
    try {
        const cid = req.params.cid;
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            return res.status(400).send({ status: "error", error: "Invalid cart ID" });
        }
        const cart = await cartsService.loadOneCart(cid);

        if (!cart) {
            return res.status(404).send({ status: "error", error: "Cart not found" });
        }
        res.send(cart.productsInCart);
    } catch (error) {
        console.error('Error finding cart:', error.message);
        res.status(500).send({ status: "error", error: 'Error finding cart: ' + error.message });
    }
};

/*const addProductToCart = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;

        if (!mongoose.Types.ObjectId.isValid(cid)) {
            return res.status(400).send({ status: "error", error: "Invalid cart ID" });
        }
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).send({ status: "error", error: "Invalid product ID" });
        }

        const cart = await cartsService.loadOneCart(cid);
        if (!cart) {
            return res.status(404).send({ status: "error", error: "Cart not found" });
        }

        const product = await productsService.getProductById(pid);
        if (!product) {
            return res.status(404).send({ status: "error", error: "Product not found" });
        }

        const existingProductInCart = cart.productsInCart.find(item => item.product.toString() === pid);

        if (existingProductInCart) {
            existingProductInCart.quantity += 1;
        } else {
            cart.productsInCart.push({ product: pid, quantity: 1 });
        }

        await cartsService.saveCart(cart);
        res.send({ status: "success", message: `Product ${product.name} successfully added to cart with ID ${cid}` });
    } catch (error) {
        console.error('Error adding product to cart:', error.message);
        res.status(500).send({ status: "error", error: 'Error adding product to cart: ' + error.message });
    }
};*/
const addProductToCart = async (req, res) => {
  try {
      const cartId = req.params.cid;
      const productId = req.params.pid;

      if (!mongoose.Types.ObjectId.isValid(cartId)) {
          return res.status(400).send({ status: "error", error: "Invalid cart ID" });
      }
      if (!mongoose.Types.ObjectId.isValid(productId)) {
          return res.status(400).send({ status: "error", error: "Invalid product ID" });
      }

      const cart = await cartsService.loadOneCart(cartId);
      if (!cart) {
          return res.status(404).send({ status: "error", error: "Cart not found" });
      }

      const product = await productsService.getProductById(productId);
      if (!product) {
          return res.status(404).send({ status: "error", error: "Product not found" });
      }


      const existingProductInCart = cart.productsInCart.find(item => item.product._id.toString() === productId);

      if (existingProductInCart) {
       
          existingProductInCart.quantity += 1;
      } else {
    
          cart.productsInCart.push({ product, quantity: 1 });
      }

      await cartsService.saveCart(cart);
      res.send({
          status: "success",
          message: `${product.name} added to cart with ID ${cartId}`,
          cart
      });
  } catch (error) {
      console.error('Error adding product to cart:', error.message);
      res.status(500).send({ status: "error", error: 'Error adding product to cart: ' + error.message });
  }
};


const updateProductsInCart = async (req, res) => {
    try {
        const newValues = req.body;

        if (!newValues || !Array.isArray(newValues)) {
            return res.status(400).send({ status: "error", error: "Invalid data format" });
        }

        for (const product of newValues) {
            if (!product.quantity || typeof product.quantity !== "number" || product.quantity < 0) {
                return res.status(400).send({ status: "error", error: "Invalid product format" });
            }

            if (!mongoose.Types.ObjectId.isValid(product._id)) {
                return res.status(400).send({ status: "error", error: "Invalid ObjectId format" });
            }
        }

        const cartId = req.params.cid;

        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            return res.status(400).send({ status: "error", error: "Invalid cart ID" });
        }

        const cart = await cartsService.loadOneCart(cartId);
        if (!cart) {
            return res.status(404).send({ status: "error", error: "Cart not found" });
        }

        const productIds = newValues.map(product => product._id);

        const products = await productsService.find({ _id: { $in: productIds } });

        if (products.length !== newValues.length) {
            return res.status(404).send({ status: "error", error: "Some products not found" });
        }

        await cartsService.updateCart({ _id: cartId }, { $set: { products: newValues } });

        const updatedCart = await cartsService.loadOneCart(cartId);
        const populateCart = await cartsService.populateCart(updatedCart);

        res.send({
            status: "success",
            message: "Products in cart successfully updated",
            cart: populateCart,
        });
    } catch (error) {
        console.error('Error updating products in cart:', error.message);
        res.status(500).send({ status: "error", error: 'Error updating products in cart: ' + error.message });
    }
};

/*const deleteProductById = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            return res.status(400).send({ status: "error", error: "Invalid cart ID" });
        }
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).send({ status: "error", error: "Invalid product ID" });
        }

        const cart = await cartsService.loadOneCart(cartId);
        if (!cart) {
            return res.status(404).send({ status: "error", error: "Cart not found" });
        }

        const productInCart = cart.productsInCart.find(item => item.product.toString() === productId);
        if (!productInCart) {
            return res.status(404).send({ status: "error", error: "Product not found in cart" });
        }

        await cartsService.updateCart({ _id: cartId }, { $pull: { productsInCart: { product: productId } } });
        const updatedCart = await cartsService.loadOneCart(cartId);
        const populateCart = await cartsService.populateCart(updatedCart);

        res.send({
            status: "success",
            message: "Product deleted successfully",
            cart: populateCart,
        });
    } catch (error) {
        console.error('Error deleting product from cart:', error.message);
        res.status(500).send({ status: "error", error: 'Error deleting product from cart: ' + error.message });
    }
};*/
const deleteProductById = async (req, res) => {
  try {
      const cartId = req.params.cid;
      const productId = req.params.pid;

      if (!mongoose.Types.ObjectId.isValid(cartId)) {
          return res.status(400).send({ status: "error", error: "Invalid cart ID" });
      }
      if (!mongoose.Types.ObjectId.isValid(productId)) {
          return res.status(400).send({ status: "error", error: "Invalid product ID" });
      }

      const cart = await cartsService.loadOneCart(cartId);
      if (!cart) {
          return res.status(404).send({ status: "error", error: "Cart not found" });
      }

      const productInCart = cart.productsInCart.find(item => item.product.toString() === productId);
      if (!productInCart) {
          return res.status(404).send({ status: "error", error: "Product not found in cart" });
      }

      await cartsService.updateCart({ _id: cartId }, { $pull: { productsInCart: { product: productId } } });

      // Recarga el carrito y usa populate para obtener detalles completos de los productos
      const updatedCart = await cartsService.loadOneCart(cartId);
      const populatedCart = await cartsService.populateCart(updatedCart, 'productsInCart.product');

      res.send({
          status: "success",
          message: "Product deleted successfully",
          cart: populatedCart,
      });
  } catch (error) {
      console.error('Error deleting product from cart:', error.message);
      res.status(500).send({ status: "error", error: 'Error deleting product from cart: ' + error.message });
  }
};

const clear = async (req, res) => {
    try {
        const cartId = req.params.cid;

        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            return res.status(400).send({ status: "error", error: "Invalid cart ID" });
        }

        const cart = await cartsService.loadOneCart(cartId);
        if (!cart) {
            return res.status(404).send({ status: "error", error: "Cart not found" });
        }

        const result = await cartsService.clearCart(cartId);

        res.send({
            status: "success",
            message: "Cart cleared successfully",
            cart: result,
        });
    } catch (error) {
        console.error('Error clearing cart:', error.message);
        res.status(500).send({ status: "error", error: 'Error clearing cart: ' + error.message });
    }
};

const purchase = async (req, res) => {
    try {
        const buyerId = req.user.id;

        const buyer = await usersService.getUserById(buyerId);
        if (!buyer || !buyer.email) {
            return res.status(404).send({ status: "error", message: "User not found or missing email" });
        }

        const email = buyer.email;
        const buyerCart = req.params.cid;

        if (!mongoose.Types.ObjectId.isValid(buyerCart)) {
            return res.status(400).send({ status: "error", error: "Invalid cart ID" });
        }

        const cart = await cartsService.loadOneCart(buyerCart);
        if (!cart || cart.productsInCart.length === 0) {
            return res.status(400).send({ status: "error", error: "Cart is empty or not found" });
        }

        const inStock = [];
        const outOfStock = [];

        for (const item of cart.productsInCart) {
            const product = await productsService.getProductById(item.product);
            if (product.stock >= item.quantity) {
                inStock.push({
                    id: product._id,
                    total: product.price * item.quantity,
                    quantity: item.quantity,
                    stock: product.stock,
                });
            } else {
                outOfStock.push({
                    id: product._id,
                    quantity: item.quantity,
                    available: product.stock,
                });
            }
        }

        if (outOfStock.length > 0) {
            return res.status(406).send({
                status: "error",
                message: "Some products are out of stock",
                payload: outOfStock,
            });
        }

        const totalAmount = inStock.reduce((sum, product) => sum + product.total, 0);

        const dateTimeOfPurchase = new Date().toISOString();
        const purchaseInfo = {
            amount: totalAmount,
            client: email,
            dateTimeOfPurchase,
            code: new mongoose.Types.ObjectId(),
        };

        const ticket = await ticketService.createTicket(purchaseInfo);

        for (const product of inStock) {
            const newStock = product.stock - product.quantity;
            await productsService.updateProduct(product.id, { stock: newStock });
        }

        await cartsService.clearCart(buyerCart);

        res.send({
            status: "success",
            message: "Purchase successful",
            payload: ticket,
        });
    } catch (error) {
        console.error('Error completing purchase:', error.message);
        res.status(500).send({ status: "error", error: 'Error completing purchase: ' + error.message });
    }
};

export default {
    getNewCart,
    getCartById,
    addProductToCart,
    updateProductsInCart,
    deleteProductById,
    clear,
    purchase,
};
