const course = {
  _id: "mongodbid",

  courseName: "Course Title",
  description: "Course description",

  coverArt: "image-url",

  isVisible: true,

  createdAt: Date,
  updatedAt: Date,

  topics: [
    {
      _id: "mongodbid",

      topicName: "Introduction",
      order: 1,

      createdAt: Date,
      updatedAt: Date,

      content: {
        data: [
          {
            _id: "mongodbid",

            type: "TEXT",
            // enum 
            //   "TEXT",
            // "IMAGE",
            // "VIDEO",
            // "AUDIO",
            // "LINK",
            // "FILE",
            // "DOCS",
            // "EMBED",
            // "DISCUSSION",
            // "QNA",
            // "MCQ",
            // "PPT",

            order: 1,

            data: {
              // dynamic data based on type. here user can store any type of dynamic data
            },

            createdAt: Date,
            updatedAt: Date,
          },

          {
            _id: "mongodbid",
            type: "VIDEO",
            order: 2,
            data: {
              url: "https://youtube.com/...",
              duration: 300,
            },
            createdAt: Date,
            updatedAt: Date,
          },
        ],
      },
    },
  ],
};
