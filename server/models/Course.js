const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    semester: {
        type: Number,
        required: true
    },
    department: {
        type: String,
        enum: ['CSE', 'CCE', 'ECE', "MME"],
        required: true
    }, 
    description: {
        type: String,
        trim: true
    },
    resources: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource'
    }], // List of resources within the folder
    ytLinks: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'YTLink'
    }], // List of youtube links within the folder
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Admin who created the folder
    },
}, {
    timestamps: true
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
