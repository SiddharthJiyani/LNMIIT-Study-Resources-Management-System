const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const OTP = require("../models/OTP");
const crypto = require("crypto")
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const forgotPasswordTemplate = require("../mail/templates/forgotPasswordTemplate");

// Signup function
exports.signup = async (req, res) => {
  try {
    // Destructure fields from the request body
    const { firstName , lastName,email, password, confirmPassword , semester, otp } = req.body;
    const accountType = 'student'; // for now only students can signup
    
    // Logging the details for testing
    // console.table({ firstName, lastName, email, password, confirmPassword, accountType , semester , otp });
    // console.log(`signup requested by email: ${email}`); //testing phase
    
    // Check if All Details are there or not
    if (!email || !password || !confirmPassword || !firstName || !lastName || !semester || !otp) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required ",
      });
    }

    // Checking for LNM id only ( @lnmiit.ac.in )
    if (!email.includes("@lnmiit.ac.in")) {
      return res.status(403).send({
        success: false,
        message: "Please enter a valid LNMIIT email",
      });
    }

    const emailPrefix = email.split('@')[0];
    var department = emailPrefix.slice(2, 5);
    department = department.toUpperCase();

    if (department === "UCS" || department === "DCS") {
      department = "CSE";
    }
    else if (department === "UCC" || department === "DCC") {
      department = "CCE";
    }
    else if (department === "UEC" || department === "DEC") {
      department = "ECE";
    }
    else if (department === "UME" || department === "DME") {
      department = "MME";
    }
    else {
      return res.status(403).send({
        success: false,
        message: "Please enter a valid LNMIIT email ( Branch not found )",
      });
    }



    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password do not match. Please try again.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }

    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    console.log(response);
    if (response.length === 0) {
      // OTP not found for the email
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    } else if (otp !== response[0].otp) {
      // Invalid OTP
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create entry in db

    const user = await User.create({
      firstName,
      lastName,
      email,
      department,
      semester,
      password: hashedPassword,
      accountType: accountType,
    });
    return res.status(200).json({
      success: true,
      user,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    });
  }
};

// Login function
exports.login = async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email || !password) {
      // Return 400 Bad Request status code with error message
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }

    // check if user exists in db
    // Find user with provided email
    const user = await User.findOne({ email });

    // If user not found with provided email
    if (!user) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      });
    }

    //generate JWT token after matching password and compare password

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      // Save token to user document in database
      user.token = token;
      user.password = undefined;
      // Set cookie for token and return success response
      const options = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), //1day expiration
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User Login Success`,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      });
    }
  } catch (error) {
    console.error(error);
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    });
  }
};

// Logout function
exports.logout = async (req, res) => {
  try {
    // Clear the cookie
    res.clearCookie("token");
    return res.status(200).json({
      success: true,
      message: `User Logged Out Successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Logout Failure Please Try Again`,
    });
  }
};

// Send OTP For Email Verification
exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email.includes("@lnmiit.ac.in")) {
      return res.status(403).send({
        success: false,
        message: "Please enter a valid LNMIIT email",
      });
    }

    // Find user with provided email
    const checkUserPresent = await User.findOne({ email });
    // to be used in case of signup

    // If user found with provided email
    if (checkUserPresent) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      });
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // check unique otp -- Brute force approach
    const result = await OTP.findOne({ otp: otp });
    console.log("Result is Generate OTP Func");
    console.log("OTP", otp);
    console.log("Result", result); // why is result null? -> kyunki OTP.findOne() returns null if no otp is found
    while (result) {
      //-> to check if otp is unique or not
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
    }
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    console.log("OTP Body", otpBody);
    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Function for Forgot Password - Send Email
exports.forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;

    if (!email.includes("@lnmiit.ac.in")) {
      return res.status(403).send({
        success: false,
        message: "Please enter a valid LNMIIT email",
      });
    }

		// Check if user exists with provided email
		const user = await User.findOne ({ email });   
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User with this email does not exist.",
			});
		}

		const token = crypto.randomBytes(20).toString("hex")

    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 3600000,
      },
      { new: true }
    )

		// Frontend link for resetting password
		const resetUrl = `https://lnm-srms.vercel.app/reset-password/${token}`;


		const subject = 'Password Reset Request';
		const body = forgotPasswordTemplate(user?.firstName,resetUrl);

			await mailSender(email , subject , body);

		return res.status(200).json({
			success: true,
			message: "Password reset email sent successfully.",
		});
	}
	catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "Failed to send password reset email. Please try again.",
		});
	}
}

exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body

    console.log("Password", password);

    if (confirmPassword !== password) {
      return res.json({
        success: false,
        message: "Password and Confirm Password Does not Match",
      })
    }
    const userDetails = await User.findOne({ token: token })
    console.log('User Details', userDetails)
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is Invalid",
      })
    }
    // if (!(userDetails.resetPasswordExpires > Date.now())) {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Token is Expired, Please Regenerate Your Token`,
    //   })
    // }
    const encryptedPassword = await bcrypt.hash(password, 10)
    await User.findOneAndUpdate(
      { token: token },
      { password: encryptedPassword },
      { new: true }
    )
    res.json({
      success: true,
      message: `Password Reset Successful`,
    })
  } catch (error) {
    return res.json({
      error: error.message,
      success: false,
      message: `Some Error in Updating the Password`,
    })
  }
}
