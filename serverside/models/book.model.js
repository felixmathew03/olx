import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema({
    sellerId:{type:String},
    buyerId:{type:String},
    date:{type:String},
    buyer:{type:Object},
    product:{type:Object}
})
export default mongoose.model.Bookings||mongoose.model("Booking",bookingSchema);