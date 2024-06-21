const express = require("express")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const userModel = require('./models/user.model.js')
const bcrypt = require("bcrypt")
const cors = require("cors")

const path = require('path')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname,"public")))
app.use(cookieParser())
app.use(cors())

app.get('/' , (req,res) => {
    res.render("index")
})

app.post('/create' ,  (req,res) => {
    let {username , email, password , age } = req.body

    bcrypt.genSalt(10 , (err,salt) => {
        bcrypt.hash(password,salt, async (err,hash) => {
            let createdUser = await userModel.create({
                username,
                email,
                password : hash,
                age
            })

            let token = jwt.sign({email} , "kjkkjjkjkjjjkjjhhdhd")
            res.cookie("token" , token)

            res.send(createdUser)
            // res.status(200).json({message : "User Updated" , success : true , user : createdUser})
        })
    })

    
})

app.get('/login' , (req,res) => {
    res.render("login")
})



app.post('/login' ,async (req,res) => {
    let user = await userModel.findOne({email : req.body.email})

    if(!user) return res.send("Something is wrong !!! ")

    bcrypt.compare(req.body.password, user.password , (err,result) => {
        console.log(result)
    })    
})

app.get('/logout' , (req,res) => {
    res.cookie("token" , "")
    res.redirect("/")
})

app.listen("2001")