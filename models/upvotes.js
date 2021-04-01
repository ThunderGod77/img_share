const { Schema } = require("mongoose")
const mongoose = require("./../db")




var upvoteSchema = new Schema({
    artId: String,
    userId: String,
    like: Boolean    
})



const Upvote = mongoose.model("Upvote",upvoteSchema)

exports.addUpvote = async(artId,userId,like)=>{
    const upvote = new Upvote({artId,userId,like})
    await upvote.save()
}

exports.delUpvote = async(artId,userId)=>{
    await Upvote.deleteOne({userId:userId,artId:artId})
    
}

exports.checkUpvote = async(artId,userId)=>{
    console.log(artId)
    console.log(userId)
	const response = await Upvote.findOne({artId:artId,userId:userId})
    console.log(response)
	return response
} 
