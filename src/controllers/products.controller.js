import mongoose from "mongoose";

import { productsService } from "../managers/index.js";


const getAllProducts = async(req,res)=>{
    const products = await productsService.loadProducts();
    const limit = parseInt(req.query.limit);
    if (!isNaN(limit) && limit > 0) {
        res.json(products.slice(0, limit));
    } else {
        res.json(products);
    }
}

const createNewProduct = async(req, res) => {
    try {
        const price = parseFloat(req.body.price);
        const stock = parseInt(req.body.stock);

        if (isNaN(price) || isNaN(stock)) {
            return res.send(400).send({ status: "error", error: "Price and stock must be valid numbers." });
        }

        const newProduct = {
            name: req.body.name,
            title: req.body.title,
            description: req.body.description,
            code: req.body.code,
            price: price,  
            status: req.body.status === 'true' || req.body.status === '1' || req.body.status === true || req.body.status === 'true',
            stock: stock,
            category: req.body.category
        };

        const savedProduct = await productsService.saveProduct(newProduct);

        res.status(201).send({ message: "Producto agregado", product: savedProduct });

        console.log('Producto agregado:', savedProduct);
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
}
const updateProduct = async(req, res)=>{
    try { 
        const pid = req.params.pid;
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).send({ status: "error", error: "Invalid product ID" });
        }
        const product = await productsService.getProductById(pid)
        if(!product){
            return res.status(404).send({status:"error", error:"product not found"})
        }
        const updatedProduct = {
          name:req.body.name,
          title:req.body.title,
          description:req.body.description,
          code:req.body.code,
          price:parseInt(req.body.price),
          status:req.body.status === 'true' || req.body.status === '1',
          stock:parseInt(req.body.stock),
          category:req.body.category
        }
        await productsService.updateProduct(pid, updatedProduct)
        res.send(`Succesfully updated product with id ${pid}`)
        } catch (error) {
            console.error('Error updating product:', error.message);
            res.status(500).send({ status: "error", error: "Could not update product: " + error.message });
        }
      
}

const deleteProduct = async (req, res)=>{
    try{    
        const pid = req.params.pid;
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).send({ status: "error", error: "Invalid product ID" });
        }
        const result = await productsService.deleteProductById(pid)
        if (!result) {
            return res.status(404).send({ status: "error", error: "Product not found or already deleted" });
        }
        res.send(`Succesfully deleted product with id ${pid}`)
        }catch (error) {
            console.error('Error deleting product:', error.message);
            res.status(500).send({ status: "error", error: "Could not delete product: " + error.message });
        }
}


export default {
    getAllProducts,
    createNewProduct,
    updateProduct,
    deleteProduct
}