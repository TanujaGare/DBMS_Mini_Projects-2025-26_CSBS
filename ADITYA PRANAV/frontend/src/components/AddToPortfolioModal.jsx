import React, { useState } from 'react';
import axios from 'axios';
import { X, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AddToPortfolioModal = ({ stock, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [buyPrice, setBuyPrice] = useState(stock.current_price);
  const [buyDate, setBuyDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${API}/portfolio`, {
        user_id: 'demo_user',
        stock_symbol: stock.symbol,
        quantity: parseInt(quantity),
        buy_price: parseFloat(buyPrice),
        buy_date: buyDate,
      });

      toast({
        title: 'Success',
        description: `${stock.symbol} added to your portfolio`,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to add to portfolio',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const totalInvestment = quantity * buyPrice;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1b] rounded-xl border border-gray-800 max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Add to Portfolio</h2>
            <p className="text-gray-400 text-sm">{stock.symbol} - {stock.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="quantity" className="text-gray-300 mb-2 block">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-[#0f0f10] border-gray-700 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="buyPrice" className="text-gray-300 mb-2 block">Buy Price (₹)</Label>
            <Input
              id="buyPrice"
              type="number"
              step="0.01"
              min="0"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              className="bg-[#0f0f10] border-gray-700 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="buyDate" className="text-gray-300 mb-2 block">Buy Date</Label>
            <div className="relative">
              <Input
                id="buyDate"
                type="date"
                value={buyDate}
                onChange={(e) => setBuyDate(e.target.value)}
                className="bg-[#0f0f10] border-gray-700 text-white"
                required
              />
            </div>
          </div>

          <div className="bg-[#0f0f10] border border-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-sm">Current Price</span>
              <span className="text-white font-medium">₹{Number(stock.current_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Total Investment</span>
              <span className="text-[#00D09C] font-bold text-lg">₹{totalInvestment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-700 text-gray-300 hover:bg-[#252526]"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#00D09C] hover:bg-[#00B386] text-white"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add to Portfolio'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddToPortfolioModal;
