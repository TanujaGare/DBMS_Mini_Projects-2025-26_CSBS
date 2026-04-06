# Stock Portfolio Management - API Contracts & Implementation Plan

## Overview
Transform the stock exploration app into a full-featured Stock Portfolio Management system with MySQL database.

## Database Schema (MySQL)

### 1. stocks table
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- symbol (VARCHAR(20), UNIQUE)
- name (VARCHAR(255))
- sector (VARCHAR(100))
- current_price (DECIMAL(10,2))
- change_amount (DECIMAL(10,2))
- change_percent (DECIMAL(5,2))
- volume (VARCHAR(20))
- market_cap (VARCHAR(20))
- pe_ratio (DECIMAL(8,2))
- high_52_week (DECIMAL(10,2))
- low_52_week (DECIMAL(10,2))
- updated_at (TIMESTAMP)

### 2. portfolios table
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- user_id (VARCHAR(100))
- stock_symbol (VARCHAR(20), FOREIGN KEY -> stocks.symbol)
- quantity (INT)
- buy_price (DECIMAL(10,2))
- buy_date (DATE)
- created_at (TIMESTAMP)

### 3. watchlist table
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- user_id (VARCHAR(100))
- stock_symbol (VARCHAR(20), FOREIGN KEY -> stocks.symbol)
- added_at (TIMESTAMP)

## API Endpoints

### Stock APIs
1. **GET /api/stocks** - Get all stocks with filters
   - Query params: sector, category (top-gainers, top-losers, etc.), search, sort
   - Response: List of stocks

2. **GET /api/stocks/{symbol}** - Get single stock details
   - Response: Stock details

3. **POST /api/stocks/seed** - Seed database with initial stock data
   - Response: Success message

### Portfolio APIs
4. **GET /api/portfolio** - Get user's portfolio
   - Query params: user_id
   - Response: List of portfolio items with current value, profit/loss

5. **POST /api/portfolio** - Add stock to portfolio
   - Body: { user_id, stock_symbol, quantity, buy_price, buy_date }
   - Response: Created portfolio item

6. **DELETE /api/portfolio/{id}** - Remove stock from portfolio
   - Response: Success message

7. **GET /api/portfolio/summary** - Get portfolio summary
   - Query params: user_id
   - Response: { total_investment, current_value, total_profit_loss, profit_loss_percent }

### Watchlist APIs
8. **GET /api/watchlist** - Get user's watchlist
   - Query params: user_id
   - Response: List of watched stocks

9. **POST /api/watchlist** - Add stock to watchlist
   - Body: { user_id, stock_symbol }
   - Response: Created watchlist item

10. **DELETE /api/watchlist/{id}** - Remove from watchlist
    - Response: Success message

## Frontend Changes

### Components to Update
1. **StockExplore.jsx** - Add "Add to Portfolio" and "Add to Watchlist" buttons
2. **Portfolio.jsx** (NEW) - Display user's portfolio with P&L
3. **PortfolioSummary.jsx** (NEW) - Show portfolio summary cards
4. **AddToPortfolioModal.jsx** (NEW) - Modal to add stock to portfolio

### Mock Data Migration
- Remove /app/frontend/src/mock/stockData.js usage
- Replace with API calls to backend
- Add loading states and error handling

### New Routes
- / - Stock Exploration (existing)
- /portfolio - User's Portfolio (NEW)
- /watchlist - User's Watchlist (NEW)

## Integration Steps

1. Set up MySQL database and create tables
2. Install MySQL connector in backend (mysql-connector-python or aiomysql)
3. Create database models and connection
4. Implement all API endpoints
5. Test APIs with curl/Postman
6. Update frontend to call APIs instead of using mock data
7. Add portfolio and watchlist features to frontend
8. Test complete flow
9. Create zip file with all code

## Mock vs Real Data
- Currently: All stock data is mocked in stockData.js
- After implementation: Stock data will be fetched from MySQL database
- Portfolio and watchlist will be stored in MySQL and persisted
