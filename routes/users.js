var express = require("express");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

var { createUser, findUser } = require("./../models/userModel");
var { createArt } = require("./../models/art");
const { verifyUser, upload } = require("./../helper");

var router = express.Router();

router.get("/", function (req, res) {
  res.status(200).json({ message: "Birds home page" });
});

router.post(
  "/new",
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  body("username").not().isEmpty(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          err: true,
          msg: `${errors.array()[0]["msg"]} for ${errors.array()[0]["param"]}`,
        });
        return;
      }
      const email = req.body.email;
      const username = req.body.username;
      const password = req.body.password;
      const { err, user } = await findUser(email, username);

      if (err) {
        res.status(500).json({ err: true, msg: "Some internal error" });
        return;
      } else if (!(user === null || user === {} || user === undefined)) {
        res
          .status(200)
          .json({ err: true, msg: "Username or Email already exists" });
        return;
      } else {
        hashedPassword = await bcrypt.hash(password, 12);
        const dbResponse = await createUser(email, username, hashedPassword);

        res.status(200).json({ err: false, msg: "User created" });
      }
    } catch (error) {
      res.status(500).json({ err: true, msg: "Some internal error" });
    }
  }
);

router.post("/login", async (req, res, next) => {
  try {
    const { err, user } = await findUser(
      req.body.email || "",
      req.body.username || ""
    );
    if (err) {
      res.status(500).json({ err: true, msg: "Some internal error" });
      return;
    } else if (user === null) {
      res.status(200).json({ err: true, msg: "User does not exist" });
      return;
    }

    const passSame = await bcrypt.compare(req.body.password, user.password);

    if (passSame) {
      const token = await jwt.sign({ id: user._id }, "somesupersecretkey", {
        expiresIn: "480h",
      });
      res
        .status(200)
        .json({ err: false, token: token, _id: user._id.toString() });
    } else {
      res.status(200).json({ err: true, msg: "Password is incorrect" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: true, msg: "Some internal error" });
  }
});

router.post("/upload", verifyUser, (req, res, next) => {
  try {
    if (req.body.verified) {
      const funUpload = upload("art");
      funUpload(req, res, async function (error) {
        if (error) {
          console.log(error);
          res.status(500).json({ err: true, msg: "Internal server error!" });
          return;
        }
        console.log(req.body);
        await createArt(
          req.body.url,
          req.body.name,
          req.body.description,
          req.body.username,
          req.body.tag,
          req.body._id
        );

        res.status(200).json({ err: false, url: req.body.url });
      });
    } else {
      res.status(403).json({ err: true, msg: "You must login!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: true, msg: "Internal server error!" });
  }
});

// router.get("/testOP", verifyUser, (req, res, next) => {
//   console.log(req.body);
//   res.status(200).json({ mo: "lo" });
// });

module.exports = router;
