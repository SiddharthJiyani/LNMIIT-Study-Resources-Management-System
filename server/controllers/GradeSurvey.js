const GradeSurvey = require("../models/GradeSurvey");

// Add or Update GradeSurvey data
exports.addOrUpdateGradeSurvey = async (req, res) => {
    try {
        const { rollNumber, courseName, grade, marks } = req.body;

        if (!rollNumber || !courseName || !grade || marks === undefined) {
            return res.status(400).json({
                success: false,
                message: "Please enter all required fields",
            });
        }
        // console.log(req.body);
        // Check if a record already exists for the given roll number and course name
        let gradeSurvey = await GradeSurvey.findOne({ rollNumber, courseName });

        if (gradeSurvey) {
            // Update the existing record
            gradeSurvey.grade = grade;
            gradeSurvey.marks = marks;
            await gradeSurvey.save();
            return res.status(200).json({
                success: true,
                message: "Grade survey updated successfully",
                data: gradeSurvey,
            });
        } else {
            // Create a new record
            gradeSurvey = new GradeSurvey({
                rollNumber,
                courseName,
                grade,
                marks,
            });
            await gradeSurvey.save();
            return res.status(201).json({
                success: true,
                message: "Grade survey added successfully",
                data: gradeSurvey,
            });
        }
    } catch (error) {
        console.error("Error adding or updating grade survey: ", error.message);
        res.status(500).json({
            success: false,
            message: "Error adding or updating grade survey",
            error: error.message,
        });
    }
};

// Fetch GradeSurvey data by course name
exports.getGradeSurveysByCourseName = async (req, res) => {
    try {
        const { courseName } = req.params;
        // console.log(req.params);
        // Find all grade surveys for the specified course name
        const gradeSurveys = await GradeSurvey.find({ courseName });
        // console.log(gradeSurveys);
        if (gradeSurveys.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No grade surveys found for the specified course",
            });
        }

        res.status(200).json({
            success: true,
            message: "Grade surveys fetched successfully",
            survey: gradeSurveys,
        });
    } catch (error) {
        console.error("Error fetching grade surveys by course name: ", error.message);
        res.status(500).json({
            success: false,
            message: "Error fetching grade surveys",
            error: error.message,
        });
    }
};
