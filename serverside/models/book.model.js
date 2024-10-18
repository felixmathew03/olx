import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema({
    buyerId:{type:String},
    sellerId:{type:String},
    product:{type:Object}
})
export default mongoose.model.Bookings||mongoose.model("Booking",bookingSchema);