import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import explainRoutes from './routes/explain.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', explainRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(`[SERVER ERROR] ${err.stack}`);
    res.status(500).json({
        success: false,
        message: "Something went wrong on the server!",
        error: err.message
    });
});

// Health check
app.get('/', (req, res) => {
    res.send('Code Fixers API is running...');
});

const PORT = process.env.PORT || 5000;

// Connect DB and Start Server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
};

startServer();
