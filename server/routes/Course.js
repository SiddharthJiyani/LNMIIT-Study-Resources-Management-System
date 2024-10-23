const express = require("express");
const router = express.Router();
const {
  createCourse,
  getCoursesByDepartmentAndSemester,
  getCoursesBySemester,
  deleteCourse,
} = require("../controllers/Course");

const { auth, isAdmin } = require("../middleware/auth");

// POST: Create a new course (Only authenticated users)
router.post("/create", auth, isAdmin, createCourse);

// get courses by department and semester
router.get("/:department/:semester", getCoursesByDepartmentAndSemester);

// GET: Get all courses by semester (Public)
router.get("/:semester",auth, getCoursesBySemester);


// DELETE: Delete a course by ID (Only authenticated users)
router.delete('/delete/:id', auth, isAdmin, deleteCourse);


module.exports = router;
