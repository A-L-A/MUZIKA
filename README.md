# MUZIKA: East African Music Events Platfor 🎵

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

## Project Structure

### Frontend

```
frontend/
├── public/             # Static files
├── src/
│   ├── assets/         # Images and other assets
│   ├── components/     # Reusable UI components
│   │   ├── Admin/      # Admin dashboard components
│   │   ├── Artists/    # Artist-related components
│   │   ├── Auth/       # Authentication components
│   │   ├── Eventss/    # Event-related components
│   │   ├── Home/       # Home page components
│   │   └── Layout/     # Layout components (navbar, footer)
│   ├── context/        # React Context for state management
│   ├── pages/          # Main application pages
│   ├── services/       # API service functions
│   ├── styles/         # Global styles and theme settings
│   ├── utils/          # Utility functions
│   ├── App.js          # Main application component
│   └── index.js        # Entry point
└── package.json        # Dependencies and scripts
```

### Backend

```
backend/
├── controllers/        # Route controllers
├── middleware/         # Custom middleware
├── models/             # Mongoose data models
├── routes/             # API route definitions
├── utils/              # Utility functions
├── index.js            # Server entry point
└── package.json        # Dependencies and scripts
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/google` - Google OAuth login

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/profile` - Delete user profile

### Artists
- `GET /api/artists` - Get all artists
- `POST /api/artists` - Create artist profile
- `GET /api/artists/:id` - Get artist by ID
- `PUT /api/artists/:id` - Update artist profile
- `DELETE /api/artists/:id` - Delete artist profile

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get event by ID
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/user` - Get events by current user

## Performance Optimizations

The MUZIKA platform includes several optimizations for better performance:

- **API Call Caching**: Geocoding and address lookups are cached to reduce requests
- **Component Memoization**: React.memo is used to prevent unnecessary re-renders
- **Lazy Loading**: Images and components are loaded only when needed
- **Optimized Map Rendering**: Map markers are efficiently managed to improve performance
- **Debouncing**: Search inputs are debounced to limit API calls
- **Responsive Image Sizes**: Images are requested at appropriate dimensions

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Acknowledgments

- All the amazing East African musicians who inspire this platform
- Unsplash for placeholder images
