
import express from "express"
import { chargeid, checkaccountstatus,  createPaymentIntent, createteacheraccount, creatteacheraccountlink, getstripeapikey, refundcustomer, transferPayment } from "../controller/stripeconnectcontroller.js";

const router=express.Router();
router.route("/stripe/publishablekey").get(getstripeapikey)
router.route("/stripe/user/new").post(createteacheraccount);
router.route("/stripe/account/link").post(creatteacheraccountlink);
router.route("/stripe/teacheraccountstatus").post(checkaccountstatus)
// router.route('/stripe/paymentintent').post(createPaymentIntent);
// router.route("/stripe/capturefund").post(captureholdfunds);
// router.route("/stripe/paymentstatus").post(checkpaymentstatus)
router.route('/stripe/paymentintent').post(createPaymentIntent);
router.route("/stripe/chargeid").get(chargeid)
router.route("/stripe/transfer").post(transferPayment);
router.route("/stripe/refund").post(refundcustomer)



export default router  ;