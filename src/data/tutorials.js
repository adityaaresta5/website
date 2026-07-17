export const tutorials = [
  {
    id: "node-api",
    title: "How to Build a REST API with Node.js and Express",
    description: "Learn how to build a scalable and secure RESTful API from scratch using Node.js, Express, and MongoDB. Perfect for backend beginners.",
    category: "Backend & API",
    readTime: "12 min read",
    views: "15K",
    date: "Jul 15, 2026",
    author: "Alex Developer",
    file: "node-api.md"
  },
  {
    id: "docker-react",
    title: "Dockerizing a React Application for Production",
    description: "A step-by-step guide to creating Docker images for your React apps. Optimize your builds using multi-stage Dockerfiles and Nginx.",
    category: "DevOps & Cloud",
    readTime: "8 min read",
    views: "22K",
    date: "Jul 10, 2026",
    author: "Sarah Cloud",
    file: "docker-react.md"
  }
];

export const getTutorialById = (id) => {
  return tutorials.find(t => t.id === id);
};
