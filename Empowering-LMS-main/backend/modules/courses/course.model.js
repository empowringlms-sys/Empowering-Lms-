const mongoose = require("mongoose");

const CONTENT_TYPES = Object.freeze([
  "TEXT",
  "IMAGE",
  "VIDEO",
  "AUDIO",
  "LINK",
  "FILE",
  "DOCS",
  "EMBED",
  "DISCUSSION",
  "QNA",
  "MCQ",
  "PPT",
]);

const contentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: CONTENT_TYPES,
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const topicSchema = new mongoose.Schema(
  {
    topicName: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },
    content: {
      data: [contentSchema],
      _id: false,
    },
  },
  {
    timestamps: true,
  }
);

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: false, // Optional for global courses
    },
    isGlobal: {
      type: Boolean,
      default: false,
    },
    coverArt: {
      type: String,
      default: null,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    topics: [topicSchema],

  },
  {
    timestamps: true,
  }
);

// Existing indexes
courseSchema.index({ courseName: "text", description: "text" });
courseSchema.index({ isVisible: 1 });
courseSchema.index({ isGlobal: 1 });
courseSchema.index({ createdAt: -1 });
topicSchema.index({ order: 1 });
contentSchema.index({ order: 1 });

courseSchema.virtual("topicCount").get(function () {
  return this.topics.length;
});

courseSchema.virtual("totalContentCount").get(function () {
  return this.topics.reduce(
    (total, topic) => total + topic.content.data.length,
    0
  );
});

const Course = mongoose.model("Course", courseSchema);

module.exports = {
  Course,
  CONTENT_TYPES,
};