const Course = require("../models/Course");

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { name, description, semester , department , credits , isElective} = req.body;
    const user = req.user._id;

    
    if (!name || !semester || !department || !credits) {
      return res.status(400).json({
        success: false,
        message: "Please enter all fields",
      });
    }
    // check if course already exists
    const courseExists = await Course.findOne({ name });
    if (courseExists) {
      return res.status(400).json({
        success: false,
        message: "Course already exists",
      });
    }


    const newCourse = new Course({
      name,
      description,
      semester,
      credits,
      isElective,
      department,
      createdBy: user,
    });

    console.log('newCourse', newCourse);

    await newCourse.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error("Error creating course: ", error.message);
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

//edit course
exports.editCourse = async (req, res) => {
  try {
    const { name, description, semester, department, credits, isElective } = req.body;
    const user = req.user._id;
    const { id } = req.params;


    // Check for required fields
    if (!name || !semester || !department || !credits) {
      return res.status(400).json({
        success: false,
        message: "Please enter all required fields",
      });
    }

    // Find the course by ID
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Update fields
    course.name = name;
    course.description = description;
    course.semester = semester;
    course.department = department;
    course.createdBy = user;
    course.credits = credits;

    // Update isElective if provided in the request body
    if (isElective !== undefined) {
      course.isElective = isElective;
    }

    // Save updated course
    await course.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating course",
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



