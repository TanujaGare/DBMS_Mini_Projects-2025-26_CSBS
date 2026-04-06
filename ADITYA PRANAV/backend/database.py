import aiomysql
import os
from dotenv import load_dotenv
import logging

load_dotenv()

logger = logging.getLogger(__name__)

# MySQL connection pool
pool = None

async def create_pool():
    global pool
    if pool is None:
        pool = await aiomysql.create_pool(
            host=os.environ.get('MYSQL_HOST', 'localhost'),
            port=3306,
            user=os.environ.get('MYSQL_USER', 'stockuser'),
            password=os.environ.get('MYSQL_PASSWORD', 'stockpass123'),
            db=os.environ.get('MYSQL_DATABASE', 'stock_portfolio'),
            minsize=1,
            maxsize=10,
            autocommit=True
        )
        logger.info("MySQL connection pool created")
    return pool

async def close_pool():
    global pool
    if pool:
        pool.close()
        await pool.wait_closed()
        logger.info("MySQL connection pool closed")

async def get_connection():
    global pool
    if pool is None:
        pool = await create_pool()
    return await pool.acquire()

async def init_db():
    """Initialize database tables"""
    pool = await create_pool()
    async with pool.acquire() as conn:
        async with conn.cursor() as cursor:
            # Create stocks table
            await cursor.execute("""
                CREATE TABLE IF NOT EXISTS stocks (
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
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_symbol (symbol),
                    INDEX idx_sector (sector)
                )
            """)
            
            # Create portfolios table
            await cursor.execute("""
                CREATE TABLE IF NOT EXISTS portfolios (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id VARCHAR(100) NOT NULL,
                    stock_symbol VARCHAR(20) NOT NULL,
                    quantity INT NOT NULL,
                    buy_price DECIMAL(10,2) NOT NULL,
                    buy_date DATE NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    INDEX idx_user_id (user_id),
                    INDEX idx_stock_symbol (stock_symbol),
                    FOREIGN KEY (stock_symbol) REFERENCES stocks(symbol) ON DELETE CASCADE
                )
            """)
            
            # Create watchlist table
            await cursor.execute("""
                CREATE TABLE IF NOT EXISTS watchlist (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id VARCHAR(100) NOT NULL,
                    stock_symbol VARCHAR(20) NOT NULL,
                    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE KEY unique_user_stock (user_id, stock_symbol),
                    INDEX idx_user_id (user_id),
                    FOREIGN KEY (stock_symbol) REFERENCES stocks(symbol) ON DELETE CASCADE
                )
            """)
            
            await conn.commit()
            logger.info("Database tables initialized")
