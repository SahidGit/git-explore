const mongoose = require('mongoose');

const VALID_ISSUE_TYPES = [
    // 10 UI categories from ReportIssue.jsx
    'AI Newsroom: Inaccurate Model Pricing / Specs',
    'AI Newsroom: Broken arXiv / Paper Link',
    'AI Newsroom: Missing Model / Lab Suggestion',
    'ExploreGit: Repository Search / Filter Bug',
    'GitHub API & Token Rate Limit Issue',
    'Local Bookmarks & Export Bug',
    'UI Layout / Responsive Glitch',
    'Feature Request / Platform Idea',
    'Documentation or Typo Correction',
    'Other / General Feedback',
    // 5 Generic / legacy categories
    'Bug Report',
    'Feature / Suggestion',
    'Content / Data Error',
    'Broken Link',
    'Other',
];

const reportSchema = new mongoose.Schema(
    {
        issueType: {
            type: String,
            required: [true, 'Issue type is required'],
            enum: {
                values: VALID_ISSUE_TYPES,
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

// Indexes for query performance
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
