import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
submissionSchema.index({ createdAt: -1 });

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;