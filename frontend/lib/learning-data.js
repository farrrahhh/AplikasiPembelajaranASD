export const topicCatalog = [
  {
    slug: "linked-list",
    title: "Linked List",
    description: "Learn about linear data structures with pointers.",
    shortDescription: "Struktur data berantai antar node.",
    progress: 45,
    level: "Beginner",
    exercises: 20,
    duration: "~2 hours",
    recommended: true,
    accent: "from-[#5f6af4] to-[#a020f0]",
    icon: "linked-list",
    status: "in-progress",
  },
  {
    slug: "stack",
    title: "Stack",
    description: "Master LIFO (Last In First Out) data structure.",
    shortDescription: "Struktur data dengan prinsip LIFO.",
    progress: 80,
    level: "Beginner",
    exercises: 20,
    duration: "~2 hours",
    accent: "from-[#4f7eed] to-[#6b4eff]",
    icon: "stack",
    status: "beginner",
  },
  {
    slug: "queue",
    title: "Queue",
    description: "Understand FIFO (First In First Out) operations.",
    shortDescription: "Struktur data dengan prinsip FIFO.",
    progress: 60,
    level: "Beginner",
    exercises: 20,
    duration: "~2 hours",
    accent: "from-[#f487c7] to-[#f0bddf]",
    icon: "queue",
    status: "beginner",
  },
  {
    slug: "tree",
    title: "Tree",
    description: "Explore hierarchical data structures.",
    shortDescription: "Pelajari traversal dan relasi parent-child.",
    progress: 25,
    level: "Intermediate",
    exercises: 20,
    duration: "~2 hours",
    accent: "from-[#d8f5b6] to-[#fff4bd]",
    icon: "tree",
    status: "intermediate",
  },
  {
    slug: "graph",
    title: "Graph",
    description: "Study networks and connections.",
    shortDescription: "Pahami relasi node dan edge lebih kompleks.",
    progress: 10,
    level: "Advanced",
    exercises: 20,
    duration: "~2 hours",
    accent: "from-[#eef1f9] to-[#f8f9fc]",
    icon: "graph",
    status: "locked",
    locked: true,
  },
  {
    slug: "sorting",
    title: "Sorting Algorithms",
    description: "Learn different sorting techniques.",
    shortDescription: "Bandingkan strategi sorting dan kompleksitasnya.",
    progress: 50,
    level: "Intermediate",
    exercises: 20,
    duration: "~2 hours",
    accent: "from-[#fff4be] to-[#fff9dd]",
    icon: "sorting",
    status: "locked",
    locked: true,
  },
];

export const dashboardStats = [
  { label: "Latihan selesai", value: "54" },
  { label: "Hari berturut-turut", value: "7" },
  { label: "Topik selesai", value: "2" },
  { label: "Jam belajar", value: "12" },
];

export const insightsSummary = [
  {
    label: "Rata-rata nilai",
    value: "43%",
    tone: "blue",
  },
  {
    label: "Topik yang kuat",
    value: "3",
    tone: "green",
  },
  {
    label: "Butuh latihan",
    value: "3",
    tone: "red",
  },
];

export const improvementAreas = [
  {
    title: "Linked List",
    description: "Fokus pada manipulasi pointer dan kasus-kasus khusus.",
    progress: 55,
    icon: "linked-list",
  },
  {
    title: "Tree",
    description: "Latihan algoritma tree traversal.",
    progress: 55,
    icon: "tree",
  },
  {
    title: "Graph",
    description: "Bangun pemahaman BFS, DFS, dan representasi graph.",
    progress: 55,
    icon: "graph",
  },
];

export const personalizedPlan = [
  {
    title: "Fokus pada dasar Linked List",
    description: "Selesaikan 5 lebih latihan pada manipulasi pointer dan edge case.",
  },
  {
    title: "Master algoritma Tree traversal",
    description: "Latihan in-order, pre-order, dan post-order traversal.",
  },
  {
    title: "Persiapan untuk algoritma Graph",
    description: "Belajar BFS dan DFS dengan contoh visual.",
  },
];

export const progressSummary = [
  { label: "Overall Progress", value: "45%", tone: "purple" },
  { label: "Exercises Completed", value: "54", tone: "green" },
  { label: "Topics Started", value: "6", tone: "blue" },
  { label: "Day Streak", value: "7", tone: "gold" },
];

export const progressBars = [
  { label: "Linked List", value: 45, color: "#5f6af4" },
  { label: "Stack", value: 80, color: "#7a55ec" },
  { label: "Queue", value: 60, color: "#d24f9c" },
  { label: "Tree", value: 25, color: "#ed9d28" },
  { label: "Graph", value: 10, color: "#42b883" },
  { label: "Sorting Algorithms", value: 50, color: "#4d7de0" },
];

export const achievements = [
  {
    title: "Stack Master",
    description: "Completed Stack with 80%+",
    status: "Unlocked",
    tone: "gold",
  },
  {
    title: "Week Warrior",
    description: "7-day learning streak",
    status: "Active",
    tone: "green",
  },
  {
    title: "Fast Learner",
    description: "50 exercises this week",
    status: "Locked",
    tone: "blue",
  },
];
