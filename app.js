const express = require('express');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const bodyParser = require('body-parser');

const methodOverride = require("method-override");

const mongoose = require("mongoose");
const cors = require("cors");

const photos = require("./routes/photoRouter");
const admin = require("./routes/adminRouter");

require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3001;

// mongoose SetUp
const conn = mongoose.createConnection(
  process.env.MONGODB_CONNECTION_STRING,
  {
    useNewUrlParser: true,
    useCreateIndex: true, 
    useUnifiedTopology: true,
    useFindAndModify: false
 }, 
 (err) => {
   if (err) throw err;
   console.log("MongoDB Connection established!")
 })

let gfs;

conn.once('open', () => {
    // init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// create storage engine
const storage = new GridFsStorage({
  url: process.env.MONGODB_CONNECTION_STRING,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err,buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads"
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

// route POST /upload: uploads file to DB
app.post('/upload', upload.single("file"), (req, res) => {
  res.json({ file: req.file });
});

// route GET /files: display files in JSON
app.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // check if files 
    if(!files || files.length === 0) {
      return res.status(404).json({ 
        err: 'No files exist'
      });
    }
    // files exist
    return res.json(files);
  });
});

// route GET /files: display picture
app.get('/pictures', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if ( !files || files.length === 0) {
      return res.status(404).json({ err: "No files exist..."});
    }
    // check if files 
    // if(!files || files.length === 0) {
    //    res.render({files: false});
    // } else {
    //   files.map(file => {
    //     if(file.contentType === "image/jpeg" || file.contentType === "image/png"){
    //       file.isImage = true;
    //     } else {
    //       file.isImage = false;
    //     }
    //     res.send({files: files});
    //   })
    // }
    // files exist


    const readstream = gfs.createReadStream(files);
    return res.json(files);
  });
});



 app.use("/admin", require("./routes/photoRouter"));

app.listen(PORT, () => {
  console.log(`Ethan Cowsky server started on port ${PORT}`)
})