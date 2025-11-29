import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { formSchema } from './formSchema.js';
import { validateSubmission } from './validation.js';
import { connectDB } from './db.js';
import Submission from './models/Submission.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// GET /api/form-schema
app.get('/api/form-schema', (req, res) => {
  res.status(200).json(formSchema);
});

// POST /api/submissions
app.post('/api/submissions', async (req, res) => {
  try {
    const formData = req.body;

    // Validate submission
    const validationErrors = validateSubmission(formData, formSchema);

    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors
      });
    }

    // Create submission in MongoDB
    const submission = new Submission({
      data: formData
    });

    await submission.save();

    res.status(201).json({
      success: true,
      id: submission._id,
      createdAt: submission.createdAt
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create submission'
    });
  }
});

// GET /api/submissions
app.get('/api/submissions', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';

    // Validate pagination parameters
    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid pagination parameters'
      });
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate skip
    const skip = (page - 1) * limit;

    // Fetch submissions from MongoDB
    const [submissions, totalSubmissions] = await Promise.all([
      Submission.find()
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Submission.countDocuments()
    ]);

    // Format submissions
    const formattedSubmissions = submissions.map(sub => ({
      id: sub._id,
      createdAt: sub.createdAt,
      data: sub.data
    }));

    const totalPages = Math.ceil(totalSubmissions / limit);

    res.status(200).json({
      success: true,
      data: formattedSubmissions,
      pagination: {
        currentPage: page,
        totalPages,
        totalSubmissions,
        limit
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch submissions'
    });
  }
});

app.listen(PORT, () => {
  // Server started successfully
});