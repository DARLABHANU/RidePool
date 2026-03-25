# 🚗 RidePool - Modern Ride-Sharing Platform

RidePool is a full-stack, real-time ride-sharing application designed to connect drivers and passengers for efficient commuting. It features interactive map integration, real-time chat, and a robust notification system.

---

## ✨ Features

- **🔐 Secure Authentication**: JWT-based user registration and login system.
- **🗺️ Interactive Maps**: Built-in Leaflet maps for precise location selection and route tracking.
- **💬 Real-Time Chat**: Live messaging between drivers and passengers powered by Socket.io.
- **🔔 Smart Notifications**: Instant alerts for new ride requests, chat messages, and status updates.
- **📍 Ride Management**: Easily create, search, and join rides with organized dashboarding.
- **💳 Payment Integration**: Streamlined payment modal and flow for seamless transactions.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: [React](https://reactjs.org/) (Version 19+)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Mapping**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Communication**: [Socket.io Client](https://socket.io/) & [Axios](https://axios-http.com/)
- **State/Routing**: [React Router](https://reactrouter.com/)

### **Backend**
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Real-Time**: [Socket.io](https://socket.io/)
- **Security**: [JSON Web Tokens (JWT)](https://jwt.io/) & [Bcryptjs](https://github.com/dcodeIO/bcrypt.js)

---

## 🚀 Getting Started

### **Prerequisites**
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally or an Atlas URI.

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RidePool
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/ridepool
   JWT_SECRET=your_jwt_secret_here
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

---

## 💻 Running the Application

You can run both the frontend and backend simultaneously in separate terminals.

### **Run Backend**
```bash
cd backend
npm run dev
```
*The API will be available at `http://localhost:5000`*

### **Run Frontend**
```bash
cd frontend
npm run dev
```
*The web app will be available at `http://localhost:5173`*

---

## 📁 Project Structure

```text
RidePool/
├── backend/
│   ├── config/      # Database configuration
│   ├── controllers/ # Request handlers
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API endpoints
│   ├── middleware/  # Auth & error handling
│   └── server.js    # Entry point & socket logic
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── pages/      # Application views
    │   ├── utils/      # Helpers & API config
    │   └── assets/     # Static images & styles
    ├── public/
    └── index.html
```

---

## 📝 License

This project is licensed under the MIT License.
