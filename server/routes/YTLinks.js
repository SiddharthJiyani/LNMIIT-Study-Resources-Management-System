const express = require("express");
const { addYTLink, getYTLinks, deleteYTLink } = require("../controllers/YTLinks");
const { auth, isAdmin } = require("../middleware/auth");
const router = express.Router();

router.post("/addYTLink",auth , isAdmin , addYTLink);
router.get("/getYTLinks/:courseId",auth , getYTLinks);
router.delete("/deleteYTLink",auth , isAdmin, deleteYTLink);

module.exports = router;
