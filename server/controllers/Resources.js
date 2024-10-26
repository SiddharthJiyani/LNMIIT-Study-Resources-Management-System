const { auth } = require("../middleware/auth");
const Course = require("../models/Course");
const Resource = require("../models/Resource");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const cloudinary = require("cloudinary").v2;
// const Course = require("../models/Course");

// upload resource
exports.uploadFile = async (req, res) => {
  try {
    const { title, resource, courseId, fileType } = req.body;
    // assuming course will be a drop down which will already have semester and branch info
    // console.log("----------Request body:-----------", req.files);

    const file = req.files.resource;
    console.log("File: ", file);
    console.log('user ' , req.user);
    const user = req.user.id;

    //check if all fields are there or not
    if (!title || !file || !courseId || !fileType) {
      return res.status(400).json({
        success: false,
        message: "Please enter all fields",
      });
    }

    // Upload file to Cloudinary
    const result = await uploadImageToCloudinary(file, "resources");
    console.log("File uploaded to Cloudinary", result);


    // Create resource
    const newResource = new Resource({
      title,
      resource,
      course: courseId,
      uploadedBy: user,
      fileType,
      fileUrl: result.secure_url, // File URL from Cloudinary
    });

    // Save resource to MongoDB
    await newResource.save();

    // update course with resource
    const course = await Course.findById(courseId);
    course.resources.push(newResource._id);
    await course.save();

    res.status(201).json({
      success: true,
      message: "Resource uploaded successfully. Pending admin approval.",
      data: newResource,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error uploading resource",
      error: error.message,
    });
  }
};

//get all approved resources (for student users)
exports.showApprovedResource = async (req, res) => {
  try {
    const approvedResources = await Resource.find({ isApproved: true });
    res.json(approvedResources);
  } catch (err) {
    res.status(500).send('Server error');
  }
}

//show by id (only approved ones)
exports.showById = async (req, res) => {
  try {
      const { id } = req.params;

      // Find the resource by ID and check if it's approved
      const resource = await Resource.findOne({ _id: id, isApproved: true })
          .populate('course')
          .populate('uploadedBy', 'firstName lastName');

      if (!resource) {
          return res.status(404).json({ message: 'Resource not found or not approved' });
      }
      
      res.json(resource);
  } catch (err) {
      res.status(500).json({ message: 'Server error' });
  }
}

//get resources by course (for student users)
exports.showResourceByCourse = async (req, res) => {
  try {
      const { courseId } = req.params;

      // Find the course by its name
      const course = await Course.findOne({ _id: courseId.trim() })
          .populate({
              path: 'resources', // Populate the resources field
              match: { isApproved: true }, // Only fetch approved resources
              populate: { path: 'uploadedBy', select: 'name' } // Populate uploadedBy with the user's name
          });

      if (!course) {
          return res.status(404).json({ message: 'Course not found' });
      }

      // Return only approved resources for the found course
      res.json(course.resources);
  } catch (err) {
      res.status(500).send('Server error');
  }
}

//ADMIN ROLE CONTROLLERS

// approve resource
exports.approveResource = async (req, res) => {
  try {
    const resourceId = req.params.id;

    // Update the resource approval status
    const resource = await Resource.findByIdAndUpdate(
      resourceId,
      { isApproved: true },
      { new: true } 
    );

    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    res.status(200).json({
      message: "Resource approved successfully",
      resource,
    });
  } catch (error) {
    console.error("Error approving resource:", error);
    res.status(500).json({ error: "Server error while approving resource" });
  }
};

// DELETE /resources/:id/reject - Admin rejects and deletes the resource from both DB and Cloudinary
// exports.rejectAndDelete = async (req, res) => {
//   try {
//     const resourceId = req.params.id;

//     // Find resource in DB
//     const resource = await Resource.findById(resourceId);
//     if (!resource) {
//       return res.status(404).json({ error: "Resource not found" });
//     }

//     // Delete the file from Cloudinary
//     const publicId = resource.fileUrl.split("/").pop().split(".")[0]; // Extract public ID from URL
//     await cloudinary.uploader.destroy(
//       `resources/${resource.fileType}/${publicId}`,
//       { resource_type: "auto" }
//     );

//     // Delete resource from DB
//     await Resource.findByIdAndDelete(resourceId);

//     res
//       .status(200)
//       .json({ message: "Resource rejected and deleted successfully" });
//   } catch (error) {
//     console.error("Error rejecting resource:", error);
//     res.status(500).json({ error: "Server error while rejecting resource" });
//   }
// };

//delete resource
exports.deleteResource = async (req, res) => {
  try {
    const resourceId = req.params.id;

    // Find resource in DB
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    // extract file extension from fileUrl
    const fileExtension = resource.fileUrl.split(".").pop();
    console.log("File extension: ", fileExtension);

    // Delete the file from Cloudinary
    const publicId = resource.fileUrl.split("/").pop().split(".")[0]; // Extract public ID from URL
    console.log("Public ID: ", publicId);
    await cloudinary.uploader.destroy(
      `resources/${resource.fileType}/${publicId}`,

      //! ### may need more modification and testing  ####
      fileExtension === "pdf" ? { resource_type: "image" } : { resource_type: "auto" } 
    );

    // Remove resource from course
    const course = await Course.findById(resource.course);
    course.resources = course.resources.filter(
      (resourceId) => resourceId.toString() !== resource._id.toString()
    );
    await course.save();

    // Delete resource from DB
    await Resource.findByIdAndDelete(resourceId);

    res.status(200).json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Error deleting resource:", error);
    res.status(500).json({ error: "Server error while deleting resource" });
  }
};

//get all resources (both approved and unapproved) --> for admin dashboard
exports.showAllResource = async (req, res) => {
  try {
    const resources = await Resource.find({});
    res.json(resources);
  } catch (err) {
    res.status(500).send('Server error');
  }
}

//get all unapproved (newly uploaded resources) --> for admin
exports.showNewUploads = async (req, res) => {
  try {
    const unapprovedResources = await Resource.find({isApproved: false})
    res.json(unapprovedResources);
  } catch (err){
    res.status(500).send('Server error');
  }
}