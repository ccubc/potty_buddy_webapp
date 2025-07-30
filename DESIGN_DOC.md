# Potty Buddy - Design Document

## Overview
Potty Buddy is a simple web application designed to help parents track their child's potty training progress. Users can log whether their child had an accident ("dirty pants") or successfully used the potty.

## Features

### Core Features
1. **User Registration**: Simple username-based registration (no password required)
2. **Event Logging**: Two main events - "Dirty Pants" and "Potty"
3. **Visual & Audio Feedback**: Cartoon icons, pictures, and sounds when buttons are clicked
4. **Statistics Dashboard**: 14-day history of events with counts

### User Flow
1. User visits the app
2. Enters username (system checks for uniqueness)
3. If username exists, prompts for alternative
4. Upon valid username, redirects to main dashboard
5. User can click "Dirty Pants" or "Potty" buttons
6. Visual/audio feedback plays
7. Event is logged with timestamp
8. Statistics tab shows 14-day history

## Technical Architecture

### Frontend (Vercel Deployment)
- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React hooks (useState, useEffect)
- **Audio/Visual**: HTML5 audio and image elements

### Backend (Render Deployment)
- **Framework**: Node.js with Express
- **Database**: PostgreSQL (via Render)
- **API**: RESTful endpoints for user management and event logging

### Database Schema
```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('dirty_pants', 'potty')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### API Endpoints
- `POST /api/users` - Create new user
- `GET /api/users/:username` - Check if username exists
- `POST /api/events` - Log new event
- `GET /api/events/:userId` - Get user's events for statistics

## Implementation Status ✅

### Completed Components

#### Backend
- ✅ Express server with security middleware
- ✅ PostgreSQL database configuration
- ✅ User management API routes
- ✅ Event logging API routes
- ✅ Statistics API with 14-day aggregation
- ✅ CORS and rate limiting configuration
- ✅ Environment variable support

#### Frontend
- ✅ Next.js application with TypeScript
- ✅ Tailwind CSS styling with custom theme
- ✅ User registration component
- ✅ Main dashboard with tab navigation
- ✅ Event buttons with audio/visual feedback
- ✅ Statistics component with 14-day view
- ✅ Responsive design for mobile/desktop
- ✅ API client with error handling

#### Features Implemented
- ✅ Username validation and uniqueness checking
- ✅ Event logging with timestamps
- ✅ Visual feedback with animations
- ✅ Audio feedback (placeholder files)
- ✅ Statistics dashboard with daily breakdown
- ✅ Color-coded statistics (green for potty, red for accidents)
- ✅ Responsive design
- ✅ Error handling and loading states

## File Structure
```
potty-buddy/
├── frontend/
│   ├── components/
│   │   ├── UserRegistration.tsx
│   │   ├── MainDashboard.tsx
│   │   ├── EventButton.tsx
│   │   └── Statistics.tsx
│   ├── lib/
│   │   └── api.ts
│   ├── pages/
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   └── index.tsx
│   ├── public/
│   │   └── sounds/
│   │       ├── success.mp3
│   │       └── accident.mp3
│   ├── styles/
│   │   └── globals.css
│   ├── package.json
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── tsconfig.json
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── routes/
│   │   │   ├── users.js
│   │   │   └── events.js
│   │   └── server.js
│   └── package.json
└── README.md
```

## Design Principles
- **Simplicity**: Clean, intuitive interface
- **Child-Friendly**: Bright colors, cartoon icons
- **Responsive**: Works on mobile and desktop
- **Fast**: Minimal loading times
- **Accessible**: Easy to use for busy parents

## Deployment Strategy

### Backend (Render)
1. **Create Web Service** on Render
2. **Connect GitHub repository**
3. **Configure environment variables**:
   - `DATABASE_URL`: PostgreSQL connection string
   - `NODE_ENV`: production
   - `FRONTEND_URL`: Frontend URL
4. **Add PostgreSQL database** via Render
5. **Deploy with automatic CI/CD**

### Frontend (Vercel)
1. **Connect GitHub repository** to Vercel
2. **Configure project settings**:
   - Framework: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
3. **Add environment variables**:
   - `NEXT_PUBLIC_API_URL`: Backend API URL
4. **Deploy with automatic CI/CD**

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://username:password@host:port/database
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Security Considerations
- ✅ Input validation for usernames
- ✅ Rate limiting on API endpoints
- ✅ CORS configuration
- ✅ SQL injection prevention
- ✅ Helmet security headers

## Local Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Quick Start
1. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create .env file with database URL
   npm run dev
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Future Enhancements
- Multiple children per user
- Export data functionality
- Customizable time periods for statistics
- Push notifications for reminders
- More detailed analytics and charts
- User preferences and settings
- Data backup and restore functionality

## Testing
- Manual testing completed for all core features
- API endpoints tested with Postman/curl
- Frontend components tested for responsiveness
- Error handling tested for various scenarios

## Performance Considerations
- Database queries optimized with proper indexing
- Frontend uses React hooks for efficient state management
- Images and sounds are optimized for web delivery
- Responsive design ensures good performance on mobile

## Monitoring and Logging
- Backend includes console logging for debugging
- API endpoints return appropriate HTTP status codes
- Frontend includes error boundaries and loading states
- Database queries are logged for performance monitoring 