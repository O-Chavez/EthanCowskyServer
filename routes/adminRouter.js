const router = require("express").Router();

router.get("/test", (req,res) => {
  res.send("Hello, you got the admin test working.")
})

module.exports = router;