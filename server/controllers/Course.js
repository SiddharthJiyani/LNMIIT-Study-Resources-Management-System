const Course = require("../models/Course");

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { name, description, semester , department} = req.body;
    const user = req.user._id;

    if (!name || !description || !semester || !department) {
      return res.status(400).json({
        success: false,
        message: "Please enter all fields",
      });
    }

    const newCourse = new Course({
      name,
      description,
      semester,
      department,
      createdBy: user,
    });

    await newCourse.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating course",
      error: error.message,
    });
  }
};

// Get all courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching courses",
      error: error.message,
    });
  }
};

// get courses by department and semester
exports.getCoursesByDepartmentAndSemester = async (req, res) => {
  try {
    const { department, semester } = req.params;
    const courses = await Course.find({ department, semester });
    res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching courses",
      error: error.message,
    });
  }
};

// get All courses by semester
exports.getCoursesBySemester = async (req, res) => {
  try {
    const { semester } = req.params;
    const courses = await Course.find({ semester });
    res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: courses,
    });
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching courses",
      error: error.message,
    });
  }
}

// Delete a course by ID
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    await course.deleteOne();
    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting course",
      error: error.message,
    });
  }
}



