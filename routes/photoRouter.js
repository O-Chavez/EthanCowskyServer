const router = require("express").Router();
const cloudinary = require('cloudinary');
const Photo = require('../models/photo');
const multer = require('multer');


const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname)
  }
});

// const imageFilter = (req, file, cb) => {
//   // accept image files only
//   if (!file.filename.match(/\.(jpg|jpeg|png|gif)$/i)) {
//       return cb(new Error('Only image files are allowed!'), false);
//   }
//   cb(null, true);
// };

const upload = multer({storage: storage});

// cloudinary.config({ 
//   cloud_name: 'projectimgcloud', 
//   api_key: process.env.CLOUDINARY_API_KEY, 
//   api_secret: process.env.CLOUDINARY_API_SECRET 
// });
cloudinary.config({ 
  cloud_name: 'projectimgcloud', 
  api_key: "473754918178142", 
  api_secret: "WG_EfOs5phMceSRxjv_lPCzmZuY",
});

// GET ALL PHOTOS
router.get("/", async (req, res) => {
  try {
    const allPhotos = await Photo.find({});
      res.json({allPhotos});
  } catch (error){
    res.json({ error: error.message });
  }  
});

// UPLOAD PHOTO
router.post("/upload", upload.single('file'), (req, res) => {
  try{
  // DESTRUCURE REQ.BODY
    const { photoName, photoDescription, photoPrice } = req.body;
    
  // FORM VALIDATION
    if ( !req.file || !photoName || !photoDescription || !photoPrice ){
      return res.status(400).json({msg: "Not all fields have been entered!"});
    }

  // UPLOAD PHOTO TO CLOUDINARY 
  cloudinary.v2.uploader.upload(req.file.path, {upload_preset: "Ethan Cowsky website"}, (err, result) => {

     // GET URL FROM CLOUDINARY
    // req.body.photoshits = result.secure_url;
    return res.json({res: result});
  });

   
  // // SAVE PHOTO WITH URL IN MONGO

  } catch (error) {
    res.json({ msg: error.message});
  }
});




router.get("/test", (req,res) => {
  res.send("Hello, you got the photo test working.")
})

module.exports = router;