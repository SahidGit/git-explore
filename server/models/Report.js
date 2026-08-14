const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
    {
        issueType: {
            type: String,
            required: [true, 'Issue type is required'],
            enum: {
                values: [
                    'Bug Report',
                    'Feature / Suggestion',
                    'Content / Data Error',
                    'Broken Link',
                    'Other',
                ],
                message: '{VALUE} is not a valid issue type',
            },
        },
        pageUrl: {
            type: String,
            trim: true,
            default: '',
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                'Please provide a valid email address',
            ],
            default: '',
        },
        status: {
            type: String,
            default: 'open',
            enum: ['open', 'in-progress', 'resolved'],
        },
        ipAddress: {
            type: String,
            default: '',
        },
        userAgent: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Report', reportSchema);
