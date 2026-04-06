import React, { useState, useEffect, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, Plus, Star, Briefcase } from 'lucide-react';
import axios from 'axios';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useToast } from '../hooks/use-toast';
import AddToPortfolioModal from './AddToPortfolioModal';
import { filterCategories, sectors } from '../mock/stockData';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const StockExplore = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [sortBy, setSortBy] = useState('change_percent');
  const [selectedStock, setSelectedStock] = useState(null);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchStocks();
  }, [selectedCategory, selectedSector, sortBy, searchQuery]);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedSector !== 'All Sectors') params.append('sector', selectedSector);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      if (sortBy) params.append('sort', sortBy);

      const response = await axios.get(`${API}/stocks?${params.toString()}`);
      setStocks(response.data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch stocks',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPortfolio = (stock) => {
    setSelectedStock(stock);
    setShowPortfolioModal(true);
  };

  const handleAddToWatchlist = async (stock) => {
    try {
      await axios.post(`${API}/watchlist`, {
        user_id: 'demo_user',
        stock_symbol: stock.symbol,
      });
      toast({
        title: 'Success',
        description: `${stock.symbol} added to watchlist`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to add to watchlist',
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
                <a href="/" className="text-white font-medium">Explore</a>
                <a href="/portfolio" className="text-gray-400 hover:text-white transition-colors duration-200">Portfolio</a>
                <a href="/watchlist" className="text-gray-400 hover:text-white transition-colors duration-200">Watchlist</a>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search stocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-[#1a1a1b] border-gray-700 text-white placeholder-gray-500 focus:border-[#00D09C] transition-colors duration-200"
                />
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center cursor-pointer">
                <span className="text-white text-sm font-medium">U</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search */}
      <div className="md:hidden px-4 py-3 bg-[#0f0f10] border-b border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search stocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full bg-[#1a1a1b] border-gray-700 text-white placeholder-gray-500 focus:border-[#00D09C]"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Explore Stocks</h1>
          <p className="text-gray-400">Discover and track stocks across different sectors and categories</p>
        </div>

        {/* Quick Filters */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {filterCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-[#00D09C] text-white shadow-lg shadow-[#00D09C]/20'
                    : 'bg-[#1a1a1b] text-gray-300 hover:bg-[#252526] border border-gray-700'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-3 flex-wrap">
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="w-[180px] bg-[#1a1a1b] border-gray-700 text-white">
                <SelectValue placeholder="Select sector" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1b] border-gray-700">
                {sectors.map((sector) => (
                  <SelectItem key={sector} value={sector} className="text-white hover:bg-[#252526]">
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-[#1a1a1b] border-gray-700 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1b] border-gray-700">
                <SelectItem value="change_percent" className="text-white hover:bg-[#252526]">% Change</SelectItem>
                <SelectItem value="price" className="text-white hover:bg-[#252526]">Price</SelectItem>
                <SelectItem value="volume" className="text-white hover:bg-[#252526]">Volume</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-gray-400 text-sm">
            {loading ? 'Loading...' : `Showing ${stocks.length} stocks`}
          </div>
        </div>

        {/* Stock Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#00D09C] border-r-transparent"></div>
            <p className="text-gray-400 mt-4">Loading stocks...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stocks.map((stock) => (
              <div
                key={stock.id}
                className="bg-[#1a1a1b] border border-gray-800 rounded-xl p-5 hover:border-[#00D09C] transition-all duration-300 cursor-pointer group hover:shadow-lg hover:shadow-[#00D09C]/10 hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-semibold text-lg group-hover:text-[#00D09C] transition-colors duration-200">
                      {stock.symbol}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-1">{stock.name}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-[#252526] text-gray-300 border-gray-700 text-xs"
                  >
                    {stock.sector}
                  </Badge>
                </div>

                <div className="mb-4">
                  <div className="text-2xl font-bold text-white mb-1">
                    ₹{Number(stock.current_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="flex items-center gap-2">
                    {stock.change_percent >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-[#00D09C]" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stock.change_percent >= 0 ? 'text-[#00D09C]' : 'text-red-500'
                      }`}
                    >
                      {stock.change_amount >= 0 ? '+' : ''}
                      {Number(stock.change_amount).toFixed(2)} ({stock.change_percent >= 0 ? '+' : ''}
                      {Number(stock.change_percent).toFixed(2)}%)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-800 mb-3">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Market Cap</p>
                    <p className="text-white text-sm font-medium">{stock.market_cap}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Volume</p>
                    <p className="text-white text-sm font-medium">{stock.volume}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">P/E Ratio</p>
                    <p className="text-white text-sm font-medium">{Number(stock.pe_ratio).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">52W High</p>
                    <p className="text-white text-sm font-medium">₹{Number(stock.high_52_week).toLocaleString('en-IN')}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAddToPortfolio(stock)}
                    className="flex-1 bg-[#00D09C] hover:bg-[#00B386] text-white transition-colors duration-200"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add to Portfolio
                  </Button>
                  <Button
                    onClick={() => handleAddToWatchlist(stock)}
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-[#252526] hover:text-white transition-colors duration-200"
                    size="sm"
                  >
                    <Star className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && stocks.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-[#1a1a1b] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No stocks found</h3>
            <p className="text-gray-400">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>

      {/* Add to Portfolio Modal */}
      {showPortfolioModal && selectedStock && (
        <AddToPortfolioModal
          stock={selectedStock}
          onClose={() => {
            setShowPortfolioModal(false);
            setSelectedStock(null);
          }}
        />
      )}
    </div>
  );
};

export default StockExplore;
