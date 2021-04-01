const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { v4: uuidv4 } = require("uuid");

const spacesEndpoint = new AWS.Endpoint("fra1.digitaloceanspaces.com");
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  
  accessKeyId:process.env.DIGITALOCEAN_ACCESS_KEY_ID,
  
  secretAccessKey:process.env.DIGITALOCEAN_SECRET_ACCESS_KEY
});



exports.upload = (type)=>{
  const uploadImg = multer({
    storage: multerS3({
      s3: s3,
      
      bucket:process.env.BUCKET,
      acl: "public-read",
      key: function (request, file, cb) {
        const unique = uuidv4();
        cb(null, `${type}/` + unique + file.originalname);
        
        
        request.body.url = `https://myspacelol.fra1.digitaloceanspaces.com/${type}/${
          unique + file.originalname
        }`;
      },
    }),
  }).array("image", 1);
  return uploadImg
}


exports.verifyUser = async (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      req.body.verified = false;
      next();
    }
    const token = authHeader;
    
    let decodedToken;
    try {
      decodedToken = await jwt.verify(token, "somesupersecretkey");
      if (decodedToken ===undefined) {
          req.body.verified = false;
          next();
      }
      
      req.body._id = decodedToken.id;
      req.body.verified = true;
    } catch (err) {
      req.body.verified = false;
      next();
    }
    
    
  
    next();
  };