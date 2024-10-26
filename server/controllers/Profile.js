const User = require("../models/User");

// get all detail of a user
exports.getProfile = async (req, res) => {
  try {
    // Populate favorites with details from the Resource model
    const user = await User.findById(req.user.id).populate("favorites");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
 
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in getProfile:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the user profile",
    });
  }
};



// edit user profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User not found",
    });
  }
};

// delete user profile


// 