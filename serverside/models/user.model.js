import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    email:{type:String},
    username:{type:String},
    password:{type:String},
    place:{type:String},
    profile:{type:String},
    address:{type:String},
    phone:{type:Number},
    pincode:{type:Number},
    otp:{type:String}
})
export default mongoose.model.Users||mongoose.model("User",userSchema);