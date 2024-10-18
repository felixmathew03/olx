import { Router } from "express";
import * as prod from "./requestHandler.js";
import Auth from './middleware/Auth.js'

const router=Router();

router.route("/getproducts").get(Auth,prod.getProducts);
router.route("/getproductss").get(prod.getProductss);
router.route("/signup").post(prod.signUp);
router.route("/signin").post(prod.signIn);
router.route("/getuser/:id").get(prod.getUser)
router.route("/edituser/:_id").put(prod.editUser)
router.route("/addproduct").post(prod.addProduct);
router.route("/getsproducts/:id").get(prod.getSProducts);
router.route("/getproduct/:_id").get(prod.getProduct);
router.route("/editproduct/:_id").put(prod.editProduct);
router.route("/addwish").post(prod.addWish);
router.route("/deletewlist/:id").delete(prod.deleteWish);
router.route("/otp").post(prod.forgetPassword);
router.route("/otpcheck").post(prod.otpCheck);
router.route("/resetpassword").post(prod.resetPassword);
router.route("/setBooking").post(Auth,prod.booking);
router.route("/getubookings/:buyerId").get(prod.getUBookings);
router.route("/deleteaccount/:_id").post(prod.deleteAccount);
router.route("/accountotp").delete(prod.accountOTP);

export default router;