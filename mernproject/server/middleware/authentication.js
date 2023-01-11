const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const authentication = async(req,res,next)=>{
    try {
        const token = req.cookies.jwtoken;  //Website par cookie je naam thi save thayeli 6 tenu naam jwtoken che
        const verifytoken = jwt.verify(token,process.env.SECRET_KEY); //it will verify user's token with our secret key
        console.log(verifytoken);
        const userexistornot = User.findOne({_id: verifytoken._id,"tokens.token":token}) //It will find the user from that token..because from token also we can find id of that user...so that id and id of user which is stored on db will be compared
       console.log(userexistornot);

        if(!userexistornot)
        {
            throw new Error("User not found");
        }

        //userexistornot ma user ni je details db ma save hse e badhi aai gayi hase e badhi details website par lai jaisu
        req.token = token;
        req.userexistornot = userexistornot;
        req.userId = userexistornot._id;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).send("User is not authenticated");
    }
}

module.exports = authentication;