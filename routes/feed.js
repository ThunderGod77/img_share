const {
  getArt,
  addComment,
  addReplies,
  upvoteArt,
  remUpvoteArt,
  getFeedP,
  getFeedN
} = require("./../models/art");
const { verifyUser } = require("./../helper");

const express = require("express");
const { addUpvote, checkUpvote,delUpvote } = require("../models/upvotes");

const router = express.Router();



router.get("/popular",async(req,res,next)=>{
  let pageNum = req.query.page
  try {
    
    const rep = await getFeedP(pageNum)
    res.status(200).json({err:false,data:rep})
  } catch (error) {
    console.log(error)
    res.status(500).json({err:true})
  }
})
router.get("/recent",async(req,res,next)=>{
  let pageNum = req.query.page
  try {
    const rep = await getFeedN(pageNum)
    res.status(200).json({err:false,data:rep})
  } catch (error) {
    console.log(error)
    res.status(500).json({err:true})
  }
})





router.get("/:artId", async (req, res, next) => {
  try {
    let artId = req.params.artId;
    const artData = await getArt(artId);
    if (artId !== null) {
      res.status(200).json({ err: false, data: artData });
    } else {
      res
        .status(404)
        .json({ err: true, msg: "Following art work does not exist." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: true, msg: "Internal server error." });
  }
});
router.post("/:artId/comment", verifyUser, async (req, res, nex) => {
  try {
    let artId = req.params.artId;
    let username = req.body.username;
    let comment = req.body.comment;
    if (req.body.verified) {
      const response = await addComment(artId, { username, comment });

      res.status(201).json({ err: false, data: response });
    } else {
      res.status(403).json({ err: true, msg: "You are not logged in!" });
    }
  } catch (error) {
    res.status(500).json({ err: true, msg: "Internal server error." });
  }
});

router.post("/:artId/upvote", verifyUser, async (req, res, nex) => {
  try {
    if (req.body.verified) {
      let artId = req.params.artId;
      let userId = req.body._id;
      let typeL = req.body.typeL;
      const response = await upvoteArt(artId, userId, typeL);
      
      res.status(201).json({ err: false });
    } else {
      res.status(403).json({ err: true, msg: "You are not logged in!" });
    }
  } catch (error) {
    res.status(500).json({ err: true, msg: "Internal server error." });
  }
});
router.post("/:artId/remupvote", verifyUser, async (req, res, nex) => {
  try {
    if (req.body.verified) {
      let artId = req.params.artId;
      let userId = req.body._id;
      let typeL = req.body.typeL;
      const response = await remUpvoteArt(artId, userId, typeL);
      
      res.status(201).json({ err: false });
    } else {
      res.status(403).json({ err: true, msg: "You are not logged in!" });
    }
  } catch (error) {
    res.status(500).json({ err: true, msg: "Internal server error." });
  }
});

router.post("/:artId/:commentId/reply", verifyUser, async (req, res, nex) => {
  try {
    let artId = req.params.artId;
    let commentId = req.params.commentId;
    let username = req.body.username;
    let comment = req.body.comment;
    if (req.body.verified) {
      const response = await addReplies(artId, commentId, {
        username,
        comment,
      });
      res.status(201).json({ err: false, data: response });
    } else {
      res.status(403).json({ err: true, msg: "You are not logged in!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: true, msg: "Internal server error." });
  }
});

router.get("/:artId/cupvote", verifyUser, async (req, res, next) => {
  try {
    let artId = req.params.artId;
    let userId = req.body._id;
    console.log(req.body)
    let response = await checkUpvote(artId, userId);
    console.log(response)
    if (response) {
      res.status(200).json({ u: response.like, err: false, uC: true });
      return;
    } else {
      res.status(200).json({ u: false, err: false, uC: false });
      return;
    }
  } catch (err) {
    res.status(500).json({ err: true, msg: "Internal server error!" });
    return;
  }
});






module.exports = router;
