import { getSimulationResponse } from './simulationEngine.js';
import UserStats from '../models/UserStats.js';

// GET or create a single stats document
const getOrCreateStats = async () => {
    let stats = await UserStats.findOne();
    if (!stats) {
        stats = await UserStats.create({});
    }
    return stats;
};

// POST /api/explain-error
export const explainError = async (req, res) => {
    try {
        const { query, error, mode } = req.body;
        const inputCode = query || error || '';

        if (!inputCode || !inputCode.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Please provide code or an error message to analyze.'
            });
        }

        // Run the simulation engine
        const simulationResult = getSimulationResponse(inputCode);

        // Safely update stats (non-blocking; don't fail if DB is offline)
        try {
            const stats = await getOrCreateStats();
            if (mode === 'code') {
                stats.codeAnalyses += 1;
                stats.totalPoints += 20;
            } else {
                stats.errorsExplained += 1;
                stats.totalPoints += 10;
            }
            stats.lastActivity = new Date();
            await stats.save();
        } catch (dbErr) {
            console.warn('[DB WARNING] Could not update stats:', dbErr.message);
        }

        return res.status(200).json({
            success: true,
            message: 'Analysis complete.',
            data: simulationResult
        });

    } catch (err) {
        console.error('[EXPLAIN ERROR]', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during analysis.',
            error: err.message
        });
    }
};

// GET /api/stats
export const getStats = async (req, res) => {
    try {
        const stats = await getOrCreateStats();
        return res.status(200).json({
            success: true,
            data: stats
        });
    } catch (err) {
        console.error('[STATS ERROR]', err);
        return res.status(500).json({
            success: false,
            message: 'Could not retrieve stats.',
            error: err.message
        });
    }
};

// POST /api/use-example
export const useExample = async (req, res) => {
    try {
        const { example } = req.body;
        if (!example) {
            return res.status(400).json({ success: false, message: 'No example provided.' });
        }

        const simulationResult = getSimulationResponse(example);

        // Safely update stats
        try {
            const stats = await getOrCreateStats();
            stats.examplesUsed += 1;
            stats.totalPoints += 5;
            stats.lastActivity = new Date();
            await stats.save();
        } catch (dbErr) {
            console.warn('[DB WARNING] Could not update stats:', dbErr.message);
        }

        return res.status(200).json({
            success: true,
            message: 'Example analysis complete.',
            data: simulationResult
        });
    } catch (err) {
        console.error('[USE-EXAMPLE ERROR]', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.',
            error: err.message
        });
    }
};
