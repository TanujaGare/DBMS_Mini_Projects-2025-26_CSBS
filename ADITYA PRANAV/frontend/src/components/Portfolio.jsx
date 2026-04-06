import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown, Trash2, Briefcase, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPortfolio();
    fetchSummary();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/portfolio?user_id=demo_user`);
      setPortfolio(response.data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch portfolio',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await axios.get(`${API}/portfolio/summary?user_id=demo_user`);
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const handleRemove = async (id) => {
    try {
      await axios.delete(`${API}/portfolio/${id}`);
      toast({
        title: 'Success',
        description: 'Stock removed from portfolio',
      });
      fetchPortfolio();
      fetchSummary();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove stock',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f10]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f0f10] border-b border-gray-800">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D09C] to-[#00B386] flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-white text-2xl font-semibold">StockFolio</span>
              </div>
              <nav className="hidden md:flex items-center gap-6">
                <a href="/" className="text-gray-400 hover:text-white transition-colors duration-200">Explore</a>
                <a href="/portfolio" className="text-white font-medium">Portfolio</a>
                <a href="/watchlist" className="text-gray-400 hover:text-white transition-colors duration-200">Watchlist</a>
              </nav>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center cursor-pointer">
              <span className="text-white text-sm font-medium">U</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="mb-6">
          <Button
            onClick={() => window.location.href = '/'}
            variant="ghost"
            className="text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Explore
          </Button>
          <h1 className="text-3xl font-bold text-white mb-2">My Portfolio</h1>
          <p className="text-gray-400">Track your stock investments and performance</p>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#1a1a1b] border border-gray-800 rounded-xl p-5">
              <p className="text-gray-400 text-sm mb-2">Total Investment</p>
              <p className="text-white text-2xl font-bold">
                ₹{summary.total_investment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-[#1a1a1b] border border-gray-800 rounded-xl p-5">
              <p className="text-gray-400 text-sm mb-2">Current Value</p>
              <p className="text-white text-2xl font-bold">
                ₹{summary.current_value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-[#1a1a1b] border border-gray-800 rounded-xl p-5">
              <p className="text-gray-400 text-sm mb-2">Total P&L</p>
              <p className={`text-2xl font-bold ${
                summary.total_profit_loss >= 0 ? 'text-[#00D09C]' : 'text-red-500'
              }`}>
                {summary.total_profit_loss >= 0 ? '+' : ''}₹{Math.abs(summary.total_profit_loss).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-[#1a1a1b] border border-gray-800 rounded-xl p-5">
              <p className="text-gray-400 text-sm mb-2">P&L %</p>
              <div className="flex items-center gap-2">
                {summary.profit_loss_percent >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-[#00D09C]" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-500" />
                )}
                <p className={`text-2xl font-bold ${
                  summary.profit_loss_percent >= 0 ? 'text-[#00D09C]' : 'text-red-500'
                }`}>
                  {summary.profit_loss_percent >= 0 ? '+' : ''}{summary.profit_loss_percent.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Table */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#00D09C] border-r-transparent"></div>
            <p className="text-gray-400 mt-4">Loading portfolio...</p>
          </div>
        ) : portfolio.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-[#1a1a1b] rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No stocks in portfolio</h3>
            <p className="text-gray-400 mb-4">Start adding stocks to track your investments</p>
            <Button
              onClick={() => window.location.href = '/'}
              className="bg-[#00D09C] hover:bg-[#00B386] text-white"
            >
              Explore Stocks
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {portfolio.map((item) => (
              <div
                key={item.id}
                className="bg-[#1a1a1b] border border-gray-800 rounded-xl p-5 hover:border-[#00D09C] transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-semibold text-lg">{item.stock_symbol}</h3>
                      <Badge variant="secondary" className="bg-[#252526] text-gray-300 border-gray-700 text-xs">
                        {item.sector}
                      </Badge>
                    </div>
                    <p className="text-gray-500 text-sm">{item.stock_name}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 flex-1">
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Quantity</p>
                      <p className="text-white font-medium">{item.quantity}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Buy Price</p>
                      <p className="text-white font-medium">₹{Number(item.buy_price).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Current Price</p>
                      <p className="text-white font-medium">₹{Number(item.current_price).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Current Value</p>
                      <p className="text-white font-medium">₹{Number(item.current_value).toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">P&L</p>
                      <p className={`font-bold ${
                        item.profit_loss >= 0 ? 'text-[#00D09C]' : 'text-red-500'
                      }`}>
                        {item.profit_loss >= 0 ? '+' : ''}₹{Math.abs(Number(item.profit_loss)).toFixed(2)}
                        <span className="text-xs ml-1">
                          ({item.profit_loss_percent >= 0 ? '+' : ''}{Number(item.profit_loss_percent).toFixed(2)}%)
                        </span>
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleRemove(item.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
