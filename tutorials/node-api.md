# How to Build a REST API with Node.js and Express

Welcome to this comprehensive tutorial on building a REST API using Node.js, Express, and MongoDB. By the end of this guide, you will have a fully functional backend system that you can deploy to production.

## Prerequisites

Before we start, make sure you have the following installed on your machine:
* Node.js (v18 or later)
* MongoDB (Local or Atlas)
* A code editor (like VS Code)

## Step 1: Initialization

First, let's create a new folder for our project and initialize it with npm:

```bash
mkdir my-express-api
cd my-express-api
npm init -y
```

Next, we'll install our core dependencies:

```bash
npm install express mongoose cors dotenv
```

## Step 2: Creating the Server

Create a file named `server.js` and add the following code to set up a basic Express server:

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### Explanation:
- **Express**: The framework we use to build the API.
- **CORS**: Middleware that allows cross-origin requests.
- **Dotenv**: Loads environment variables from a `.env` file.

## Step 3: Connecting to MongoDB

*(You can continue adding more sections here...)*

> **Tip**: Always remember to secure your API endpoints before deploying them!

---
*End of tutorial.*
