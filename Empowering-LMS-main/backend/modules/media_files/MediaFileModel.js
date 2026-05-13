const mongoose = require('mongoose');

const mediaFileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'File name is required'],
    trim: true
  },
  size: {
    type: Number,
    required: [true, 'File size is required'],
    min: 0
  },
  src: {
    type: String,
    required: [true, 'File URL is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'File type is required'],
    enum: ['image', 'video', 'audio', 'document', 'archive', 'other']
  },
  extension: {
    type: String,
    required: [true, 'File extension is required'],
    trim: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    ref: "Company",
    required: function () {
      return !this.isGlobal;
    },
  },
  isGlobal: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true
});

// Indexes for better query performance
mediaFileSchema.index({ type: 1 });
mediaFileSchema.index({ createdAt: -1 });

const MediaFile = mongoose.model('MediaFile', mediaFileSchema);

module.exports = MediaFile;
