# 🚗 RidePool - Modern Carpooling Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT) 
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--Time-010101?logo=socket.io&logoColor=white)](https://socket.io/)

> A full-stack, real-time web application connecting drivers with empty seats to passengers traveling exactly the same way. The most affordable and ecological way to travel.

## ✨ Key Features

- 🔒 **Secure Authentication**: End-to-end JWT-based registration and login system.
- 💬 **In-App Messaging Engine**: Fully functional real-time live chat between drivers and passengers securely isolated to distinct ride rooms using WebSockets (`Socket.io`).
- 🔔 **Instant Notification Bell**: Persistent floating dashboard alerts delivered the exact millisecond you receive a passenger request, emergency update, or chat message.
- 🗺️ **Live Geographic Autocomplete**: Intelligent address-predictive forms powered by the Photon / OpenStreetMaps Geocoder API.
- ⚡ **Advanced Filtering Board**: Instantly sort through live listed trips directly via dynamic sliders (Max Price, Departure Times, Driver Ratings).
- 🚨 **Emergency Tow Services**: Built-in SOS emergency request architecture allowing immediate towing dispatches.

## 🛠️ Tech Stack & Technologies

**Client (Frontend)**
- **Framework**: React / Vite environment (`ES6+`)
- **Routing**: React Router DOM v7
- **Icons**: Lucide-React
- **Real-Time Engine**: Socket.io Client
- **Maps**: React-Leaflet
- **Styling**: Modern, responsive raw CSS modularity

**Server (Backend)**
- **Environment**: Node.js & Express.js API
- **Database**: MongoDB (Mongoose ORM)
- **Real-Time Engine**: Socket.io Server logic
- **Security**: JWT (JSON Web Tokens), bcryptjs

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

You need to have **Node.js** and **npm** installed on your machine, along with a running **MongoDB** cluster (local or Atlas compass).

### 1. Clone the repository

```bash
git clone https://github.com/your-username/RidePool.git
cd RidePool
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create a `.env` file in the /backend directory
touch .env
```

Add your environment variables inside the `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

Start the backend development server:
```bash
npm run dev
```
*(The server should now be running cleanly on `http://localhost:5000`)*

### 3. Frontend Setup

Open a new terminal session.

```bash
cd frontend

# Install dependencies
npm install
```

Start the interactive frontend Vite server:
```bash
npm run dev
```

*(Click the rendered localhost link in your terminal to see the live app)*

---

## 📂 Project Directory Structure

```text
RidePool/
├── backend/
│   ├── config/             # MongoDB connection logic
│   ├── controllers/        # Core business logic (Auth, Rides, Requests)
│   ├── middleware/         # Custom JWT protection pipelines
│   ├── models/             # Mongoose Schemas (User, Ride, Request)
│   ├── routes/             # RESTful API Endpoints definitions
│   ├── util/               # JWT helper functions
│   └── server.js           # Server Initialization + Socket.io Pipelines
│
└── frontend/
    ├── public/             
    └── src/
        ├── assets/         # Static images & graphics
        ├── components/     # Reusable UI Blocks (Navbar, LocationInput, Footer)
        ├── pages/          # Full Route views (Home, Account, Publish, Results)
        ├── utils/          # Interceptor Axios API instances
        ├── App.jsx         # App Routing Index
        └── index.css       # Global design variables (Colors, Typography)
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 💌 Acknowledgments

- [Photon Komoot Geocoder Engine](https://photon.komoot.io/)
- [Unsplash Photography Imagery](https://unsplash.com)
- [Lucide Icons Library](https://lucide.dev/)
