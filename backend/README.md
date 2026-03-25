# ⚙️ RidePool Backend - Node.js + Express API

This is the backend API for the RidePool ride-sharing application, built with Node.js, Express, and MongoDB.

## ✨ Tech Stack

- **Node.js**: Asynchronous event-driven JavaScript runtime.
- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB & Mongoose**: NoSQL database for flexible data modeling.
- **Socket.io**: Real-time bidirectional event-based communication.
- **JWT**: Secure token-based user authentication.
- **Bcryptjs**: Robust password hashing.

## 🛠️ Setup & Scripts

Ensure you have [Node.js](https://nodejs.org/) and a running [MongoDB](https://www.mongodb.com/) instance.

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in this directory and add:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/ridepool
   JWT_SECRET=your_jwt_secret_here
   ```

3. **Start Dev Server (with Nodemon)**:
   ```bash
   npm run dev
   ```
   *The API will be available at `http://localhost:5000`.*

4. **Start Server (Production)**:
   ```bash
   npm start
   ```

## 📁 Key Directories

- `config/`: Database and server configuration.
- `controllers/`: Logic for handling API requests.
- `models/`: Mongoose schemas for Users, Rides, and Messages.
- `routes/`: Express router definitions for Auth, Rides, and Requests.
- `middleware/`: Authentication and security middleware.
- `utils/`: Utility functions and helper scripts.

---

For frontend setup, refer to the root `README.md`.
