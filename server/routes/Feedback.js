const express = require("express");
const router = express.Router();

const {sendFeedback} = require("../controllers/Feedback");
const { auth } = require("../middleware/auth");

// POST: Send feedback
router.post("/submit",auth, sendFeedback);


module.exports = router;
