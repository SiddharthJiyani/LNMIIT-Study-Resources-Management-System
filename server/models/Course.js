const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    offeredTo: [{
        department: {
            type: String,
            enum: ['CSE', 'CCE', 'ECE', 'MME'], // Restrict to valid departments
            required: true
        },
        semester: {
            type: Number,
            required: true
        }
    }],
    description: {
        type: String,
        trim: true
    },
    credits: {
        type: Number,
        required: true
    },
    isElective: {
        type: Boolean,
        default: false,
    },
    resources: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource'
    }], // List of resources within the folder
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Admin who created the folder
    },
}, {
    timestamps: true
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
