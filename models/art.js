const { ObjectId } = require("bson");
const mongoose = require("./../db");
const { addUpvote, delUpvote } = require("./upvotes");
const { Schema } = mongoose;

var NestedComments = new Schema({
  username: String,
  comment: String,
  
});

var Comments = new Schema({
  username: String,
  comment: String,
  

  replies: [NestedComments],
});

const artSchema = new Schema(
  {
    url: String,
    artname: String,
    description: String,
    username: String,
    tags: [{ type: String }],
    comments: [Comments],
    upvotes: Number,
    downvotes: Number,
  },
  { timestamps: true }
);

const Art = mongoose.model("Art", artSchema);

exports.createArt = async (
  url,
  artname,
  description,
  username,
  tags,
  userId
) => {
  const art = new Art({
    url,
    artname,
    description,
    username,
    tags,
    comments: [],
    upvotes: 0,
    downvotes: 0,
    userId,
  });
  const dbresponse = await art.save();
  console.log("Image saved");
};


exports.getArt = async(artId)=>{
    const dbResponse = await Art.findById(artId)
    return(dbResponse)
}




exports.getFeedP = async(pageNum)=>{

  const dbResponse = await Art.find({}).limit(6).sort('-upvotes').skip(6*(pageNum-1))
  return dbResponse

}

exports.getFeedN = async(pageNum)=>{

  const dbResponse = await Art.find({}).limit(6).sort('-createdAt').skip(6*(pageNum-1))
  return dbResponse

}





exports.upvoteArt = async (artId, userId, typeL) => {
  let a = "";
  if (typeL) {
    await Art.updateOne({ _id: ObjectId(artId) }, { $inc: { upvotes: 1 } });
    await addUpvote(artId,userId,true)
  } else {
    await Art.updateOne({ _id: ObjectId(artId) }, { $inc: { downvotes: 1 } });
    await addUpvote(artId,userId,false)
  }
  
};

exports.remUpvoteArt = async (artId, userId, typeL) => {
  let a = "";
  if (typeL) {
    await Art.updateOne({ _id: ObjectId(artId) }, { $inc: { upvotes: -1 } });
    await delUpvote(artId,userId)
  } else {
    await Art.updateOne({ _id: ObjectId(artId) }, { $inc: { downvotes: -1 } });
    await delUpvote(artId,userId)
  }
  
};









exports.addComment = async (artId, { username, comment }) => {
  try {
    const dbResponse = await Art.findOneAndUpdate(
      { _id: ObjectId(artId) },
      {
        $push: {
          comments: {
            username: username,
            comment: comment,
            
            replies: [],
          },
        },
      },{new:true}
    );
    // 
    return dbResponse
  } catch (error) {
    console.log(error);
  }
};

exports.deleteComment = async (artId, commentId) => {
  try {
    const dbResponse = await Art.updateOne(
      { _id: ObjectId(artId) },
      { $pull: { comments: { _id: ObjectId(commentId) } } }
    );
    console.log(dbResponse);
  } catch (error) {
    console.log(error);
  }
};

exports.addReplies = async (artId, commentId, { username, comment }) => {
  
    
    
    
    const dbResponse = await Art.findOneAndUpdate(
      { _id: ObjectId(artId), "comments._id": ObjectId(commentId) },
      {
        $push: {
          "comments.$.replies": {
            username: username,
            comment: comment            
          },
        },
      },{
        new:"true"
      }
    );

    return dbResponse

  
};

exports.deleteReplies = async (artId, commentId, replyId) => {
  try {
    const test = await Art.findOne({
      _id: ObjectId(artId),
      "comments._id": ObjectId(commentId),
    });
    console.log(test);
    const dbResponse = await Art.updateOne(
      { _id: ObjectId(artId), "comments._id": ObjectId(commentId) },
      { $pull: { "comments.$.replies": { _id: ObjectId(replyId) } } }
    );

    console.log(dbResponse);
  } catch (error) {
    console.log(error);
  }
};
