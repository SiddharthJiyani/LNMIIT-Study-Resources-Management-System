const express = require("express");
const router = express.Router();
const {
  createCourse,
  getCoursesByDepartmentAndSemester,
  getCoursesBySemester,
  deleteCourse,
  getCourses,
  editCourse
} = require("../controllers/Course");

const { auth, isAdmin } = require("../middleware/auth");

// GET: all courses 
router.get('/all',auth, getCourses);

// POST: Create a new course (Only authenticated users)
router.post("/create", auth, isAdmin, createCourse);

// get courses by department and semester
router.get("/:department/:semester",auth, getCoursesByDepartmentAndSemester);

// Edit a course by ID (Only authenticated users)
router.put("/edit/:id", auth, isAdmin, editCourse);

// GET: Get all courses by semester (Public)
router.get("/:semester",auth, getCoursesBySemester);


// DELETE: Delete a course by ID (Only authenticated users)
router.delete('/delete/:id', auth, isAdmin, deleteCourse);


module.exports = router;
