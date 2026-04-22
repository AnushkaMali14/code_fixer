import ErrorModel from '../models/Error.js';
import UserStats from '../models/UserStats.js';
import { getSimulationResponse } from './simulationEngine.js';

let inMemoryStats = {
    totalPoints: 0,
    errorsExplained: 0,
    codeAnalyses: 0,
    examplesUsed: 0,
    level: 'Beginner'
};

export const explainError = async (req, res) => {
    console.log(`[BACKEND] Received ${req.body.mode} analysis request for: "${req.body.query.substring(0, 50)}..."`);
    
    try {
        const { query, mode } = req.body;
        const analysis = getSimulationResponse(query);
        
        // Log the generated analysis
        console.log(`[BACKEND] Analysis generated successfully for language: ${analysis.language}`);

        try {
            const newError = new ErrorModel(analysis);
            await newError.save();
            console.log(`[BACKEND] History saved to database.`);
        } catch (e) {
            console.warn(`[BACKEND] Database Save failed (skipping): ${e.message}`);
        }

        let pointsEarned = 0;
        if (mode === 'code') {
            pointsEarned = 20;
            inMemoryStats.codeAnalyses += 1;
        } else {
            pointsEarned = 10;
            inMemoryStats.errorsExplained += 1;
        }
        
        if (inMemoryStats.errorsExplained % 10 === 0 && inMemoryStats.errorsExplained !== 0) {
            pointsEarned += 50;
        }
        
        inMemoryStats.totalPoints += pointsEarned;
        
        if (inMemoryStats.totalPoints > 300) {
            inMemoryStats.level = 'Advanced';
        } else if (inMemoryStats.totalPoints > 100) {
            inMemoryStats.level = 'Intermediate';
        }

        try {
            let stats = await UserStats.findOne();
            if (!stats) stats = new UserStats();
            stats.totalPoints = inMemoryStats.totalPoints;
            stats.errorsExplained = inMemoryStats.errorsExplained;
            stats.codeAnalyses = inMemoryStats.codeAnalyses;
            stats.level = inMemoryStats.level;
            await stats.save();
            console.log(`[BACKEND] Stats updated in database.`);
        } catch (e) {
            console.warn(`[BACKEND] DB Stats update failed (using in-memory): ${e.message}`);
        }
        
        console.log(`[BACKEND] Sending success response to client. Points earned: ${pointsEarned}`);
        res.status(200).json({
            success: true,
            data: analysis,
            pointsEarned,
            newTotalPoints: inMemoryStats.totalPoints,
            level: inMemoryStats.level
        });
        
    } catch (error) {
        console.error(`[BACKEND ERROR] Critical failure in explainError: ${error.message}`);
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error",
            error: error.message,
            fallback: {
                meaning: "The analysis engine encountered an unexpected error.",
                cause: "Server-side processing failure.",
                solution: "Please check your input formatting or try again in a few minutes.",
                fixCode: "// No fix available due to server error"
            }
        });
    }
};

export const getStats = async (req, res) => {
    try {
        try {
            let stats = await UserStats.findOne();
            if (stats) return res.status(200).json({ success: true, data: stats });
        } catch (e) {}
        res.status(200).json({ success: true, data: inMemoryStats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const useExample = async (req, res) => {
    try {
        inMemoryStats.totalPoints += 5;
        inMemoryStats.examplesUsed += 1;
        
        try {
            let stats = await UserStats.findOne();
            if (!stats) stats = new UserStats();
            stats.totalPoints = inMemoryStats.totalPoints;
            stats.examplesUsed = inMemoryStats.examplesUsed;
            await stats.save();
        } catch (e) {}
        
        res.status(200).json({ success: true, newPoints: inMemoryStats.totalPoints });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
