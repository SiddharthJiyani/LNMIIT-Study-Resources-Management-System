const express = require("express");
const router = express.Router();
const { uploadFile,
    deleteResource,
    approveResource,
    showAllResource,
    showResourceByCourse,
    showResourceByCourseName,
    showApprovedResource,
    showById,
    showNewUploads,
    addFavourite,
    checkFavourite,
    getUserResources,
    rateResource,
    getUserRating } = require("../controllers/Resources");
const { auth, isAdmin } = require("../middleware/auth");

// POST: Upload a new resource (Only authenticated users)
router.post("/upload", auth, uploadFile);
router.get("/showByCourse/:courseId", auth, showResourceByCourse);
router.get('/showApprovedResource', auth, showApprovedResource);
router.get('/showById/:id', auth, showById);
router.post('/addFavourite/:id', auth, addFavourite);
router.get('/isFavourite/:id', auth, checkFavourite);

// GET /resources/user/:userId - Get all resources by a specific user
router.get("/user/:userId", auth, getUserResources);

//admin routes
router.put('/approve/:id', auth, isAdmin, approveResource);
router.delete('/delete/:id', auth, deleteResource); //rejectAndDelete and deleteResource both handle the same stuff , redundant?? => @Siddharth
router.get('/all', auth, isAdmin, showAllResource);
router.get('/showPendingResource', auth, isAdmin, showNewUploads);

//rating system
router.patch("/rate/:resourceId", auth, rateResource);
router.get("/rate/:resourceId/:userId", auth, getUserRating);

module.exports = router;
