import { simulateError, saveUserStats, getUserStats } from '../models/UserStats.js';
import { getSimulationResponse } from './simulationEngine.js';

export const explainError = async (req, res) => {
    try {
        const { code } = req.body;
        
        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Code snippet is required"
            });
        }

        // Get simulation response
        const result = getSimulationResponse(code);
        
        // Update user stats
        await getUserStats();

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error in explainError:', error);
        res.status(500).json({
            success: false,
            message: "Failed to explain error",
            error: error.message
        });
    }
};

export const getStats = async (req, res) => {
    try {
        const stats = await getUserStats();
        
        res.json({
            success: true,
            data: {
                totalPoints: stats?.totalPoints || 0,
                errorsExplained: stats?.errorsExplained || 0,
                level: stats?.level || 'Beginner',
                codeAnalyses: stats?.codeAnalyses || 0,
                examplesUsed: stats?.examplesUsed || 0
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch stats",
            error: error.message
        });
    }
};

export const useExample = async (req, res) => {
    try {
        const { exampleId } = req.body;
        
        // Update user stats for example usage
        await saveUserStats({ examplesUsed: 1 });

        res.json({
            success: true,
            message: "Example usage recorded"
        });
    } catch (error) {
        console.error('Error in useExample:', error);
        res.status(500).json({
            success: false,
            message: "Failed to record example usage",
            error: error.message
        });
    }
};
