# Potty Buddy 🚽

A simple web application to help parents track their child's potty training progress. Users can log whether their child had an accident ("dirty pants") or successfully used the potty.

## Features

- **Simple User Registration**: No passwords required, just enter a username
- **Event Logging**: Two main events - "Dirty Pants" and "Potty"
- **Visual & Audio Feedback**: Cartoon icons, pictures, and sounds when buttons are clicked
- **Statistics Dashboard**: 14-day history of events with counts
- **Responsive Design**: Works on mobile and desktop
- **Child-Friendly Interface**: Bright colors and intuitive design

## Tech Stack

### Frontend (Vercel Deployment)
- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React hooks

### Backend (Render Deployment)
- **Framework**: Node.js with Express
- **Database**: PostgreSQL
- **Security**: Helmet, CORS, Rate limiting

## Project Structure

```
potty-buddy/
├── frontend/                 # Next.js frontend application
│   ├── components/          # React components
│   ├── lib/                # API client and utilities
│   ├── pages/              # Next.js pages
│   ├── public/             # Static assets (sounds, images)
│   └── styles/             # Global styles
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── routes/         # API routes
│   │   └── server.js       # Main server file
│   └── package.json
└── README.md
```

## Local Development Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/potty_buddy
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

The backend will be available at `http://localhost:3001`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## Database Setup

The application uses PostgreSQL with the following schema:

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

The tables will be created automatically when the backend starts.

## API Endpoints

### Users
- `GET /api/users/:username` - Check if username exists
- `POST /api/users` - Create new user

### Events
- `POST /api/events` - Log new event
- `GET /api/events/:userId` - Get user's events for statistics

## Deployment

### Backend Deployment (Render)

1. **Create a new Web Service on Render**
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `NODE_ENV`: `production`
     - `FRONTEND_URL`: Your frontend URL

4. **Add PostgreSQL database:**
   - Create a new PostgreSQL database on Render
   - Add the `DATABASE_URL` environment variable

### Frontend Deployment (Vercel)

1. **Connect your GitHub repository to Vercel**
2. **Configure the project:**
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

3. **Add environment variables:**
   - `NEXT_PUBLIC_API_URL`: Your backend API URL

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

## Features in Detail

### User Registration
- Simple username-based registration
- No password required
- Username uniqueness validation
- Immediate feedback for existing usernames

### Event Logging
- Two main event types: "Dirty Pants" and "Potty"
- Large, colorful buttons with cartoon icons
- Audio feedback when buttons are clicked
- Visual feedback with animations
- Events are logged with exact timestamps

### Statistics Dashboard
- 14-day history view
- Summary cards showing total counts
- Daily breakdown of events
- Color-coded statistics (green for potty, red for accidents)
- Responsive design for mobile and desktop

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support or questions, please open an issue on GitHub.

---

**Note**: The sound files in `/frontend/public/sounds/` are placeholders. In a production environment, you should replace them with actual MP3 files for better user experience. # potty_buddy_webapp
# potty_buddy_webapp
