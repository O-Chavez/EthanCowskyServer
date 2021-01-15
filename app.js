const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");

const photos = require("./routes/photoRouter");
const admin = require("./routes/adminRouter");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

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


 app.use("/admin", require("./routes/photoRouter"));

// app.get('/', (req, res) => {
//   res.send("Hello! you have Ethans webserver up!")
// })










app.listen(PORT, () => {
  console.log(`Ethan Cowsky server started on port ${PORT}`)
})