/* ========================================
   ACADEMIC JOURNAL DATA
======================================== */

const journalData = {
  subjects: [
    {
      id: "computer-architecture",

      name: "Computer Architecture & Organization",

      description: "Computer systems, architecture & organization",

      note: "what's happening inside the machine?",

      entries: [],
    },

    {
      id: "collaborative-design",

      name: "Collaborative Design",

      description: "Design processes, collaboration & development",

      note: "",

      entries: [],
    },

    {
      id: "machine-learning",

      name: "Machine Learning",

      description: "Learning systems, neural models & experiments",

      note: "wait... it actually learned???",

      entries: [
        {
          id: "machine-learning-games",

          title: "Machine Learning in Digital Games",

          type: "Paper",

          description: "Applications, examples & critical analysis",

          note: "",

          page: "Subjects/Machine Learning/paper_1/index.html",
        },

        {
          id: "hebbian-learning",

          title: "Hebbian Learning",

          type: "Project",

          description: "Hebb's Rule & Boolean Functions",

          note: "",

          page: "Subjects/Machine Learning/paper_2/index.html",
        },

        {
          id: "perceptron",

          title: "Perceptron",

          type: "Project",

          description: "Feature vectors & classification",

          note: "coming soon...",

          page: "",
        },
      ],
    },

    {
      id: "statistics",

      name: "Statistics",

      description: "Probability, inference & data analysis",

      note: "",

      entries: [],
    },
  ],
};
