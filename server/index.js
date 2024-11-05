const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const database = require('./config/database');
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const { cloudinaryConnect } = require("./config/cloudinary");

const port = process.env.PORT || 4000;

// Middleware
app.use(cookieParser());
app.use(express.json()); 

// CORS configuration
const corsOptions = {
    origin: ["http://localhost:5173","https://lnmiit-study-resouces-management-system-m1h8.vercel.app"], // Replace with your frontend URL
    credentials: true,
    optionsSuccessStatus: 200
};
app.use("*",cors(corsOptions));
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);

// Connecting to database
database.connectDB();

// Connecting to cloudinary
cloudinaryConnect();

// Routes
const userRoutes = require("./routes/user");
const resourceRoutes = require("./routes/Resource");
const courseRoutes = require("./routes/Course");
const profileRoutes = require("./routes/Profile");
const feedbackRoutes = require("./routes/Feedback");
const YTLinkRoutes = require("./routes/YTLinks");

app.use("/api/auth", userRoutes);
app.use("/api/resource", resourceRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/ytlink", YTLinkRoutes); 

// Testing the server
app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running ...",
	});
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});