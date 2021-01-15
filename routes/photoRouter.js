const router = require("express").Router();

router.get("/test", (req,res) => {
  res.send("Hello, you got the photo test working.")
})

module.exports = router;