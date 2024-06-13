const express =require("express")
const mongoose=require("mongoose")
const cors =require("cors")
const app =express()
const bcrypt = require("bcryptjs") //import encryption package
const jwt =require("jsonwebtoken")//importing token library
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://hannasherin:Alazhar4@cluster0.agtcb.mongodb.net/ksrsampleDb?retryWrites=true&w=majority&appName=Cluster0")

const generateHashedpswd = async(password)=>{
    const salt = await bcrypt.genSalt(10)//salt is a cost factor
    return bcrypt.hash(password,salt)
}



const {ksrtcmodel} = require("./models/ksrtc")

app.post("/signup",async(req,res)=>{
    let input = req.body
    let hashedpswd=await generateHashedpswd(input.password)
    console.log(hashedpswd)
    input.password=hashedpswd//this is for getting hashed password in db
    let ksrtcusers = new ksrtcmodel(input)
    ksrtcusers.save()
    res.json({"status":"SIGNUP"})
})

//login api - here we need async as the password is encrypted
app.post("/login",(req,res)=>{
let input =req.body
//we are checking with mail id
ksrtcmodel.find({"emailid":req.body.emailid}).then(
    (response)=>{
        if(response.length>0)
            {
                let dbpass =response[0].password
                console.log(dbpass)
                bcrypt.compare(input.password,dbpass,(error,isMatch)=>{
                    if (isMatch) {
                        //if login success generate token
                        jwt.sign({email:input.email},"ksrtc-app",{expiresIn:"1d"},
                            (error,token)=>{
                            if (error) {
                                res.json({"status":"unable to create token"})
                            } else {
                                res.json({"status":"success","userid":response[0]._id,"token":token})
                            }
                        })//blog-app is the name of the token
                    } else {
                        res.json({"status":"incorrect password"})
                    }
                })
            }
        else{
            res.json({"status":"user not found"})
        }
    }
)
})

app.post("/view",(req,res)=>{
    let token = req.headers["token"]
    jwt.verify(token,"ksrtc-app",(error,decoded)=>{
        if (error) {
            res.json({"status":"unauthorized access"})
        } else {
            if(decoded)
                {
                    ksrtcmodel.find().then(
                        (response)=>{
                            res.json(response)
                        }
                    ).catch()
                }
        }
    })
    
})

app.get("/viewsign",(req,res)=>{
    ksrtcmodel.find().then((data)=>{
        res.json(data)
    }).catch((error)=>{
        res.json(error)
    })
})



app.listen(8089,()=>{
    console.log("server started")
})