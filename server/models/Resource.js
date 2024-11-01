const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    fileType: {
        type: String,
        enum: ['notes', 'slides', 'pyqs', 'assignment', 'other'],
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    fileUrl: {
        type: String, // This could store the location or URL of the uploaded file.
        required: true,
    },
    // resource_type: {    //AVOID INCLUDING THIS , IF INCLUDED THEN NEED TO REUPLOAD ALL THE EXISTING RESOURCES OTHERWISE REMOVE REQUIRED FIELD
    //     type: String, // This could store the type of resource, like 'video', 'pdf', 'doc', etc.
    //     required: true,
    // },
    ratings: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Tracks the user giving the rating
        score: { type: Number, min: 1, max: 5 } // The rating score, e.g., 1 to 5
    }],
    averageRating: { 
        type: Number, 
        default: 0 
    },
    feedback: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Refers to the user giving feedback
        comment: String,
        createdAt: { type: Date, default: Date.now },
    }],
    isApproved: {
        type: Boolean, // To flag outdated or irrelevant resources
        default: false,
    },
}, {
    timestamps: true,
});

const Resource = mongoose.model('Resource', resourceSchema);
module.exports = Resource;
