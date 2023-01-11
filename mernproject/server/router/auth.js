const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const authentication = require("../middleware/authentication");
const User = require("../model/userSchema");

// Middleware
//This will execute first
// const middleware = (req,res,next)=>{
    //     // console.log("First");
    //     next();
    // }
    
    //This is also a middleware: je value form mathi ave 6 e json ma ave 6 ene ahi object ma parse karva aa vapray 6
    router.use(express.json());
    const cookieParser = require("cookie-parser");
    router.use(cookieParser);

router.get('/',(req,res)=>{
    res.send("Hello");
})

router.post('/register',async(req,res)=>{
    const {name,email,phone,work,password,cpassword} = req.body;

    if(!name || !email || !phone || !work || !password || !cpassword)
    {
        return res.status(422).json({error: "Plz filled the field"});
    }

    try{
        const userExist  = await User.findOne({email: email}); //first email che e schema nu 6, biju user je enter karse e 6
  
        if(userExist)
        {
            return res.status(422).json({error: "User is already there"});
        }
        else if(password !== cpassword)
        {
            return res.status(422).json({error: "passwords are not matching"});
        }
        const newUser = new User({name:name,email:email,phone:phone,work:work,password:password,cpassword:cpassword});
        //only avu bi lakhi sakay...const newUser = new User({name,email,phone,work,password,cpassword});
    
        //Aa execute thata pehla password hash thse
        await newUser.save();
        res.status(201).json({message: "Yes"});
    }catch (error) {
        res.status(401).json({error: "Fail to register"});
        console.log(error);
    } 
  })

router.post('/login',async(req,res)=>{
    const {email,password} = req.body;

    try {
        if(!email || !password)
        {
            return res.status(422).json({error: "Plz filled the field"});   
        }
        const userExist =await User.findOne({email:email});

        if(userExist)
        {
            const isMatch = await bcrypt.compare(password,userExist.password);
            if(isMatch)
            {
                const token = await userExist.generateAuthToken();
                console.log(token);
                res.cookie("jwtoken", token ,{
                   expires: new Date(Date.now() + 25892000000),
                   httpOnly: true
                })
                res.json({message: "Done Login"});
            }
            else
            {
                res.status(401).json("Invalid creditianls");
            }
        }
        else
        {
            res.status(401).json("Invalid creditianls");
        }
    } catch (error) {
        console.log("Error: ",error);
    }
})

// router.get('/about',middleware,(req,res)=>{
//     // console.log("Second");
//     res.send("Hello about");
// })

router.get('/contact',(req,res)=>{
    res.send("Hello contact");
})

router.get('/signin',(req,res)=>{
    res.send("Hello login");
})

router.get('/signup',(req,res)=>{
    res.send("Hello register");
})

// Special `about us` page
router.get('/about',authentication,(req,res)=>{
    console.log(req.userexistornot);
    res.send(req.userexistornot);  //G
})

router.get("/getdata",authentication,(req,res)=>{
    res.send(req.userexistornot);
})

module.exports = router;