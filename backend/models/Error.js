import mongoose from 'mongoose';

const errorSchema = new mongoose.Schema({
    errorName: {
        type: String,
        required: true
    },
    meaning: {
        type: String,
        required: true
    },
    cause: {
        type: String,
        required: true
    },
    solution: {
        type: String,
        required: true
    },
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
