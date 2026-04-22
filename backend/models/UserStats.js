import mongoose from 'mongoose';

const userStatsSchema = new mongoose.Schema({
    totalPoints: {
        type: Number,
        default: 0
    },
    errorsExplained: {
        type: Number,
        default: 0
    },
    codeAnalyses: {
        type: Number,
        default: 0
    },
    examplesUsed: {
        type: Number,
        default: 0
    },
    level: {
        type: String,
        default: 'Beginner'
    },
    lastActivity: {
        type: Date,
        default: Date.now
    }
});

const UserStats = mongoose.model('UserStats', userStatsSchema);
export default UserStats;
