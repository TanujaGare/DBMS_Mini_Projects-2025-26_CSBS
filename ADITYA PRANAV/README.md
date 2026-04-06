# StockFolio - Stock Portfolio Management System

A complete full-stack stock portfolio management application built with React, FastAPI, and MySQL.

## Features

### 🔍 Stock Exploration
- Browse 20+ Indian stocks with real-time data
- Filter by sector (IT, Banking, Energy, FMCG, etc.)
- Sort by price, volume, or % change
- Search stocks by symbol or name
- Quick filter categories: Top Gainers, Top Losers, Most Active, 52 Week High/Low

### 💼 Portfolio Management
- Add stocks to your portfolio with quantity, buy price, and buy date
- Real-time profit/loss calculation
- Portfolio summary with total investment, current value, and P&L %
- Track individual stock performance
- Remove stocks from portfolio

### ⭐ Watchlist
- Save stocks you're interested in
- Quick access to stock prices and changes
- Easy watchlist management

## Technology Stack

### Frontend
- **React 19** - UI library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **FastAPI** - Python web framework
- **aiomysql** - Async MySQL connector
- **Pydantic** - Data validation
- **Python 3.11+**

### Database
- **MySQL/MariaDB** - Relational database

## Project Structure

```
/app
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/               # shadcn components
│   │   │   ├── StockExplore.jsx  # Main stock exploration page
│   │   │   ├── Portfolio.jsx     # Portfolio management
│   │   │   ├── Watchlist.jsx     # Watchlist page
│   │   │   └── AddToPortfolioModal.jsx
│   │   ├── hooks/
│   │   │   └── use-toast.js
│   │   ├── mock/
│   │   │   └── stockData.js      # Static filter/sector data
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── .env
│
└── backend/
    ├── server.py        # Main FastAPI application
    ├── database.py      # MySQL connection and initialization
    ├── models.py        # Pydantic models
    ├── requirements.txt
    └── .env

```

## Database Schema

### stocks
```sql
CREATE TABLE stocks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    symbol VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    sector VARCHAR(100),
    current_price DECIMAL(10,2),
    change_amount DECIMAL(10,2),
    change_percent DECIMAL(5,2),
    volume VARCHAR(20),
    market_cap VARCHAR(20),
    pe_ratio DECIMAL(8,2),
    high_52_week DECIMAL(10,2),
    low_52_week DECIMAL(10,2),
    updated_at TIMESTAMP
);
```

### portfolios
```sql
CREATE TABLE portfolios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    stock_symbol VARCHAR(20) NOT NULL,
    quantity INT NOT NULL,
    buy_price DECIMAL(10,2) NOT NULL,
    buy_date DATE NOT NULL,
    created_at TIMESTAMP,
    FOREIGN KEY (stock_symbol) REFERENCES stocks(symbol)
);
```

### watchlist
```sql
CREATE TABLE watchlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    stock_symbol VARCHAR(20) NOT NULL,
    added_at TIMESTAMP,
    UNIQUE KEY unique_user_stock (user_id, stock_symbol),
    FOREIGN KEY (stock_symbol) REFERENCES stocks(symbol)
);
```

## API Endpoints

### Stock APIs
- `GET /api/stocks` - Get all stocks with optional filters
  - Query params: `sector`, `category`, `search`, `sort`
- `GET /api/stocks/{symbol}` - Get single stock details
- `POST /api/stocks/seed` - Seed database with initial stock data

### Portfolio APIs
- `GET /api/portfolio?user_id={user_id}` - Get user's portfolio
- `POST /api/portfolio` - Add stock to portfolio
- `DELETE /api/portfolio/{id}` - Remove from portfolio
- `GET /api/portfolio/summary?user_id={user_id}` - Get portfolio summary

### Watchlist APIs
- `GET /api/watchlist?user_id={user_id}` - Get user's watchlist
- `POST /api/watchlist` - Add to watchlist
- `DELETE /api/watchlist/{id}` - Remove from watchlist

## Setup Instructions

### Prerequisites
- Node.js 18+ and Yarn
- Python 3.11+
- MySQL/MariaDB 10.11+

### Backend Setup

1. Install MySQL/MariaDB:
```bash
sudo apt-get install mariadb-server mariadb-client
sudo service mariadb start
```

2. Create database and user:
```bash
sudo mysql -e "CREATE DATABASE stock_portfolio;"
sudo mysql -e "CREATE USER 'stockuser'@'localhost' IDENTIFIED BY 'stockpass123';"
sudo mysql -e "GRANT ALL PRIVILEGES ON stock_portfolio.* TO 'stockuser'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"
```

3. Install Python dependencies:
```bash
cd backend
pip install -r requirements.txt
```

4. Configure environment variables in `/app/backend/.env`:
```
MYSQL_HOST=localhost
MYSQL_USER=stockuser
MYSQL_PASSWORD=stockpass123
MYSQL_DATABASE=stock_portfolio
CORS_ORIGINS=*
```

5. Start the backend server:
```bash
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

6. Seed the database:
```bash
curl -X POST http://localhost:8001/api/stocks/seed
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
yarn install
```

2. Configure environment variables in `/app/frontend/.env`:
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

3. Start the development server:
```bash
yarn start
```

The application will be available at `http://localhost:3000`

## Environment Variables

### Backend (.env)
```
MYSQL_HOST=localhost
MYSQL_USER=stockuser
MYSQL_PASSWORD=stockpass123
MYSQL_DATABASE=stock_portfolio
CORS_ORIGINS=*
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

## Default User

The app uses a demo user ID: `demo_user`

In a production environment, you would integrate proper authentication and use real user IDs.

## Features Highlight

### Real-time P&L Calculation
The portfolio automatically calculates:
- Current value of holdings
- Profit/Loss amount
- Profit/Loss percentage
- Total portfolio performance

### Responsive Design
- Mobile-friendly interface
- Adaptive grid layouts
- Touch-optimized interactions

### Modern UI/UX
- Dark theme with teal accent color
- Smooth animations and transitions
- Hover effects and micro-interactions
- Loading states and empty states

## Stock Data

The app includes 20 major Indian stocks:
- Reliance Industries
- TCS, Infosys, Wipro
- HDFC Bank, ICICI Bank, Axis Bank, SBI
- Bharti Airtel, ITC
- Tata Motors, Maruti Suzuki
- And more...

## Future Enhancements

- User authentication system
- Real-time stock price updates via APIs
- Charts and graphs for portfolio performance
- Stock price alerts
- Transaction history
- Export portfolio to CSV/PDF
- Multiple portfolio support
- Stock recommendations

## License

MIT License

## Author

Built with Emergent AI Agent

## Support

For issues and questions, please contact support.
