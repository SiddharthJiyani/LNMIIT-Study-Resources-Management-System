const { auth } = require("../middleware/auth");
const Course = require("../models/Course");
const User = require("../models/User");
const Resource = require("../models/Resource");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const cloudinary = require("cloudinary").v2;
// const Course = require("../models/Course");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// upload resource
exports.uploadFile = async (req, res) => {
  try {
    const { title, description, resource, courseId, fileType } = req.body;
    // assuming course will be a drop down which will already have semester and branch info
    console.log("----------Request body:-----------", req.files);

    const file = req.files.resource;
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
    console.log("Result: ", result);
    // console.log("File uploaded to Cloudinary", result);

    // Create resource
    const newResource = new Resource({
      title,
      resource,
      description,
      course: courseId,
      uploadedBy: user,
      resource_type: result.resource_type,
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
    console.log("Error uploading resource: ", error.message);
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
    res.status(500).send("Server error");
  }
};

//show by id (only approved ones)
exports.showById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the resource by ID and check if it's approved
    const resource = await Resource.findOne({ _id: id, isApproved: true })
      .populate("course")
      .populate("uploadedBy", "firstName lastName");

    if (!resource) {
      return res
        .status(404)
        .json({ message: "Resource not found or not approved" });
    }

    res.json(resource);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//get resources by course (for student users)
exports.showResourceByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Find the course by its name
    const course = await Course.findOne({ _id: courseId.trim() }).populate({
      path: "resources", // Populate the resources field
      match: { isApproved: true }, // Only fetch approved resources
      populate: { path: "uploadedBy", select: "name" }, // Populate uploadedBy with the user's name
    });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Return only approved resources for the found course
    res.json({ resources: course.resources, name: course.name, offeredTo: course.offeredTo });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
};




//get resource by user
exports.getUserResources = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find all resources uploaded by this user
    const resources = await Resource.find({ uploadedBy: userId })
      .populate("course", "name") // populate course with its name
      .select("title description fileType isApproved createdAt"); // select specific fields to return

    if (!resources || resources.length === 0) {
      return res.status(404).json({ message: "No resources found for this user" });
    }

    res.status(200).json({
      success: true,
      resources,
    });
  } catch (error) {
    console.error("Error fetching user resources:", error);
    res.status(500).json({ error: "Server error while fetching resources" });
  }
};

// add resource to favourites
exports.addFavourite = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the resource
    const resource = await Resource.findById(id).populate("uploadedBy", "firstName lastName");
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    const user = await User.findById(userId).select("favorites");
    user.favorites = user.favorites || [];

    const isFavourite = user.favorites.includes(id);

    if (isFavourite) {
      // Remove from favorites if it exists
      user.favorites = user.favorites.filter((favId) => favId.toString() !== id);
      await user.save();
      return res.json({ message: "Resource removed from favorites", resource });
    } else {
      // Add to favorites if it doesn't exist
      user.favorites.push(id);
      await user.save();
      return res.json({ message: "Resource added to favorites", resource });
    }
  } catch (err) {
    console.error("Error in toggleFavourite:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// check if resource is in favourites
exports.checkFavourite = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId).select("favorites");
    user.favorites = user.favorites || [];

    const isFavourite = user.favorites.includes(id);

    res.json({ isFavourite });
  } catch (err) {
    console.error("Error in checkFavourite:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


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

    const res_type = resource.resource_type;

    // extract file extension from fileUrl
    const fileExtension = resource.fileUrl.split(".").pop();
    console.log("File extension: ", fileExtension);

    // Delete the file from Cloudinary
    const publicId = resource.fileUrl.split("/").pop().split(".")[0]; // Extract public ID from URL
    console.log("Public ID: ", publicId);
    await cloudinary.uploader
      .destroy(
        `resources/${publicId}`,
        //! ### may need more modification and testing  ####
        { resource_type: res_type || "image" },
      )
      .then((result) => {
        console.log("Deleted resource from Cloudinary", result);
      }
      )
      .catch((error) => {
        console.error("Error deleting resource from Cloudinary:", error);
        res.status(500).json({ error: "Server error while deleting resource" });
      }
      );



    // await cloudinary.v2.api
    //   .delete_resources([`resources/${publicId}`],
    //     {
    //       type: "upload",
    //       resource_type: fileExtension === "pdf" ? "image" : "auto",

    //     }

    //   )

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
    res.status(500).send("Server error");
  }
};

//get all unapproved (newly uploaded resources) --> for admin
exports.showNewUploads = async (req, res) => {
  try {
    const unapprovedResources = await Resource.find({ isApproved: false }).populate('uploadedBy').populate('course', 'department semester name');
    res.json(unapprovedResources);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

//rating system controllers

exports.rateResource = async (req, res) => {
  const { resourceId } = req.params;
  const { userId, rating } = req.body;

  try {
    // Fetch the existing resource document
    const resource = await Resource.findById(resourceId);
    if (!resource) return res.status(404).json({ error: "Resource not found" });

    // Check if the user has already rated this resource
    const existingRatingIndex = resource.ratings.findIndex(r => r.user.toString() === userId);
    console.log(existingRatingIndex);


    if (existingRatingIndex !== -1) {
      console.log("old user rating");
      // Update existing rating
      resource.ratings[existingRatingIndex].score = rating;
    } else {
      console.log("new user rating");
      // Add new rating
      resource.ratings.push({ user: userId, score: rating });
    }

    // Calculate and update the average rating
    const total = resource.ratings.reduce((sum, r) => sum + r.score, 0);
    const updatedAverageRating = total / resource.ratings.length;

    // Update the resource document with new ratings and average
    resource.averageRating = updatedAverageRating; // Update average rating directly

    // Save the updated resource document
    await resource.save();

    // console.log(resource.ratings.length);
    // console.log(resource.ratings);
    // console.log(resource.averageRating);

    res.status(200).json({
      message: "Rating updated successfully",
      ratings: resource.ratings,
      averageRating: updatedAverageRating
    });

  } catch (error) {
    console.error("Error updating rating:", error);
    res.status(500).json({ error: "Server error" });
  }
};

//get the rating user rated for a resource
exports.getUserRating = async (req, res) => {
  const { resourceId, userId } = req.params;

  try {
    const resource = await Resource.findById(resourceId);
    if (!resource) return res.status(404).json({ error: "Resource not found" });

    const userRating = resource.ratings.find(rating => rating.user.toString() === userId);

    if (userRating) {
      return res.status(200).json({ rating: userRating.score });
    } else {
      return res.status(200).json({ rating: null });
    }
  } catch (error) {
    console.error("Error fetching user rating:", error);
    res.status(500).json({ error: "Server error" });
  }
};