from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime

class Stock(BaseModel):
    id: Optional[int] = None
    symbol: str
    name: str
    sector: Optional[str] = None
    current_price: float
    change_amount: float
    change_percent: float
    volume: str
    market_cap: str
    pe_ratio: float
    high_52_week: float
    low_52_week: float
    updated_at: Optional[datetime] = None

class StockCreate(BaseModel):
    symbol: str
    name: str
    sector: Optional[str] = None
    current_price: float
    change_amount: float
    change_percent: float
    volume: str
    market_cap: str
    pe_ratio: float
    high_52_week: float
    low_52_week: float

class Portfolio(BaseModel):
    id: Optional[int] = None
    user_id: str
    stock_symbol: str
    quantity: int
    buy_price: float
    buy_date: date
    created_at: Optional[datetime] = None
    
    # Additional computed fields
    stock_name: Optional[str] = None
    current_price: Optional[float] = None
    sector: Optional[str] = None
    current_value: Optional[float] = None
    profit_loss: Optional[float] = None
    profit_loss_percent: Optional[float] = None

class PortfolioCreate(BaseModel):
    user_id: str
    stock_symbol: str
    quantity: int
    buy_price: float
    buy_date: date

class PortfolioSummary(BaseModel):
    total_investment: float
    current_value: float
    total_profit_loss: float
    profit_loss_percent: float
    total_stocks: int

class Watchlist(BaseModel):
    id: Optional[int] = None
    user_id: str
    stock_symbol: str
    added_at: Optional[datetime] = None
    
    # Additional fields from joined stock data
    stock_name: Optional[str] = None
    current_price: Optional[float] = None
    change_percent: Optional[float] = None
    sector: Optional[str] = None

class WatchlistCreate(BaseModel):
    user_id: str
    stock_symbol: str
