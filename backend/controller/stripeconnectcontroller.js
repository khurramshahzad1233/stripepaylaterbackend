import catchasyncerror from "../middleware/catchasyncerror.js";
import Errorhandler from "../utils/errorhandler.js"
import dotenv from "dotenv"
if(process.env.NODE_ENV!=="PRODUCTION"){
    dotenv.config({path:"backend/config.env"})
};
import stripe from "stripe";
import crypto from "crypto"

let secretKey=process.env.STRIPE_SECRET_KEY;
let stripeapikey=process.env.STRIPE_API_KEY;

// stripe publishable key 
export const getstripeapikey=catchasyncerror(async(req,res,next)=>{
    if(!stripeapikey){
        return next(new Errorhandler("missing key, not found",400))
    }
    res.status(200).json({
        success:true,
        stripepublishablekey:stripeapikey,
    })
})


// create teacher account
export const createteacheraccount=catchasyncerror(async(req,res,next)=>{
    
    const stripeClient = new stripe(secretKey,{
        apiVersion:"2022-11-15"
    });
    const country=req.body.country;
    if(!country){
        return next(new Errorhandler("Please enter country code",400))
    }


    const account = await stripeClient.accounts.create({
        country:country,
        type: 'express',
        capabilities: {
            card_payments: {
              requested: true,
            },
            transfers: {
              requested: true,
            },
          },
        //   business_type:"individual",
          business_profile:{
            url:"https://www.Tutorschamp.com",
          },
        
        });
        let connectedId=account.id
        res.status(200).json({
            success:true,
            connectedId
        })


        });


        // create teacher account link
        export const creatteacheraccountlink=catchasyncerror(async(req,res,next)=>{
    
            const stripeClient = new stripe(secretKey,{
                apiVersion:"2022-11-15"
            });
        
            const connectedId=req.body.connectedId;
            if(!connectedId){
                return next(new Errorhandler("Please enter connected account id",400))
            }
            const accountlink = await stripeClient.accountLinks.create({
                account: connectedId,
                type:"account_onboarding",
                return_url:"http://localhost:5000/success/account",
                refresh_url:"http://localhost:5000/error",

                
                });
                let accountLinkURL=accountlink.url;
                res.status(200).json({
                    success:true,
                    accountLinkURL,
                })
        
        
                });


                // check create account status teacher
                export const checkaccountstatus=catchasyncerror(async(req,res,next)=>{
    
                    const stripeClient = new stripe(secretKey,{
                        apiVersion:"2022-11-15"
                    });
                
                
                    const teacheraccountid=req.body.connectedid;

                    
                    if(!teacheraccountid){
                        return next(new Errorhandler("teacher account id missing",400))
                    }
                    const account = await stripeClient.accounts.retrieve(teacheraccountid);
                    let accountactivestatus="";
                    if(account?.charges_enabled===true){
                        accountactivestatus="active"
                    }else{
                        accountactivestatus="not active yet"
                    }
        
                        res.status(200).json({
                            success:true,
                            accountactivestatus,
                        })
                
                
                        });


                // create a payment intent

                // export const createPaymentIntent=catchasyncerror(async(req,res,next)=>{
                //     const stripeClient = new stripe(secretKey);
                //     let totalAmount=req.body.amount*100;
                //     let plateformAmount=totalAmount*0.20;
                //     let teacherAmount=totalAmount*0.80;
                //     let currency=req.body.currencyname;
                //     let paymentMethodId=req.body.paymentintentid;
                //     let teacheraccount=req.body.teacheraccountid;

                //     if(!totalAmount ||!currency ||!paymentMethodId ||!teacheraccount){
                //         return next(new Errorhandler("missing required parameters",400))
                //     }
                    
                //     const paymentIntent=await stripeClient.paymentIntents.create({

                //         payment_method:paymentMethodId,
                //         amount:teacherAmount,
                //         currency:currency,
                //         automatic_payment_methods:{
                //             enabled:true,
                //             allow_redirects:"never"
                //         },
                //         payment_method_options:{
                //             card:{
                //                 capture_method:'manual',
                //             },
                //         },
                //         application_fee_amount:plateformAmount,
                //         transfer_data:{
                //             destination:teacheraccount
                //         },
                //         confirm:true,
                //     });
                //     res.status(200).json({
                //         success:true,
                //         paymentIntent,
                //     })
                // });



                


                // // check payment status 

                // export const checkpaymentstatus=catchasyncerror(async(req,res,next)=>{
                //     const clientintent=req.body.clientintent;
                //     const stripeClient = new stripe(secretKey);

                //     if(!clientintent){
                //         return next(new Errorhandler("clientintent value is missing, try again please",400))
                //     }

                //     const paymenIntent=await stripeClient.paymentIntents.retrieve(clientintent)
                //     let paymentstatus=""
                //     if(paymenIntent && paymenIntent.status === "requires_capture"){
                //         paymentstatus=paymenIntent.status

                //     }else{
                //         paymentstatus=paymenIntent.status
                //     }
                    
                //     res.status(200).json({
                //         success:true,
                //         paymentstatus,
                //     })
                    
                // });



                // // capture funds the one hold on 

                // export const captureholdfunds=catchasyncerror(async(req,res,next)=>{
                //     let paymentid=req.body.paymentId;

                //     if(!paymentid){
                //         return next(new Errorhandler("Please enter paymentid",400))
                //     }

                //     const stripeClient = new stripe(secretKey);

                //     const payment=await stripeClient.paymentIntents.capture(paymentid);
                    
                //     res.status(200).json({
                //         success:true,
                //         payment
                //     })
                    
                // });


                // / create a payment intent

                export const createPaymentIntent=catchasyncerror(async(req,res,next)=>{
                    const stripeClient = new stripe(secretKey);
                    let totalAmount=req.body.amount*100;
                    let currency=req.body.currencyname;
                    let teacheraccount=req.body.teacheraccountid;

                    if(!totalAmount ||!currency ||!teacheraccount){
                        return next(new Errorhandler("missing required parameters",400))
                    };

                    let token=crypto.randomBytes(20).toString("hex")
                    let uniqueId=crypto.createHash("sha256").update(token).digest('hex');
                    let transfergroupId=uniqueId.slice(0,16);
                    
                    const paymentIntent=await stripeClient.paymentIntents.create({

                        amount:totalAmount,
                        currency:currency,
                        automatic_payment_methods:{
                            enabled:true,
                        },
                        // on_behalf_of:teacheraccount
                        metadata:{
                            connectedId:teacheraccount,
                        },
                        transfer_group:transfergroupId
                        
                    });
                    
                    res.status(200).json({
                        success:true,
                        clientSecret:paymentIntent.client_secret,
                        // connectedId:paymentIntent.metadata.connectedId,
                        // transferGroupId:paymentIntent.transfer_group
                        
                    })
                });



                // first pay to plateform account then get a charge reference from it
                // export const createPaymenttref=catchasyncerror(async(req,res,next)=>{
                //     const stripeClient = new stripe(secretKey);
                //     let totalAmount=10000
        
        
                //     const paymentIntent=await stripeClient.paymentIntents.create({
                //         amount:totalAmount,
                //         currency:"usd",
                //         automatic_payment_methods:{
                //             enabled:true,
                //         },
                //         on_behalf_of:"acct_1NehzmQK1BAyvZUk"
                //     })
                    
                   
                //     res.status(200).json({
                //         success:true,
                //         clientSecret:paymentIntent.client_secret,
                //     })
        
                    
        
                // });


                // get charge id and payment details

                export const chargeid=catchasyncerror(async(req,res,next)=>{
                    let paymentintent=req.body.paymentintent;
                    const stripeClient=new stripe(secretKey);
                    
                    const paymentIntent=await stripeClient.paymentIntents.retrieve(paymentintent);

                    
                    const amount=paymentIntent.amount_received*0.01;
                    const chargeid=paymentIntent.latest_charge;
                    const transferGroupId=paymentIntent.transfer_group;
                    const currency=paymentIntent.currency;
                    const paymentstatus=paymentIntent.status;
                    const connectedId=paymentIntent.metadata.connectedId
                    

                    res.status(200).json({
                        success:true,
                        paymentstatus,
                        amount,
                        currency,
                        amount,
                        chargeid,
                        transferGroupId,
                        connectedId,
                        
                        

                    })

                })
        
        
                export const transferPayment=catchasyncerror(async(req,res,next)=>{
                    const stripeClient = new stripe(secretKey);
                    let totalamount=req.body.amount*100;
                    let transferamount=totalamount*0.80;
                    let currency=req.body.currency;
                    let connectedid=req.body.connectedid;
                    let transfergroupid=req.body.transfergroupid;
                    
                    const transfer=await stripeClient.transfers.create({
                        amount:transferamount,
                        currency:currency,
                        destination:connectedid,
                        transfer_group:transfergroupid
                    })
                    res.status(200).json({
                        success:true,
                        transfer,
                    })
        
                    
        
                });

                // refund to customer 
                export const refundcustomer=catchasyncerror(async(req,res,next)=>{

                    const stripeClient=new stripe(secretKey);

                    let chargeId=req.body.chargeid
                    const refund=await stripeClient.refunds.create({charge:chargeId});

                    let refundid=refund.id;
                    let refundstatus=refund.status;
                    res.status(200).json({
                        success:true,
                        refundid,
                        refundstatus,
                    })
                })
        

                
                
        