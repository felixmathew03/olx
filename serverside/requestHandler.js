import userSchema from './models/user.model.js';
import productSchema from "./models/product.model.js";
import listSchema from "./models/wishlist.model.js";
import bookingSchema from "./models/book.model.js"
import bcrypt from 'bcrypt';
import pkg from "jsonwebtoken";
import nodemailer from "nodemailer";

const {sign}=pkg;
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "1faec768913b11",
      pass: "c2dc2c8c40afba",
    },
});

export async function getProducts(req,res) {
    try {
        if (req.user!==null) {
            const _id = req.user.userId;
            const user = await userSchema.findOne({_id});
            const products1=await productSchema.find({sellerId:{$ne:_id}});
            const wlist=await listSchema.find({buyerId:_id});
            return res.status(200).send({products1,profile:user.profile,id:_id,wlist})
        }else{
            const products=await productSchema.find();
            return res.status(403).send({products,msg:"Login for better user experience"})
        }   
    } catch (error) {
        res.status(404).send({msg:"error"})
    }
}
export async function getProductss(req,res) {
    try {
        const products=await productSchema.find();
        res.status(200).send(products)
    } catch (error) {
        res.status(404).send({msg:"error"})
    }
}

export async function getUser(req,res) {
    try {
        const {id}=req.params;
        const user=await userSchema.findOne({_id:id});
        const count=await bookingSchema.countDocuments({sellerId:id});
        res.status(200).send({user,count});
    } catch (error) {
        res.status(404).send(error)
    }
}

export async function signUp(req,res) {
    try{

        const {email,username,password,cpassword,place,profile,address,phone,pincode} = req.body;
        if(!(email&& username&& password&& cpassword))
            return res.status(404).send({msg:"fields are empty"})
        if(password !== cpassword)
            return res.status(404).send({msg:"password not matching"})
        bcrypt
        .hash(password,10)
        .then((hashedPassword)=>{
            userSchema
            .create({email,username,password:hashedPassword,place,profile,address,phone,pincode})
            .then(()=>{
                return res.status(201).send({msg:"successs"})
            })
            .catch((error)=>{
                return res.status(404).send({msg:"not registered"})
            })
        })
    }
     catch(error){
        return res.status(404).send({msg:error})
    }  
}

export async function signIn(req,res) {
    const{email,password}=req.body;
    if(!(email&& password))
        return res.status(404).send({msg:"fields are empty"});
    const user=await userSchema.findOne({email});
    if(user===null){
        return res.status(404).send({msg:"Invalid username"});
    }
    const success=await bcrypt.compare(password,user.password);
    if(success!==true)
        return res.status(404).send({msg:"email or password is invalid"});

    const token = await sign({userId:user._id},process.env.JWT_KEY,{expiresIn:"24h"});
    return res.status(200).send({msg:"successfully logged in",token})
}

export async function editUser(req,res) {
    try {
        const {_id}=req.params;
    const {...user}=req.body;
    const data=await userSchema.updateOne({_id},{$set:{...user}});
    res.status(201).send(data);
    } catch (error) {
        res.status(404).send(error);
    }
    
}

export async function addProduct(req,res) {
    try {
        const {pname,price,category,description,sellerId,images} = req.body;
        if(!(pname&&price&&category&&description&&sellerId&&images))
            return res.status(404).send({msg:"fields are empty"})
        productSchema
            .create({pname,price,category,description,sellerId,images})
            .then(()=>{
                return res.status(201).send({msg:"successs"})
            })
            .catch((error)=>{
                return res.status(404).send({msg:"product not added"})
            })
    } catch (error) {
        res.status(404).send(error);
    }
}

export async function getSProducts(req,res) {
    try {
        const {id}=req.params;
        const products=await productSchema.find({sellerId:id});
        res.status(200).send(products);
    } catch (error) {
        res.status(404).send(error)
    }
}

export async function getProduct(req,res) {
    try {
        const {_id}=req.params;
        const product=await productSchema.findOne({_id});
        res.status(200).send(product);
    } catch (error) {
        res.status(404).send(error)
    }
}

export async function editProduct(req,res) {
    try {
        const {_id}=req.params;
    const {...product}=req.body;
    const data=await productSchema.updateOne({_id},{$set:{...product}});
    res.status(201).send(data);
    } catch (error) {
        res.status(404).send(error);
    }
}

export async function addWish(req,res) {
    try {
        const {...wishlist} = req.body;
        
        listSchema
            .create({...wishlist})
            .then(()=>{
                return res.status(201).send({msg:"successs"})
            })
            .catch((error)=>{
                return res.status(404).send({msg:"list not added"})
            })
    } catch (error) {
        res.status(404).send(error);
    }
}

