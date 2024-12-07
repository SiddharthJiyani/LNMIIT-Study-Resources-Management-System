const mongoose = require("mongoose");

const gradeSurveySchema = new mongoose.Schema({
    rollNumber: {
        type: String,
        required: true,
        trim: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
        trim: true
    },
    grade: {
        type: String,
        enum: ['A', 'AB', 'B', 'BC', 'C', 'CD', 'D', 'F'],
        required: true
    },
    marks: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    }
}, {
    timestamps: true
});

const GradeSurvey = mongoose.model('GradeSurvey', gradeSurveySchema);
module.exports = GradeSurvey;
