# Placement Management System

A full-stack web application for managing college/university placement drives. Built with React + Vite frontend and Node.js + Express backend.

## Tech Stack

- **Frontend**: React 19 + Vite
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas
- **Auth**: JWT + bcrypt
- **Styling**: Neobrutalism CSS

## Features

### Student Features
- Register/Login
- Browse placement drives
- Apply to drives (CGPA eligibility check)
- Track application status

### Admin Features
- Dashboard with stats
- Manage companies
- Manage placement drives
- View & update applicant status

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account

### Installation

```bash
# Clone the repository
git clone https://github.com/tarun-karn/Placement-Management-System.git
cd Placement-Management-System

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install

# Create .env files (see .env.example)
```

### Environment Variables

**Server (server/.env)**
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

**Client (client/.env)**
```
VITE_API_URL=/api
```

### Running Locally

```bash
# Terminal 1 - Start server
cd server
npm run dev

# Terminal 2 - Start client
cd client
npm run dev
```

## API Endpoints

- `POST /api/auth/register` - Student registration
- `POST /api/auth/login` - Login
- `GET /api/drives` - List drives
- `POST /api/applications` - Apply to drive
- And more...

## License

MIT
