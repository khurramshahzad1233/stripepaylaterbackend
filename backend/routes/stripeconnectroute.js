
import express from "express"
import { captureholdfunds, checkaccountstatus, checkpaymentstatus, createPaymentIntent, createteacheraccount, creatteacheraccountlink, getstripeapikey } from "../controller/stripeconnectcontroller.js";

const router=express.Router();
router.route("/stripe/publishablekey").post(getstripeapikey)
router.route("/stripe/user/new").post(createteacheraccount);
router.route("/stripe/account/link").post(creatteacheraccountlink);
router.route("/stripe/teacheraccountstatus").post(checkaccountstatus)
router.route('/stripe/paymentintent').post(createPaymentIntent);
router.route("/stripe/capturefund").post(captureholdfunds);
router.route("/stripe/paymentstatus").post(checkpaymentstatus)




export default router  ;