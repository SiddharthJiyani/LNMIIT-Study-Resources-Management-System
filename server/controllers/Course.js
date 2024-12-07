const Course = require("../models/Course");
const Resource = require("../models/Resource");
const User = require("../models/User");

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { name, description, offeredTo, credits, isElective } = req.body;
    const user = req.user._id;


    if (!name || !(offeredTo && Array.isArray(offeredTo) && offeredTo.length > 0) || !credits || isElective === undefined) {
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
        message: "Course already exists, you can update/delete it instead",
      });
    }
    // console.log('offeredTo', offeredTo);

    let validDeptEntries = [];
    for (let i = 0; i < offeredTo.length; i++) {
      const { department, semester } = offeredTo[i];
      if (department && semester && semester !== "N/A") {
        validDeptEntries.push({ department, semester: parseInt(semester, 10) });
      }
    }
    console.log('validDeptEntries', validDeptEntries);

    if (validDeptEntries.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid department and semester",
      })
    };
    const newCourse = new Course({
      name,
      description,
      offeredTo: validDeptEntries,
      credits,
      isElective,
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
    const { name, description, offeredTo, credits, isElective } = req.body;
    const user = req.user._id;
    const { id } = req.params;


    // Check for required fields
    if (!name || !(offeredTo && Array.isArray(offeredTo) && offeredTo.length > 0) || !credits || isElective === undefined) {
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
    let validDeptEntries = [];
    for (let i = 0; i < offeredTo.length; i++) {
      const { department, semester } = offeredTo[i];
      if (department && semester && semester !== "N/A") {
        validDeptEntries.push({ department, semester: parseInt(semester, 10) });
      }
    }
    if (validDeptEntries.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid department and semester",
      })
    };
    // Update fields
    course.name = name;
    course.description = description;
    course.offeredTo = validDeptEntries;
    course.credits = credits;
    course.createdBy = user;
    course.isElective = isElective;
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
      message: "Error updating course in DB",
      error: error.message,
    });
  }
};
// get courses by department and semester
exports.getCoursesByDepartmentAndSemester = async (req, res) => {
  try {
    const { department, semester } = req.params;
    const courses = await Course.find({
      offeredTo: {
        $elemMatch: {
          department,
          semester: parseInt(semester, 10) // Convert semester to number
        }
      }
    });
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
    const courses = await Course.find({
      offeredTo: {
        $elemMatch: {
          semester: parseInt(semester, 10) // Convert semester to number
        }
      }
    });
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

    // Fetch resources linked to the course
    const resources = await Resource.find({ course: id });

    // Remove resources associated with the course
    await Resource.deleteMany({ course: id });

    // Remove resources from user's favorites
    const resourceIds = resources.map(resource => resource._id);
    await User.updateMany(
      { favorites: { $in: resourceIds } },
      { $pull: { favorites: { $in: resourceIds } } }
    );

    // Finally, delete the course itself
    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: "Course and associated resources deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting course",
      error: error.message,
    });
  }
};




