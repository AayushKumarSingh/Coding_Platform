import express from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { redis as Redis } from '../../common/redis';

const router = express.Router();

// POST /submit
router.post('/', async (req, res) => {
    try {
        const { questionId, code, language } = req.body;

        if (!questionId || !code || !language) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const jobId = uuidv4(); // Generate unique job ID
        const redisKey = `job:${jobId}`;

        // Set initial status in Redis
        await Redis.set(redisKey, JSON.stringify({
            status: 'pending',
            result: null
        }));

        // Send to Spring Boot solver
        axios.post(`http://localhost:8080/api/submit/${questionId}`, {
            code,
            language
        }).then(async (solverRes) => {
            // Update Redis when solver responds
            await Redis.set(redisKey, JSON.stringify({
                status: 'completed',
                result: solverRes.data
            }));
        }).catch(async (err) => {
            // Update Redis if error
            await Redis.set(redisKey, JSON.stringify({
                status: 'error',
                error: err.message
            }));
        });

        // Immediately return jobId for polling
        res.json({ jobId });

    } catch (err) {
        console.error('Error in submission route:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /status/:jobId → Check job status
router.get('/status/:jobId', async (req, res) => {
    const { jobId } = req.params;
    const redisKey = `job:${jobId}`;

    const jobData = await Redis.get(redisKey);
    if (!jobData) {
        return res.status(404).json({ error: 'Job not found' });
    }

    res.json(JSON.parse(jobData));
});

export default router;
