const router = require("express").Router();
const Admin = require('../models/admin');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require('../middleware/auth');

// CREATE ADMIN ACCOUNT
// router.post("/create", async (req,res) => { 
//   try{
//     const { username, password } = req.body;
//     const salt = await bcrypt.genSalt();
//     const passwordHash = await bcrypt.hash(password, salt);
//     // create new mongo User
//     Admin.create({
//       username: req.body.username,
//       password: passwordHash
//     }, (error, adminAccount) => {
//       if(error){
//         return res.json({ error });
//       } else {
//         return res.json({ adminAccount })
//       }
//     })
//   } catch (error) {
//     res.status(500).json({ error })
//   }
// });

// SIGN IN AS ADMIN
router.post("/signin", async (req,res) => {
  try{
    const {username, password} = req.body;
    if(!username){
      return res.status(400).json({ message: "Please enter a Username..."})
    } else if (!password){
      res.status(400).json({ message: "Please enter a Password..."})
    }
    const user = await Admin.findOne({ username });
    if(user){
      // if account with username exists, check password
      const isMatch = await bcrypt.compare(password, user.password);
      // if passswords dont match, send error.
      if(isMatch === false){
        return res.json({ message: "Invalid credentials... Password and Username on file do not match..."})
      } else {
        // if passwords match, sign JWT
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
              res.json({
                token,
                user: {
                  id: user._id,
                  username: user.username
                }
            }) 
      }
    } else {
      return res.json({ message: "No user found with that Username..."})
    }
    



  } catch (error){
    return res.status(500).json({ error })
  }
});

router.route("/").get(auth, async (req, res) => {
  const user = await User.findById(req.user)
    // what data is pushed to the front end after authorizaion
  res.json(user)
});

module.exports = router;