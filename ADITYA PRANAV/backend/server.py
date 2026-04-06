from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import date
import aiomysql

from database import init_db, create_pool, close_pool, get_connection
from models import (
    Stock, StockCreate, Portfolio, PortfolioCreate, PortfolioSummary,
    Watchlist, WatchlistCreate
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Startup and shutdown events
@app.on_event("startup")
async def startup_db():
    await create_pool()
    await init_db()
    logger.info("Database initialized")

@app.on_event("shutdown")
async def shutdown_db():
    await close_pool()
    logger.info("Database connection closed")

# ============= STOCK ENDPOINTS =============

@api_router.get("/")
async def root():
    return {"message": "Stock Portfolio Management API"}

@api_router.get("/stocks", response_model=List[Stock])
async def get_stocks(
    sector: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort: Optional[str] = "change_percent"
):
    """Get all stocks with optional filters"""
    pool = await create_pool()
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            query = "SELECT * FROM stocks WHERE 1=1"
            params = []
            
            if sector and sector != "All Sectors":
                query += " AND sector = %s"
                params.append(sector)
            
            if search:
                query += " AND (symbol LIKE %s OR name LIKE %s)"
                search_term = f"%{search}%"
                params.extend([search_term, search_term])
            
            if category:
                if category == "top-gainers":
                    query += " AND change_percent > 0"
                elif category == "top-losers":
                    query += " AND change_percent < 0"
            
            # Add sorting
            if sort == "change_percent":
                query += " ORDER BY ABS(change_percent) DESC"
            elif sort == "price":
                query += " ORDER BY current_price DESC"
            elif sort == "volume":
                query += " ORDER BY volume DESC"
            
            await cursor.execute(query, params)
            results = await cursor.fetchall()
            return results

@api_router.get("/stocks/{symbol}", response_model=Stock)
async def get_stock(symbol: str):
    """Get single stock details"""
    pool = await create_pool()
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            await cursor.execute("SELECT * FROM stocks WHERE symbol = %s", (symbol,))
            result = await cursor.fetchone()
            if not result:
                raise HTTPException(status_code=404, detail="Stock not found")
            return result

@api_router.post("/stocks/seed")
async def seed_stocks():
    """Seed database with initial stock data"""
    stocks_data = [
        {"symbol": "RELIANCE", "name": "Reliance Industries Ltd.", "current_price": 2847.65, "change_amount": 42.30, "change_percent": 1.51, "volume": "12.5M", "market_cap": "19.2L Cr", "pe_ratio": 28.45, "high_52_week": 3024.90, "low_52_week": 2220.30, "sector": "Energy"},
        {"symbol": "TCS", "name": "Tata Consultancy Services Ltd.", "current_price": 3842.15, "change_amount": -28.50, "change_percent": -0.74, "volume": "8.2M", "market_cap": "14.1L Cr", "pe_ratio": 32.12, "high_52_week": 4259.60, "low_52_week": 3311.00, "sector": "IT"},
        {"symbol": "HDFCBANK", "name": "HDFC Bank Ltd.", "current_price": 1678.25, "change_amount": 18.75, "change_percent": 1.13, "volume": "15.8M", "market_cap": "12.8L Cr", "pe_ratio": 19.85, "high_52_week": 1794.50, "low_52_week": 1363.55, "sector": "Banking"},
        {"symbol": "INFY", "name": "Infosys Ltd.", "current_price": 1523.40, "change_amount": 35.60, "change_percent": 2.39, "volume": "11.3M", "market_cap": "6.3L Cr", "pe_ratio": 27.33, "high_52_week": 1953.90, "low_52_week": 1351.65, "sector": "IT"},
        {"symbol": "ICICIBANK", "name": "ICICI Bank Ltd.", "current_price": 1089.50, "change_amount": -12.30, "change_percent": -1.12, "volume": "18.5M", "market_cap": "7.6L Cr", "pe_ratio": 18.92, "high_52_week": 1257.80, "low_52_week": 912.00, "sector": "Banking"},
        {"symbol": "HINDUNILVR", "name": "Hindustan Unilever Ltd.", "current_price": 2456.80, "change_amount": 24.90, "change_percent": 1.02, "volume": "5.2M", "market_cap": "5.8L Cr", "pe_ratio": 62.45, "high_52_week": 2816.00, "low_52_week": 2172.00, "sector": "FMCG"},
        {"symbol": "BHARTIARTL", "name": "Bharti Airtel Ltd.", "current_price": 1234.50, "change_amount": 45.20, "change_percent": 3.80, "volume": "14.7M", "market_cap": "7.3L Cr", "pe_ratio": 35.67, "high_52_week": 1389.00, "low_52_week": 872.35, "sector": "Telecom"},
        {"symbol": "ITC", "name": "ITC Ltd.", "current_price": 412.35, "change_amount": 5.85, "change_percent": 1.44, "volume": "22.1M", "market_cap": "5.1L Cr", "pe_ratio": 28.90, "high_52_week": 528.60, "low_52_week": 387.50, "sector": "FMCG"},
        {"symbol": "SBIN", "name": "State Bank of India", "current_price": 623.45, "change_amount": -8.90, "change_percent": -1.41, "volume": "25.3M", "market_cap": "5.6L Cr", "pe_ratio": 12.45, "high_52_week": 912.00, "low_52_week": 543.20, "sector": "Banking"},
        {"symbol": "WIPRO", "name": "Wipro Ltd.", "current_price": 289.60, "change_amount": 12.40, "change_percent": 4.47, "volume": "16.8M", "market_cap": "1.6L Cr", "pe_ratio": 24.18, "high_52_week": 579.90, "low_52_week": 267.25, "sector": "IT"},
        {"symbol": "LT", "name": "Larsen & Toubro Ltd.", "current_price": 3542.80, "change_amount": 28.45, "change_percent": 0.81, "volume": "7.4M", "market_cap": "4.9L Cr", "pe_ratio": 31.25, "high_52_week": 4069.95, "low_52_week": 3001.70, "sector": "Construction"},
        {"symbol": "ASIANPAINT", "name": "Asian Paints Ltd.", "current_price": 2834.50, "change_amount": -15.30, "change_percent": -0.54, "volume": "3.9M", "market_cap": "2.7L Cr", "pe_ratio": 54.67, "high_52_week": 3422.50, "low_52_week": 2670.05, "sector": "Consumer Goods"},
        {"symbol": "TATAMOTORS", "name": "Tata Motors Ltd.", "current_price": 765.30, "change_amount": 52.80, "change_percent": 7.41, "volume": "28.5M", "market_cap": "2.8L Cr", "pe_ratio": 15.78, "high_52_week": 1179.00, "low_52_week": 598.40, "sector": "Automobile"},
        {"symbol": "MARUTI", "name": "Maruti Suzuki India Ltd.", "current_price": 11245.60, "change_amount": 98.40, "change_percent": 0.88, "volume": "1.2M", "market_cap": "3.4L Cr", "pe_ratio": 28.93, "high_52_week": 13680.00, "low_52_week": 9737.65, "sector": "Automobile"},
        {"symbol": "SUNPHARMA", "name": "Sun Pharmaceutical Industries Ltd.", "current_price": 1456.75, "change_amount": -6.25, "change_percent": -0.43, "volume": "6.7M", "market_cap": "3.5L Cr", "pe_ratio": 38.42, "high_52_week": 1954.40, "low_52_week": 1139.00, "sector": "Pharma"},
        {"symbol": "NTPC", "name": "NTPC Ltd.", "current_price": 298.45, "change_amount": 8.90, "change_percent": 3.07, "volume": "19.3M", "market_cap": "2.9L Cr", "pe_ratio": 16.34, "high_52_week": 448.45, "low_52_week": 267.55, "sector": "Energy"},
        {"symbol": "AXISBANK", "name": "Axis Bank Ltd.", "current_price": 1034.20, "change_amount": 18.65, "change_percent": 1.84, "volume": "12.4M", "market_cap": "3.2L Cr", "pe_ratio": 13.56, "high_52_week": 1339.65, "low_52_week": 912.70, "sector": "Banking"},
        {"symbol": "BAJFINANCE", "name": "Bajaj Finance Ltd.", "current_price": 6734.50, "change_amount": -42.80, "change_percent": -0.63, "volume": "4.1M", "market_cap": "4.1L Cr", "pe_ratio": 32.89, "high_52_week": 8192.20, "low_52_week": 6187.80, "sector": "Finance"},
        {"symbol": "ULTRACEMCO", "name": "UltraTech Cement Ltd.", "current_price": 8945.30, "change_amount": 125.70, "change_percent": 1.43, "volume": "2.8M", "market_cap": "2.6L Cr", "pe_ratio": 42.15, "high_52_week": 11438.80, "low_52_week": 7989.35, "sector": "Cement"},
        {"symbol": "ADANIPORTS", "name": "Adani Ports and Special Economic Zone Ltd.", "current_price": 1189.65, "change_amount": -23.40, "change_percent": -1.93, "volume": "9.2M", "market_cap": "2.4L Cr", "pe_ratio": 29.67, "high_52_week": 1621.40, "low_52_week": 879.30, "sector": "Infrastructure"}
    ]
    
    pool = await create_pool()
    async with pool.acquire() as conn:
        async with conn.cursor() as cursor:
            for stock in stocks_data:
                await cursor.execute("""
                    INSERT INTO stocks (symbol, name, sector, current_price, change_amount, 
                                      change_percent, volume, market_cap, pe_ratio, 
                                      high_52_week, low_52_week)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON DUPLICATE KEY UPDATE
                    current_price = VALUES(current_price),
                    change_amount = VALUES(change_amount),
                    change_percent = VALUES(change_percent)
                """, (
                    stock['symbol'], stock['name'], stock['sector'],
                    stock['current_price'], stock['change_amount'], stock['change_percent'],
                    stock['volume'], stock['market_cap'], stock['pe_ratio'],
                    stock['high_52_week'], stock['low_52_week']
                ))
            await conn.commit()
    
    return {"message": "Stocks seeded successfully", "count": len(stocks_data)}

# ============= PORTFOLIO ENDPOINTS =============

@api_router.get("/portfolio", response_model=List[Portfolio])
async def get_portfolio(user_id: str = Query(...)):
    """Get user's portfolio"""
    pool = await create_pool()
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            await cursor.execute("""
                SELECT p.*, s.name as stock_name, s.current_price, s.sector,
                       (p.quantity * s.current_price) as current_value,
                       ((s.current_price - p.buy_price) * p.quantity) as profit_loss,
                       (((s.current_price - p.buy_price) / p.buy_price) * 100) as profit_loss_percent
                FROM portfolios p
                JOIN stocks s ON p.stock_symbol = s.symbol
                WHERE p.user_id = %s
                ORDER BY p.created_at DESC
            """, (user_id,))
            results = await cursor.fetchall()
            return results

@api_router.post("/portfolio", response_model=Portfolio)
async def add_to_portfolio(portfolio: PortfolioCreate):
    """Add stock to portfolio"""
    pool = await create_pool()
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            # Check if stock exists
            await cursor.execute("SELECT symbol FROM stocks WHERE symbol = %s", (portfolio.stock_symbol,))
            if not await cursor.fetchone():
                raise HTTPException(status_code=404, detail="Stock not found")
            
            await cursor.execute("""
                INSERT INTO portfolios (user_id, stock_symbol, quantity, buy_price, buy_date)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                portfolio.user_id, portfolio.stock_symbol, portfolio.quantity,
                portfolio.buy_price, portfolio.buy_date
            ))
            await conn.commit()
            
            portfolio_id = cursor.lastrowid
            
            # Fetch the created portfolio with stock details
            await cursor.execute("""
                SELECT p.*, s.name as stock_name, s.current_price, s.sector,
                       (p.quantity * s.current_price) as current_value,
                       ((s.current_price - p.buy_price) * p.quantity) as profit_loss,
                       (((s.current_price - p.buy_price) / p.buy_price) * 100) as profit_loss_percent
                FROM portfolios p
                JOIN stocks s ON p.stock_symbol = s.symbol
                WHERE p.id = %s
            """, (portfolio_id,))
            result = await cursor.fetchone()
            return result

@api_router.delete("/portfolio/{portfolio_id}")
async def remove_from_portfolio(portfolio_id: int):
    """Remove stock from portfolio"""
    pool = await create_pool()
    async with pool.acquire() as conn:
        async with conn.cursor() as cursor:
            await cursor.execute("DELETE FROM portfolios WHERE id = %s", (portfolio_id,))
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Portfolio item not found")
            await conn.commit()
    return {"message": "Removed from portfolio successfully"}

@api_router.get("/portfolio/summary", response_model=PortfolioSummary)
async def get_portfolio_summary(user_id: str = Query(...)):
    """Get portfolio summary"""
    pool = await create_pool()
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            await cursor.execute("""
                SELECT 
                    COUNT(DISTINCT p.stock_symbol) as total_stocks,
                    SUM(p.quantity * p.buy_price) as total_investment,
                    SUM(p.quantity * s.current_price) as current_value,
                    SUM((s.current_price - p.buy_price) * p.quantity) as total_profit_loss
                FROM portfolios p
                JOIN stocks s ON p.stock_symbol = s.symbol
                WHERE p.user_id = %s
            """, (user_id,))
            result = await cursor.fetchone()
            
            if not result or result['total_investment'] is None:
                return PortfolioSummary(
                    total_investment=0,
                    current_value=0,
                    total_profit_loss=0,
                    profit_loss_percent=0,
                    total_stocks=0
                )
            
            profit_loss_percent = 0
            if result['total_investment'] > 0:
                profit_loss_percent = (result['total_profit_loss'] / result['total_investment']) * 100
            
            return PortfolioSummary(
                total_investment=float(result['total_investment']),
                current_value=float(result['current_value']),
                total_profit_loss=float(result['total_profit_loss']),
                profit_loss_percent=profit_loss_percent,
                total_stocks=result['total_stocks']
            )

# ============= WATCHLIST ENDPOINTS =============

@api_router.get("/watchlist", response_model=List[Watchlist])
async def get_watchlist(user_id: str = Query(...)):
    """Get user's watchlist"""
    pool = await create_pool()
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            await cursor.execute("""
                SELECT w.*, s.name as stock_name, s.current_price, s.change_percent, s.sector
                FROM watchlist w
                JOIN stocks s ON w.stock_symbol = s.symbol
                WHERE w.user_id = %s
                ORDER BY w.added_at DESC
            """, (user_id,))
            results = await cursor.fetchall()
            return results

@api_router.post("/watchlist", response_model=Watchlist)
async def add_to_watchlist(watchlist: WatchlistCreate):
    """Add stock to watchlist"""
    pool = await create_pool()
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            # Check if stock exists
            await cursor.execute("SELECT symbol FROM stocks WHERE symbol = %s", (watchlist.stock_symbol,))
            if not await cursor.fetchone():
                raise HTTPException(status_code=404, detail="Stock not found")
            
            try:
                await cursor.execute("""
                    INSERT INTO watchlist (user_id, stock_symbol)
                    VALUES (%s, %s)
                """, (watchlist.user_id, watchlist.stock_symbol))
                await conn.commit()
                
                watchlist_id = cursor.lastrowid
                
                # Fetch the created watchlist with stock details
                await cursor.execute("""
                    SELECT w.*, s.name as stock_name, s.current_price, s.change_percent, s.sector
                    FROM watchlist w
                    JOIN stocks s ON w.stock_symbol = s.symbol
                    WHERE w.id = %s
                """, (watchlist_id,))
                result = await cursor.fetchone()
                return result
            except Exception as e:
                if "Duplicate entry" in str(e):
                    raise HTTPException(status_code=400, detail="Stock already in watchlist")
                raise

@api_router.delete("/watchlist/{watchlist_id}")
async def remove_from_watchlist(watchlist_id: int):
    """Remove from watchlist"""
    pool = await create_pool()
    async with pool.acquire() as conn:
        async with conn.cursor() as cursor:
            await cursor.execute("DELETE FROM watchlist WHERE id = %s", (watchlist_id,))
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Watchlist item not found")
            await conn.commit()
    return {"message": "Removed from watchlist successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
