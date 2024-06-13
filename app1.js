const express =require("express")
const mongoose=require("mongoose")
const cors =require("cors")
const app =express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://hannasherin:Alazhar4@cluster0.agtcb.mongodb.net/ksrsamplbuseDb?retryWrites=true&w=majority&appName=Cluster0")

const generateHashedpswd = async(password)=>{
    const salt = await bcrypt.genSalt(10)//salt is a cost factor
    return bcrypt.hash(password,salt)
}



const {busmodel} = require("./models/bus")


app.get("/viewbus",(req,res)=>{
    busmodel.find().then((data)=>{
        res.json(data)
    }).catch((error)=>{
        res.json(error)
    })
})


app.post("/addbus",(req,res)=>{
    let input=req.body
    let bus=new busmodel(input)
    bus.save()
    console.log(bus)
    res.json({"status":"success"})
})

app.post("/searchbus",(req,res)=>{
    let input=req.body
    busmodel.find(input).then((data)=>{
        res.json(data)
    }
    ).catch((error)=>{
        res.json(error)
    })
})



app.listen(8083,()=>{
    console.log("server started")
})