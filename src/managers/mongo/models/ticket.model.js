import mongoose from "mongoose";

const collection = "Ticket"

const schema = new mongoose.Schema({
    code: {
        type: String,
        require: true,
      },
      dateTimeOfPurchase: {
        type: Date,
        require: false,
      },
      amount: {
        type: String,
        unique: false,
      },
      client: {
        type: String,
        require: false,
      },
})

const Ticket = mongoose.model(collection, schema);
export default Ticket