import UserModel from "./models/user.model.js";

export default class UserManager {

    getUsers(){
        return UserModel.find();
    }

    getUserById(userId){
        return UserModel.findById(userId)
    }
    getUserByEmail(userEmail){
        return UserModel.findOne({email:userEmail});
    }
    createUser(user){
        return UserModel.create(user);
    }
}