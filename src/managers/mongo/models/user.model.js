import mongoose from 'mongoose'

const collection = "User"

const usersSchema = new mongoose.Schema({
firstName:{
    type:String,
    required:true },
lastName:{
    type:String,
    required:true },
email: {
    type: String,
    unique: true,
    required: true
},
age: Number, 
password:{
    type:String,
    required:true },
cart:[
    {cart:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    }}
],
role:{
    type:String,
    required:true,
    enum:['user','admin'],
    default:'user' }
})


const UserModel = mongoose.model(collection, usersSchema);
export default UserModel;