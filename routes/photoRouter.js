const router = require("express").Router();
const cloudinary = require('cloudinary').v2;
const Photo = require('../models/photo');

cloudinary.config({ 
  cloud_name: 'projectimgcloud', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// GET ALL PHOTOSnpm start
router.get("/", async (req, res) => {
  try {
    const allPhotos = await Photo.find({});
      res.json({allPhotos});
  } catch (error){
    res.json({ error: error.message });
  }  
});

// UPLOAD PHOTO
router.post("/upload", async (req, res) => {
  try{
  // DESTRUCURE REQ.BODY
    const { file, photoName, photoDescription, photoPrice } = req.body;
    
  // FORM VALIDATION
    if ( !file || !photoName || !photoDescription || !photoPrice ){
      return res.status(400).json({msg: "Not all fields have been entered!"});
    }

  // UPLOAD PHOTO TO CLOUDINARY 
  cloudinary.uploader.upload( file, (error, result) => {
    console.log(result, error)
    
  } );

  // GET URL FROM CLOUDINARY
    


  // SAVE PHOTO IN MONGO
    const newPhoto = new Photo({
      file: cloudinaryURL,
      photoName: photoName,
      photoDescription: photoDescription,
      photoPrice: photoPrice
    });

    const savedPhoto = await newPhoto.save();
    // res.json({req});
    res.json({savedPhoto});

  } catch (error) {
    res.json({ msg: error.message});
  }
})




router.get("/test", (req,res) => {
  res.send("Hello, you got the photo test working.")
})

module.exports = router;