export async function deleteWish(req,res) {
    try {
        const {id}=req.params;
        const result=await listSchema.deleteOne({"product._id":id})
        console.log(result);
        return res.status(201).send({msg:"deleted"});
    } catch (error) {
        return res.status(404).send(error)
    }  
}

export async function forgetPassword(req,res) {
    const {email}=req.body;
    const user=await userSchema.findOne({email});
    if(!user)
        return res.status(403).send({msg:"User not exist"})
    const otp=Math.floor(Math.random()*1000000);
    const update=await userSchema.updateOne({email},{$set:{otp:otp}})
    console.log(update);
    
     // send mail with defined transport object
    // const info = await transporter.sendMail({
    //     from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
    //     to: "bar@example.com, baz@example.com", // list of receivers
    //     subject: "OTP", // Subject line
    //     text: "your otp", // plain text body
    //     html: `<h1>${otp}</h1>`, // html body
    // });

    // console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    console.log(otp);
    return res.status(201).send({email});
}

export async function otpCheck(req,res) {
    const {email,otp}=req.body;
    const check=await userSchema.findOne({$and:[{email:email},{otp:otp}]})
    if(!check)
        return res.status(403).send({msg:"Otp does not match"})
    return res.status(200).send({msg:"OTP matched successfully"})
}

export async function resetPassword(req,res) {
    const {email,password}=req.body;
    const update=await userSchema.updateOne({email},{$set:{otp:""}})
    bcrypt.hash(password,10).then((hashedPassword)=>{
        console.log(hashedPassword);
        userSchema.updateOne({email},{$set:{password:hashedPassword}}).then(()=>{
            return res.status(200).send({msg:"success"});
        }).catch((error)=>{
            return res.status(404).send({msg:"Not registered"})
        })
    }).catch((error)=>{
        return res.status(404).send({msg:error}); 
    })
}

export async function booking(req,res) {
    try {
        if (req.user!==null) {
            const _id = req.user.userId;
            const {product,date} = req.body;
            const buyer=await userSchema.findOne({_id},{username:1,place:1,phone:1});
            bookingSchema.create({sellerId:product.sellerId,buyerId:_id,date,buyer,product})
            .then(()=>{
                return res.status(201).send({msg:"Booking Successfull"});
            })
            .catch((error)=>{
                return res.status(404).send({msg:"product not added"});
            })
        }else{
            return res.status(403).send({products,msg:"Something went wrong"});
        }   
    } catch (error) {
        res.status(404).send({msg:"error"});
    }
}

export async function getUBookings(req,res) {
    try {
        const {buyerId}=req.params;
        const bookings=await bookingSchema.find({buyerId});
        res.status(200).send(bookings);
    } catch (error) {
        res.status(404).send(error)
    }
}

export async function deleteAccount(req,res) {
    const {_id}=req.params;
    const otp=Math.floor(Math.random()*1000000);
    const update=await userSchema.updateOne({_id},{$set:{otp:otp}})
    console.log(update);
    
     // send mail with defined transport object
    // const info = await transporter.sendMail({
    //     from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
    //     to: "bar@example.com, baz@example.com", // list of receivers
    //     subject: "OTP", // Subject line
    //     text: "your otp", // plain text body
    //     html: `<h1>${otp}</h1>`, // html body
    // });

    // console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    console.log(otp);
    return res.status(201).send({_id}); 
}

export async function accountOTP(req,res) {
    try {
        console.log("Hai");
        const {_id,otp}=req.body;
        console.log(_id,otp);
        
        const check=await userSchema.findOne({$and:[{_id:_id},{otp:otp}]})
        console.log(check);
        
        if(!check)
            return res.status(403).send({msg:"Otp does not match"})
        const result=await userSchema.deleteOne({email:check.email})
        console.log(result);
        
        return res.status(201).send({msg:"Your account is deleted"});
    } catch (error) {
        return res.status(404).send({msg:error})
    }  
}

export async function getSBookings(req,res) {
    try {
        const {sellerId}=req.params;
        const bookings=await bookingSchema.find({sellerId});
        res.status(200).send(bookings);
    } catch (error) {
        res.status(404).send(error)
    }
}

export async function deleteBooking(req,res) {
    try {
        const {_id}=req.body;
        console.log(_id);
        const result=await bookingSchema.deleteOne({_id})
        return res.status(201).send({msg:"Booking deleted"});
    } catch (error) {
        return res.status(404).send({msg:error})
    }  
}

export async function getOrders(req,res) {
    try {
        const {buyerId}=req.params;
        const orders=await bookingSchema.find({buyerId});
        res.status(200).send(orders);
    } catch (error) {
        res.status(404).send(error)
    }
}
