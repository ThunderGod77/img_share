const express = require("express");

const {sendMail} = require("./emailSender")
const result =  require('dotenv').config()

const userRouter = require("./routes/users"); 
const feedRouter = require("./routes/feed")


const { addComment, deleteComment,addReplies, deleteReplies, upvoteArt, getArt } = require("./models/art");

const app = express();

app.use(express.json());



app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/ping", (req, res, next) => {
  res.status(200).json({ name: "pong" });
});
app.use("/users",userRouter)
app.use("/feed",feedRouter)


app.listen(process.env.PORT || 8080, () => {
  console.log("Serving on port 8080");
  // addReplies("605a207b93653a53c05a71b6","605ad96ac112b04b5b3e880f",{username:"lol",comment:"lol"})
  // deleteReplies("605a207b93653a53c05a71b6","605ad96ac112b04b5b3e880f","605b0f13f8c1f36b65d1d6ec")
  // upvoteArt("605a207b93653a53c05a71b6","lol",true)
  // getArt("605a207b93653a53c05a71b6")
});
