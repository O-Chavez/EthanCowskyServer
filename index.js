const express = require('express');
const path = require('path');
const crypto = require('crypto');
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const bodyParser = require('body-parser');

const methodOverride = require("method-override");

const mongoose = require("mongoose");
const cors = require("cors");

const photos = require("./routes/photoRouter");
const admin = require("./routes/adminRouter");
const paymentProcessing = require("./routes/paymentRouter");

require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(methodOverride('_method'));
app.use(express.json());
app.use(cors());
app.use(express.static('public'));


const PORT = process.env.PORT || 3001;

// mongoose SetUp
mongoose.connect(
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


 const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
 const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
 
 app.get('/', (req, res) => {
  res.send('Hello to LiftTracker API!');
})
//  app.use("/admin", require("./routes/photoRouter"));
 app.use("/photos", require("./routes/photoRouter"));
 app.use("/payment", require("./routes/paymentRouter"));
 app.use("/admin", require("./routes/adminRouter"));
 app.get('*', () => {
   res.redirect('/');
 })

app.listen(PORT, () => {
  console.log(`Ethan Cowsky server started on port ${PORT}`)
})