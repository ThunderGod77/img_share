const mongoose = require("./../db")
const { Schema } = mongoose;

const userSchema = new Schema({
    username:  String, 
    email: String,
    password:   String,
    ban : Boolean,
    userProfile: String
},{timestamps: true} );

const User = mongoose.model("User",userSchema)

const createUser = async(email,username,password)=>{
    const user = new User({email:email,username:username,password:password,ban:false,userProfile:"https://myspacelol.fra1.digitaloceanspaces.com/art/genericProfile.png" });
    const dbresponse = await  user.save()
    console.log("User created " + dbresponse.email)
}

exports.findUser = async(email,username)=>{
    try {
        const result = await User.findOne({ $or: [{username:username},{email:email}]});
        
        return({err:false,user:result})    
    } catch (error) {
        console.log(error)
        return({err:true,user:{}})
    }
    

}

exports.createUser = createUser


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNWExODE4YzIxYmE3NGNmYjA2YTZmNiIsImlhdCI6MTYxNjUxNzE5MiwiZXhwIjoxNjE4MjQ1MTkyfQ.Cov8YWYd0eGzwkHGc-ZdidRXdaQSO7qC2ZxDJFMTzDQ