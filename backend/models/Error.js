import mongoose from 'mongoose';

const errorSchema = new mongoose.Schema({
    errorName: {
        type: String,
        required: true
    },
    // Standard fields made optional for backward compatibility
    meaning: { type: String },
    cause: { type: String },
    solution: { type: String },
    
    // NEW: Structured Issues Array
    issues: [{
        title: String,
        line: Number,
        type: { type: String, enum: ['Error', 'Warning', 'Optimization'], default: 'Error' },
        meaning: String,
        cause: String,
        recommendation: String,
        fix: String
    }],
    
    fixCode: {
        type: String,
        required: true
    },
    language: {
        type: String,
        default: 'Unknown'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ErrorModel = mongoose.model('Error', errorSchema);
export default ErrorModel;
