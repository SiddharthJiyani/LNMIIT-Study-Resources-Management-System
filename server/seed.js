const mongoose = require("mongoose");
const User = require("./models/User");
const Course = require("./models/Course");
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB", err);
});

// Create two users: one student and one admin
const users = [
    {
        firstName: "John",
        lastName: "Doe",
        email: "student@demo.in",
        password: "$2b$10$L6ENVTAIFOebrkemZZJpKev11jNoYNlAgpx.NKHpxxc1Rl96ila/u",
        accountType: "student",
        cgpa: 8.5,
        department: "CSE",
        semester: 1,
    },
    {
        firstName: "Admin",
        lastName: "User",
        email: "admin@demo.in",
        password: "$2b$10$zcY1LZMHnKTpauhFN48GYOil0bYr4.3876K7626Zij72ikf7Bir2m",
        accountType: "admin",
        department: "CSE",
        semester: 1,
        cgpa: 8.5
    }
];

// Courses data
const courses = [
    { name: "Classical Physics", description: "", credits: 4, isElective: false },
    { name: "Calculus and Ordinary Differential Equations", description: "", credits: 4, isElective: false },
    { name: "Basic Electronics", description: "", credits: 4, isElective: false },
    { name: "Basic Electronics Lab", description: "", credits: 1.5, isElective: false },
    { name: "Programming for Problem Solving", description: "", credits: 4.5, isElective: false },
    { name: "Technical Communication in English", description: "", credits: 3, isElective: false },
    { name: "Indian Knowledge System", description: "", credits: 1, isElective: false },
];

// Insert users into the database
(async () => {
    try {
        // Insert users
        for (const user of users) {
            const existingUser = await User.findOne({ email: user.email });
            if (existingUser) {
                console.log(`User with email ${user.email} already exists.`);
            } else {
                const insertedUser = await User.create(user);
                console.log("User inserted successfully:", insertedUser);
            }
        }

        // Insert courses
        for (const course of courses) {
            const existingCourse = await Course.findOne({ name: course.name });
            if (existingCourse) {
                console.log(`Course with name ${course.name} already exists.`);
            } else {
                const offeredTo = ["CSE", "CCE", "ECE", "MME"].map(department => ({ department, semester: 1 }));
                const newCourse = { ...course, offeredTo };
                const insertedCourse = await Course.create(newCourse);
                console.log("Course inserted successfully:", insertedCourse);
            }
        }
    } catch (error) {
        console.error("Error inserting data:", error);
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
})();
