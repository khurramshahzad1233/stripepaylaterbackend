import app from "./app.js"
import dotenv from "dotenv"

if(process.env.NODE_ENV!=="PRODUCTION"){
    dotenv.config({path:"backend/config.env"})
};

const port=process.env.PORT || 5000

app.listen(port,"0.0.0.0",()=>{
    console.log(`server is running on port ${port}`)
})