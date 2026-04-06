import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, Trash2, TrendingUp, TrendingDown, Briefcase, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/watchlist?user_id=demo_user`);
      setWatchlist(response.data);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch watchlist',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await axios.delete(`${API}/watchlist/${id}`);
      toast({
        title: 'Success',
        description: 'Stock removed from watchlist',
      });
      fetchWatchlist();
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
                <a href="/portfolio" className="text-gray-400 hover:text-white transition-colors duration-200">Portfolio</a>
                <a href="/watchlist" className="text-white font-medium">Watchlist</a>
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
          <h1 className="text-3xl font-bold text-white mb-2">My Watchlist</h1>
          <p className="text-gray-400">Keep track of stocks you're interested in</p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#00D09C] border-r-transparent"></div>
            <p className="text-gray-400 mt-4">Loading watchlist...</p>
          </div>
        ) : watchlist.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-[#1a1a1b] rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No stocks in watchlist</h3>
            <p className="text-gray-400 mb-4">Start adding stocks you're interested in</p>
            <Button
              onClick={() => window.location.href = '/'}
              className="bg-[#00D09C] hover:bg-[#00B386] text-white"
            >
              Explore Stocks
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {watchlist.map((item) => (
              <div
                key={item.id}
                className="bg-[#1a1a1b] border border-gray-800 rounded-xl p-5 hover:border-[#00D09C] transition-all duration-300 hover:shadow-lg hover:shadow-[#00D09C]/10"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-semibold text-lg">{item.stock_symbol}</h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-1">{item.stock_name}</p>
                  </div>
                  <Badge variant="secondary" className="bg-[#252526] text-gray-300 border-gray-700 text-xs">
                    {item.sector}
                  </Badge>
                </div>

                <div className="mb-4">
                  <div className="text-2xl font-bold text-white mb-1">
                    ₹{Number(item.current_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="flex items-center gap-2">
                    {item.change_percent >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-[#00D09C]" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        item.change_percent >= 0 ? 'text-[#00D09C]' : 'text-red-500'
                      }`}
                    >
                      {item.change_percent >= 0 ? '+' : ''}{Number(item.change_percent).toFixed(2)}%
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => handleRemove(item.id)}
                  variant="outline"
                  className="w-full border-red-500/30 text-red-500 hover:bg-red-500/10 hover:border-red-500 transition-colors duration-200"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove from Watchlist
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
