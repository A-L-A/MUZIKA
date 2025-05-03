# MUZIKA: East African Music Events Platform 🎵

MUZIKA is a modern web application connecting fans with East African musicians and events. The platform allows users to discover artists, locate upcoming music events, and enables artists and event hosts to promote themselves and their events.

## [Live Demo](https://muzika-frontend.onrender.com/)

## Features

- **Interactive Event Map**: Find music events with an interactive map interface
- **Artist Discovery**: Browse artists by genre, country, and other filters
- **User Profiles**: Separate dashboards for regular users, artists, and event hosts
- **Event Creation**: Event hosts can create and manage music events
- **Responsive Design**: Fully responsive interface that works across all devices
- **Dark Mode**: Toggle between light and dark theme

## Technology Stack

### Frontend
- React.js
- Material UI
- Leaflet (maps)
- Context API for state management
- React Router for navigation

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication
- RESTful API architecture

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB connection (local or Atlas)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/muzika.git
cd muzika
```

2. Install dependencies for both frontend and backend
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Create environment variables
   
   **Backend (.env file in backend directory)**
   ```
   PORT=5000
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:3000
   ```

   **Frontend (.env file in frontend directory)**
   ```
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. Start development servers

   **Backend**
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend**
   ```bash
   cd frontend
   npm start
   ```

5. Visit `http://localhost:3000` to see the application running


## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add some new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Open a Pull Request

## Project Status

Muzika is currently in active development. The Google authentication flow is being refined and tests are being implemented. The main functionality of the site is operational, but some authentication features are still being optimized.

For local development, please use email/password authentication until Google auth is fully stable.

## Acknowledgments

- All the amazing East African musicians who inspire this platform
- Unsplash for placeholder images
