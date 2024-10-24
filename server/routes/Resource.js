const express = require("express");
const router = express.Router();
const { uploadFile, 
    deleteResource, 
    approveResource, 
    showAllResource,
    showResourceByCourse,
    showApprovedResource,
    showById,
    showNewUploads } = require("../controllers/Resources");
const { auth, isAdmin } = require("../middleware/auth");

// POST: Upload a new resource (Only authenticated users)
router.post("/upload", auth, uploadFile);
router.get("/showByCourse/:courseName", auth, showResourceByCourse);
router.get('/showApprovedResource', auth, showApprovedResource);
router.get('/showById/:id',auth, showById);


//admin routes
router.put('/approve/:id', auth, isAdmin, approveResource);
router.delete('/delete/:id', auth, isAdmin, deleteResource); //rejectAndDelete and deleteResource both handle the same stuff , redundant?? => @Siddharth
router.get('/all', auth, isAdmin, showAllResource);
router.get('/showPendingResource',auth, isAdmin, showNewUploads);

module.exports = router;
 