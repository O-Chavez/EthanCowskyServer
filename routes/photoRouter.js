const router = require("express").Router();
const cloudinary = require('cloudinary');
const bcrypt = require("bcryptjs");
const AWS = require("aws-sdk");
const Photo = require('../models/photo');
const multer = require('multer');

require('dotenv').config();

const storage = multer.memoryStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname)
  }
});

// AWS SET UP
AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: 'us-west-1',
});

const imageFilter = (req, file, cb) => {
  // accept image files only
  if (!file.mimetype === 'image/jpeg' || !file.mimetype === 'image/png') {
      return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: imageFilter
});

// GET ALL PHOTOS
router.get("/", async (req, res) => {
  try {
    const allPhotos = await Photo.find({},
      { photoDescription: true, photoName: true, photoPrice: true, showImg: true }
      );
      res.json({allPhotos});
  } catch (error){
    res.json({ error: error.message });
  }  
});

// GET SPECIFIC PHOTO
router.get("/:id", async (req, res) => {
  try {
    const foundPhoto = await Photo.findById({ _id: req.params.id },
      { _id: true, photoDescription: true, photoName: true, photoPrice: true, showImg: true })
    res.json({foundPhoto})
  } catch (error) {
    res.json({error})
  }
})

// GET PHOTO ONCE PURCHASED
router.get("/purchase/:id", async (req, res) => {
  try {
    const purchasedPhoto = await Photo.findById({ _id: req.params.id },
      { file: true })
    res.json({purchasedPhoto})
  } catch (error) {
    res.json({error})
  }
})

// UPLOAD PHOTO
router.post("/upload", upload.single('file'), async (req, res) => {
  try{
    const { photoName, photoDescription, photoPrice } = req.body;

  // FORM VALIDATION
    if ( !req.file || !photoName || !photoDescription || !photoPrice ){
      return res.status(412).json({msg: "Not all fields have been entered!", status: 412});
    }
    // AWS
      // Create S3 service object
      s3 = new AWS.S3();
      const myFile = req.file.originalname.split('.');
      const filetype = myFile[myFile.length - 1];
      // call S3 to retrieve upload file to specified bucket
      const uploadParams = {
        Bucket: "ethan-cowsky-website", 
        Key: `uploads/${photoName}.${filetype}`, 
        Body: req.file.buffer,
        ContentType: `image/${filetype}`,
        };
      // call S3 to retrieve upload file to specified bucket
      s3.upload( uploadParams, async (err, data) => {
        if (err) {
          return res.json({err});
        } if (data) {
            // HASH URL OF FULL RESOLUTION URL
              const salt = await bcrypt.genSalt();
              const URL = await bcrypt.hash(data.Location, salt);
          // GET URL FROM AWS AND ADD DATA TO MONGO
          Photo.create({
                file: URL,
                photoName,
                showImg: `https://d147gc4b3ckpsg.cloudfront.net/filters:quality(40)/filters:format(jpeg)/uploads/${photoName}.${filetype}`,
                photoDescription,
                photoPrice
              }, (err, photo) => {
                if(err){
                  return res.json({ msg: err})
                }
                return res.json({msg: "Photo sucessfully uploaded!", photo: photo})
              });
        }
      });
  } catch (error) {
    res.json({ error });
  }
});

// EDIT ROUTE 
router.put("/edit/:id", (req, res) => {
  try {
    const { photoName, photoDescription, photoPrice } = req.body;
    if( !photoName || !photoDescription || !photoPrice  ){
      res.json({ msg: "Not all Fields have been filled!" })
    } else {
      Photo.findByIdAndUpdate({ _id: req.params.id }, req.body).then(() => {
            Photo.findOne({_id: req.params.id}).then((Photo) => {
              res.json({Photo})
            })
          })
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

// DELETE ROUTE
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedPhoto = await Photo.findByIdAndDelete(req.params.id)
    res.json(deletedPhoto)
  } catch (error) {
    res.json({error: error.message})
  }
})

module.exports = router;