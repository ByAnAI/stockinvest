
import React, { useState } from 'react';
import StockChart from './StockChart';
import { StockData } from '../types';

const MOCK_STOCKS: StockData[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 182.63,
    change: 1.45,
    changePercent: 0.8,
    marketCap: '2.84T',
    peRatio: '28.4',
    history: [
      { time: '09:00', price: 180.20 },
      { time: '10:00', price: 181.50 },
      { time: '11:00', price: 180.80 },
      { time: '12:00', price: 182.10 },
      { time: '13:00', price: 181.90 },
      { time: '14:00', price: 183.20 },
      { time: '15:00', price: 182.63 },
    ]
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    price: 726.13,
    change: 14.50,
    changePercent: 2.04,
    marketCap: '1.79T',
    peRatio: '95.2',
    history: [
      { time: '09:00', price: 710.20 },
      { time: '10:00', price: 715.50 },
      { time: '11:00', price: 722.80 },
      { time: '12:00', price: 718.10 },
      { time: '13:00', price: 725.90 },
      { time: '14:00', price: 730.20 },
      { time: '15:00', price: 726.13 },
    ]
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 193.57,
    change: -2.31,
    changePercent: -1.18,
    marketCap: '617.2B',
    peRatio: '42.8',
    history: [
      { time: '09:00', price: 196.20 },
      { time: '10:00', price: 195.50 },
      { time: '11:00', price: 194.80 },
      { time: '12:00', price: 194.10 },
      { time: '13:00', price: 193.90 },
      { time: '14:00', price: 192.20 },
      { time: '15:00', price: 193.57 },
    ]
  }
];

const Dashboard: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState(MOCK_STOCKS[0]);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <span className="p-3 bg-indigo-50 text-indigo-600 rounded-xl text-xl">📈</span>
            <span className="text-emerald-500 text-xs font-semibold bg-emerald-50 px-2 py-1 rounded-lg">+12.5%</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">S&P 500</h3>
          <p className="text-2xl font-bold mt-1">5,088.80</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <span className="p-3 bg-emerald-50 text-emerald-600 rounded-xl text-xl">⚡</span>
            <span className="text-emerald-500 text-xs font-semibold bg-emerald-50 px-2 py-1 rounded-lg">+0.8%</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Nasdaq 100</h3>
          <p className="text-2xl font-bold mt-1">17,937.61</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <span className="p-3 bg-amber-50 text-amber-600 rounded-xl text-xl">🏦</span>
            <span className="text-rose-500 text-xs font-semibold bg-rose-50 px-2 py-1 rounded-lg">-0.2%</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Dow Jones</h3>
          <p className="text-2xl font-bold mt-1">39,131.53</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold">{selectedStock.name} ({selectedStock.symbol})</h3>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">${selectedStock.price}</span>
                <span className={`text-sm font-medium ${selectedStock.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change} ({selectedStock.changePercent}%)
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              {['1D', '1W', '1M', '1Y', 'ALL'].map((range) => (
                <button 
                  key={range} 
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    range === '1D' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[280px]">
            <StockChart data={selectedStock.history} color={selectedStock.change >= 0 ? "#10b981" : "#ef4444"} />
          </div>
        </div>

        {/* Stock List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-4">Watchlist</h3>
          <div className="space-y-4">
            {MOCK_STOCKS.map((stock) => (
              <button
                key={stock.symbol}
                onClick={() => setSelectedStock(stock)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border ${
                  selectedStock.symbol === stock.symbol 
                    ? 'border-indigo-200 bg-indigo-50 shadow-sm' 
                    : 'border-transparent hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3 text-left">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                    stock.change >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {stock.symbol[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{stock.symbol}</p>
                    <p className="text-xs text-slate-500">{stock.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">${stock.price}</p>
                  <p className={`text-xs font-semibold ${stock.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.changePercent}%
                  </p>
                </div>
              </button>
            ))}
          </div>
          <button className="w-full mt-6 py-3 rounded-xl border border-dashed border-slate-300 text-slate-400 text-sm font-medium hover:bg-slate-50 transition-colors">
            + Add Stock
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
