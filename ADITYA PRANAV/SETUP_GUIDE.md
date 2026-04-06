# StockFolio - Complete Setup Guide

## 📦 Package Contents

This ZIP file contains the complete source code for StockFolio - Stock Portfolio Management System.

### Directory Structure:
```
stockfolio/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilities
│   │   ├── mock/           # Mock data for filters
│   │   ├── App.js          # Main app component
│   │   ├── App.css         # App styles
│   │   └── index.js        # Entry point
│   ├── public/
│   │   └── index.html      # HTML template
│   ├── package.json        # NPM dependencies
│   ├── tailwind.config.js  # Tailwind CSS config
│   ├── craco.config.js     # Create React App config
│   └── .env                # Frontend environment variables
│
├── backend/                # FastAPI backend application
│   ├── server.py           # Main FastAPI server
│   ├── database.py         # MySQL database connection
│   ├── models.py           # Pydantic data models
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Backend environment variables
│
├── README.md               # Project documentation
├── contracts.md            # API contracts and planning
└── SETUP_GUIDE.md          # This file
```

## 🚀 Quick Start Guide

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Yarn** package manager - `npm install -g yarn`
- **Python** (v3.11 or higher) - [Download](https://www.python.org/)
- **MySQL** or **MariaDB** (v10.11 or higher)

### Step 1: Extract the ZIP file

```bash
unzip stockfolio-complete-source.zip
cd stockfolio
```

### Step 2: Database Setup

#### Install MySQL/MariaDB

**On Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install mariadb-server mariadb-client
sudo service mariadb start
```

**On macOS (using Homebrew):**
```bash
brew install mysql
brew services start mysql
```

**On Windows:**
Download and install MySQL from [MySQL Downloads](https://dev.mysql.com/downloads/installer/)

#### Create Database and User

```bash
# Connect to MySQL
sudo mysql

# Or if you have a password
mysql -u root -p
```

Run these SQL commands:
```sql
CREATE DATABASE stock_portfolio;
CREATE USER 'stockuser'@'localhost' IDENTIFIED BY 'stockpass123';
GRANT ALL PRIVILEGES ON stock_portfolio.* TO 'stockuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

#### Configure Backend Environment

Edit `backend/.env` file (it's already configured, but you can modify if needed):
```env
MYSQL_HOST=localhost
MYSQL_USER=stockuser
MYSQL_PASSWORD=stockpass123
MYSQL_DATABASE=stock_portfolio
CORS_ORIGINS=*
```

#### Start Backend Server

```bash
# From backend directory
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

The backend will be available at: `http://localhost:8001`

#### Seed the Database

In a new terminal:
```bash
curl -X POST http://localhost:8001/api/stocks/seed
```

You should see: `{"message":"Stocks seeded successfully","count":20}`

### Step 4: Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
yarn install

# This might take a few minutes
```

#### Configure Frontend Environment

Edit `frontend/.env` file:
```env
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
```

**Important:** Change `REACT_APP_BACKEND_URL` to match your backend URL.

#### Start Frontend Development Server

```bash
# From frontend directory
yarn start
```

The frontend will be available at: `http://localhost:3000`

## 🎉 Access the Application

Open your browser and navigate to: **http://localhost:3000**

You should see the StockFolio application with:
- Stock exploration page
- Portfolio management
- Watchlist feature

## 📱 Using the Application

### Exploring Stocks
1. Browse stocks on the main page
2. Use filters to find stocks by sector
3. Search for specific stocks
4. Click quick filters (Top Gainers, Top Losers, etc.)

### Adding to Portfolio
1. Click "Add to Portfolio" on any stock card
2. Enter quantity, buy price, and buy date
3. Click "Add to Portfolio" to save
4. Navigate to Portfolio page to see your investments

### Managing Watchlist
1. Click the star icon on any stock card
2. Navigate to Watchlist page to see saved stocks
3. Remove stocks from watchlist as needed

## 🔧 Configuration

### Changing Database Credentials

If you want to use different database credentials:

1. Update `backend/.env`:
```env
MYSQL_HOST=your_host
MYSQL_USER=your_user
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=your_database
```

2. Update MySQL:
```sql
CREATE DATABASE your_database;
CREATE USER 'your_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON your_database.* TO 'your_user'@'localhost';
```

3. Restart backend server

### Changing Backend URL

If your backend runs on a different port or domain:

1. Update `frontend/.env`:
```env
REACT_APP_BACKEND_URL=http://your-backend-url:port
```

2. Restart frontend server

## 📊 API Documentation

Once the backend is running, you can access the interactive API documentation at:
- **Swagger UI:** http://localhost:8001/docs
- **ReDoc:** http://localhost:8001/redoc

## 🧪 Testing the API

You can test the API endpoints using curl:

### Get all stocks
```bash
curl http://localhost:8001/api/stocks
```

### Get stocks in IT sector
```bash
curl "http://localhost:8001/api/stocks?sector=IT"
```

### Add to portfolio
```bash
curl -X POST http://localhost:8001/api/portfolio \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "demo_user",
    "stock_symbol": "RELIANCE",
    "quantity": 10,
    "buy_price": 2800,
    "buy_date": "2025-01-01"
  }'
```

### Get portfolio
```bash
curl "http://localhost:8001/api/portfolio?user_id=demo_user"
```

## 🐛 Troubleshooting

### Database Connection Error

**Error:** `Can't connect to MySQL server`

**Solution:**
1. Ensure MySQL is running: `sudo service mysql status`
2. Check database credentials in `backend/.env`
3. Verify user has proper permissions

### Port Already in Use

**Error:** `Address already in use`

**Solution:**
- Backend: Change port in uvicorn command: `--port 8002`
- Frontend: Change port: `PORT=3001 yarn start`

### Module Not Found Errors

**Frontend:**
```bash
cd frontend
rm -rf node_modules
yarn install
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

### CORS Errors

If you see CORS errors in the browser console:
1. Ensure `CORS_ORIGINS=*` in `backend/.env`
2. Restart the backend server

## 🏗️ Building for Production

### Frontend Build

```bash
cd frontend
yarn build
```

This creates an optimized build in `frontend/build/` directory.

### Backend Production

For production, use a production ASGI server:

```bash
pip install gunicorn
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8001
```

## 📦 Deployment

### Deploying to Vercel (Frontend)

1. Install Vercel CLI: `npm i -g vercel`
2. From frontend directory: `vercel`
3. Follow the prompts

### Deploying to Railway/Heroku (Backend)

1. Create a `Procfile` in backend directory:
```
web: uvicorn server:app --host 0.0.0.0 --port $PORT
```

2. Deploy using their CLI or web interface

## 🔐 Security Notes

**Important for Production:**

1. **Change database passwords** in `.env` files
2. **Update CORS origins** to specific domains (not `*`)
3. **Add authentication** - current app uses demo user
4. **Use environment variables** - don't commit `.env` files
5. **Enable HTTPS** for production deployments
6. **Add rate limiting** to prevent API abuse

## 📚 Database Schema

The application uses 3 main tables:

### stocks
Stores stock information (symbol, price, sector, etc.)

### portfolios
Stores user stock holdings with buy price and quantity

### watchlist
Stores user's watched stocks

See `README.md` for complete schema details.

## 🆘 Support

For issues or questions:
1. Check the main `README.md` file
2. Review `contracts.md` for API details
3. Check the troubleshooting section above

## 📝 License

MIT License - Feel free to use and modify as needed.

## 🎯 Next Steps

After setup, you can:
1. Add real-time stock price updates using external APIs
2. Implement user authentication
3. Add charts and graphs
4. Create mobile apps using React Native
5. Add email notifications for price alerts

---

**Built with ❤️ using Emergent AI**

Enjoy using StockFolio! 🚀
