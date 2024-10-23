const express = require("express");
const router = express.Router();
const { uploadFile, deleteResource } = require("../controllers/Resources");
const { auth, isAdmin } = require("../middleware/auth"); 

// POST: Upload a new resource (Only authenticated users)
router.post("/upload", auth, uploadFile);
router.delete('/delete/:id', auth, isAdmin, deleteResource);

module.exports = router;
 