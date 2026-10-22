import React, { useState } from 'react';
import { TrendingUp, Bell, MessageSquare, Settings, User, Search, Plus, BarChart3, Grid3x3, Trash2, Undo2, Redo2, Eye, Camera, Smile, MapPin, Layers, Star, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StockChartZoom from '@/components/trading/StockChartZoom';

const TraderDashboard = () => {
  const [selectedStock, setSelectedStock] = useState('TRIDENT');
  const [currentTab, setCurrentTab] = useState('My Stocks');
  const [activeView, setActiveView] = useState('watchlist');
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [showReports, setShowReports] = useState(false);

  const watchlistData = {
    'My Stocks': [
      { symbol: 'AXISBPSETP', name: 'AXISBPSETP', price: 13.17, change: -0.02, changePercent: 0.15, multiplier: '1 x 10.41' },
      { symbol: 'TRIDENT', name: 'TRIDENT', price: 26.28, change: -0.10, changePercent: 0.38, multiplier: '1 x 54.80', logo: '/logo.png' },
    ],
    'Nifty50': [
      { symbol: 'RELIANCE', name: 'RELIANCE', price: 2456.75, change: 12.50, changePercent: 0.51, multiplier: '1 x 2456.75' },
      { symbol: 'TCS', name: 'TCS', price: 3567.80, change: -15.20, changePercent: -0.42, multiplier: '1 x 3567.80' },
      { symbol: 'HDFCBANK', name: 'HDFCBANK', price: 1678.90, change: 8.30, changePercent: 0.50, multiplier: '1 x 1678.90' },
      { symbol: 'INFY', name: 'INFY', price: 1456.25, change: -5.75, changePercent: -0.39, multiplier: '1 x 1456.25' },
    ],
    'MY WATCHLIST': [
      { symbol: 'TATASTEEL', name: 'TATASTEEL', price: 145.60, change: 2.30, changePercent: 1.60, multiplier: '1 x 145.60' },
      { symbol: 'WIPRO', name: 'WIPRO', price: 456.80, change: -3.20, changePercent: -0.70, multiplier: '1 x 456.80' },
      { symbol: 'BHARTIARTL', name: 'BHARTIARTL', price: 987.50, change: 12.40, changePercent: 1.27, multiplier: '1 x 987.50' },
    ],
    'WATCHLIST2': [
      { symbol: 'ADANIPORTS', name: 'ADANIPORTS', price: 789.30, change: -8.50, changePercent: -1.07, multiplier: '1 x 789.30' },
      { symbol: 'ASIANPAINT', name: 'ASIANPAINT', price: 3245.60, change: 15.80, changePercent: 0.49, multiplier: '1 x 3245.60' },
    ],
    'WATCHLIST3': [
      { symbol: 'MARUTI', name: 'MARUTI', price: 9876.45, change: 45.30, changePercent: 0.46, multiplier: '1 x 9876.45' },
      { symbol: 'SUNPHARMA', name: 'SUNPHARMA', price: 1234.70, change: -12.30, changePercent: -0.99, multiplier: '1 x 1234.70' },
      { symbol: 'TITAN', name: 'TITAN', price: 3456.90, change: 23.50, changePercent: 0.68, multiplier: '1 x 3456.90' },
    ],
  };

  const stocks = watchlistData[currentTab] || [];

  const stockData = Array.from({ length: 78 }, (_, i) => ({
    time: `${9 + Math.floor(i / 12)}:${((i * 5) % 60).toString().padStart(2, '0')}`,
    price: 26.28 + Math.sin(i / 10) * 0.5 + (Math.random() - 0.5) * 0.3,
    volume: Math.floor(10000 + Math.random() * 50000)
  }));

  return (
    <div className="h-screen flex flex-col bg-white text-gray-900">
      {/* Top Bar */}
      <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">NIFTY</span>
            <span className="text-gray-900">25,819.35</span>
            <span className="text-green-600">+93.95 (+0.37%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">SENSEX</span>
            <span className="text-gray-900">83,734.25</span>
            <span className="text-green-600">+283.29 (+0.34%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">BANKNIFTY</span>
            <span className="text-gray-900">61,550.80</span>
            <span className="text-green-600">+376.80 (+0.62%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">FINNIFTY</span>
            <span className="text-gray-900">28,463.25</span>
            <span className="text-green-600">+175.85 (+0.62%)</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-200 rounded"><MessageSquare className="w-5 h-5" /></button>
          <Bell className="w-5 h-5 cursor-pointer" />
          <div className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm">Bhumpall...</span>
            <span className="text-xs text-gray-500">59924945</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <img src="/logo.png" alt="Lendrix" className="w-6 h-6" />
            </div>
            <div>
              <div className="text-lg font-bold">Lendrix Ventech</div>
              <div className="text-xs text-gray-500">TraderTerminal</div>
            </div>
          </div>
          <div className="flex gap-6 ml-8">
            <button className="text-sm hover:text-blue-400">Book</button>
            <button className="text-sm hover:text-blue-400">Positions</button>
            <button className="text-sm hover:text-blue-400">Portfolio</button>
            <button className="text-sm hover:text-blue-400">Ideas</button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-pink-500 rounded text-sm text-white">FnO 360</button>
          <button className="px-4 py-2 bg-blue-600 rounded text-sm text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Feedback
          </button>
          <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded text-sm">Margin: -91.52</button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-16 bg-gray-50 flex flex-col items-center py-4 gap-6 border-r border-gray-200">
          <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setActiveView('watchlist')}>
            <div className={`w-10 h-10 rounded flex items-center justify-center ${activeView === 'watchlist' ? 'bg-pink-500/20' : ''}`}>
              <BarChart3 className={`w-5 h-5 ${activeView === 'watchlist' ? 'text-pink-500' : 'text-gray-600'}`} />
            </div>
            <span className={`text-xs ${activeView === 'watchlist' ? 'text-pink-500' : 'text-gray-600'}`}>Watchlist</span>
          </div>
          <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setActiveView('orders')}>
            <div className={`w-10 h-10 rounded flex items-center justify-center ${activeView === 'orders' ? 'bg-pink-500/20' : ''}`}>
              <Grid3x3 className={`w-5 h-5 ${activeView === 'orders' ? 'text-pink-500' : 'text-gray-600'}`} />
            </div>
            <span className={`text-xs ${activeView === 'orders' ? 'text-pink-500' : 'text-gray-600'}`}>Order &<br/>Position</span>
          </div>
          <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setShowPortfolio(true)}>
            <div className={`w-10 h-10 rounded flex items-center justify-center ${showPortfolio ? 'bg-pink-500/20' : ''}`}>
              <User className={`w-5 h-5 ${showPortfolio ? 'text-pink-500' : 'text-gray-600'}`} />
            </div>
            <span className={`text-xs ${showPortfolio ? 'text-pink-500' : 'text-gray-600'}`}>Portfolio</span>
          </div>
          <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setShowReports(true)}>
            <div className={`w-10 h-10 rounded flex items-center justify-center ${showReports ? 'bg-pink-500/20' : ''}`}>
              <BarChart3 className={`w-5 h-5 ${showReports ? 'text-pink-500' : 'text-gray-600'}`} />
            </div>
            <span className={`text-xs ${showReports ? 'text-pink-500' : 'text-gray-600'}`}>Reports</span>
          </div>
          <div className="flex flex-col items-center gap-2 cursor-pointer opacity-50 hover:opacity-100" onClick={() => window.location.href = '/mutual-funds'}>
            <div className="w-10 h-10 rounded flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xs">Mutual<br/>Funds</span>
          </div>
          <div className="flex flex-col items-center gap-2 cursor-pointer opacity-50 hover:opacity-100">
            <div className="w-10 h-10 rounded flex items-center justify-center">
              <Star className="w-5 h-5" />
            </div>
            <span className="text-xs">IPO</span>
          </div>
        </div>

        {/* Watchlist/Orders Panel */}
        <div className="w-[400px] bg-white border-r border-gray-200 flex flex-col">
          {activeView === 'watchlist' ? (
            <>
              <div className="p-3 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search" className="flex-1 bg-transparent text-sm outline-none text-gray-900" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 overflow-x-auto">
                    <button className={`text-xs pb-2 whitespace-nowrap ${currentTab === 'My Stocks' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`} onClick={() => setCurrentTab('My Stocks')}>My Stocks</button>
                    <button className={`text-xs pb-2 whitespace-nowrap ${currentTab === 'Nifty50' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`} onClick={() => setCurrentTab('Nifty50')}>Nifty50</button>
                    <button className={`text-xs pb-2 whitespace-nowrap ${currentTab === 'MY WATCHLIST' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`} onClick={() => setCurrentTab('MY WATCHLIST')}>MY WATCHLIST</button>
                    <button className={`text-xs pb-2 whitespace-nowrap ${currentTab === 'WATCHLIST2' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`} onClick={() => setCurrentTab('WATCHLIST2')}>WATCHLIST2</button>
                    <button className={`text-xs pb-2 whitespace-nowrap ${currentTab === 'WATCHLIST3' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`} onClick={() => setCurrentTab('WATCHLIST3')}>WATCHLIST3</button>
                  </div>
                  <Settings className="w-4 h-4 text-gray-400 cursor-pointer" />
                </div>
              </div>

              <div className="bg-gray-50 px-3 py-2 flex items-center justify-between text-xs border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Current</span>
                  <span className="text-gray-900">39.45</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Today's P&L</span>
                  <span className="text-red-600">-0.12 (-0.30%)</span>
                </div>
                <button className="p-1 bg-blue-600 rounded text-white"><Plus className="w-4 h-4" /></button>
              </div>

              <div className="bg-gray-50 px-3 py-2 flex items-center justify-between text-xs border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Total P&L</span>
                  <span className="text-red-600">-25.76 (-39.50%)</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="px-3 py-2 flex items-center justify-between text-xs text-gray-500 border-b border-gray-200">
                  <span>Stock Name ↕</span>
                  <span>Change ↕</span>
                  <span>Price ↕</span>
                </div>
                {stocks.map((stock) => (
                  <div key={stock.symbol} className={`px-3 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${selectedStock === stock.symbol ? 'bg-gray-50' : ''}`} onClick={() => setSelectedStock(stock.symbol)}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {stock.logo && <img src={stock.logo} className="w-6 h-6 rounded" />}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{stock.symbol}</div>
                          <div className="text-xs text-gray-500">{stock.multiplier}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-900">{stock.price.toFixed(2)}</div>
                        <div className={`text-xs ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>{stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Current Value</span>
                        <span className="text-gray-900">{stock.price.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Today's P&L</span>
                        <span className={stock.change >= 0 ? 'text-green-600' : 'text-red-600'}>{stock.change.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button className="flex-1 py-1 bg-green-600 rounded text-xs text-white">B</button>
                      <button className="flex-1 py-1 bg-red-600 rounded text-xs text-white">S</button>
                      <button className="p-1 bg-gray-200 rounded"><BarChart3 className="w-3 h-3 text-gray-600" /></button>
                      <button className="p-1 bg-gray-200 rounded"><Grid3x3 className="w-3 h-3 text-gray-600" /></button>
                      <button className="p-1 bg-gray-200 rounded"><Trash2 className="w-3 h-3 text-gray-600" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="p-3 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search" className="flex-1 bg-transparent text-sm outline-none text-gray-900" />
                </div>
                <div className="flex gap-2">
                  <button className="text-xs px-3 py-1 bg-blue-600 text-white rounded">Orders</button>
                  <button className="text-xs px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">Baskets</button>
                  <button className="text-xs px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">Stock SIP</button>
                  <button className="text-xs px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">VTT</button>
                  <button className="text-xs px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">Holdings</button>
                </div>
              </div>
              <div className="p-3 border-b border-gray-200">
                <div className="flex gap-2 text-xs">
                  <button className="px-2 py-1 bg-gray-100 rounded">All • 0</button>
                  <button className="px-2 py-1 hover:bg-gray-100 rounded">Pending • 0</button>
                  <button className="px-2 py-1 hover:bg-gray-100 rounded">Executed • 0</button>
                  <button className="px-2 py-1 hover:bg-gray-100 rounded">Cancelled • 0</button>
                  <button className="px-2 py-1 hover:bg-gray-100 rounded">Rejected • 0</button>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-48 h-48 mx-auto mb-4 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                        <X className="w-16 h-16 text-red-400" />
                      </div>
                    </div>
                    <div className="absolute top-8 right-8">
                      <div className="w-12 h-16 bg-white border-2 border-gray-200 rounded transform rotate-12"></div>
                    </div>
                    <div className="absolute top-4 right-16">
                      <div className="w-12 h-16 bg-white border-2 border-gray-200 rounded transform -rotate-6"></div>
                    </div>
                  </div>
                  <p className="text-gray-500 font-medium">No Record Found</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Main Chart Area */}
        <div className="flex-1 flex flex-col">
          <StockChartZoom data={stockData} currentPrice={26.28} change={-0.10} changePercent={-0.38} />
        </div>

        {/* Right Order Panel */}
        <div className="w-[400px] bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gray-100 rounded"></div>
              <div>
                <div className="text-sm font-bold text-gray-900">TRIDENT LIMITED</div>
                <div className="text-xs text-gray-500">TRIDENT · 1 · NSE</div>
              </div>
              <span className="ml-auto text-lg font-bold text-gray-900">26.28</span>
              <span className="text-xs text-red-600">-0.10(-0.38%)</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <button className="text-xs px-3 py-1 bg-blue-600 text-white rounded">1m</button>
              <button className="text-xs px-3 py-1 hover:bg-gray-100 rounded text-gray-900">Save</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-4 gap-2 text-xs mb-4">
              <div><span className="text-gray-500">Order</span><br/><span className="text-gray-900">0</span></div>
              <div><span className="text-gray-500">Qty.</span><br/><span className="text-gray-900">0</span></div>
              <div><span className="text-gray-500">Price</span><br/><span className="text-green-600">0.00</span></div>
              <div><span className="text-gray-500">Price</span><br/><span className="text-red-600">26.28</span></div>
            </div>

            <div className="space-y-2 mb-4">
              {[0, 0, 0, 0].map((_, i) => (
                <div key={i} className="grid grid-cols-5 gap-2 text-xs text-gray-900">
                  <div className="text-green-600">0</div>
                  <div>0</div>
                  <div className="text-green-600">0.00</div>
                  <div className="text-red-600">0.00</div>
                  <div>0</div>
                  <div>0</div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mb-4 text-xs">
              <span className="text-gray-500">Total Buy Quantity</span>
              <span className="text-gray-500">Total Sell Quantity</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-gray-500">Open</span><span className="text-gray-900">26.40</span><span className="text-gray-500">High</span><span className="text-gray-900">26.55</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Low</span><span className="text-gray-900">26.20</span><span className="text-gray-500">PClose</span><span className="text-gray-900">26.38</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Upper Circuit</span><span className="text-gray-900">31.65</span><span className="text-gray-500">Lower Circuit</span><span className="text-gray-900">21.11</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Volume</span><span className="text-gray-900">37.84L</span><span className="text-gray-500">ATP</span><span className="text-gray-900">26.31</span></div>
              <div className="flex justify-between"><span className="text-gray-500">M-Capital(Cr)</span><span className="text-gray-900">13.44K</span></div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-xs mb-2 text-gray-900">
                <span>23.11</span>
                <span>34.62</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-blue-400">52 Week's Low</span>
                <span className="text-blue-400">52 Week's High</span>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <button className="flex-1 py-3 bg-green-600 rounded font-bold">Buy</button>
              <button className="flex-1 py-3 bg-red-600 rounded font-bold">Sell</button>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio View */}
      <AnimatePresence>
        {showPortfolio && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-50"
          >
            <div className="h-screen flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
                <div className="flex items-center gap-4">
                  <ArrowLeft className="w-5 h-5 cursor-pointer" onClick={() => setShowPortfolio(false)} />
                  <h1 className="text-xl font-bold">Portfolio</h1>
                </div>
                <div className="flex items-center gap-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-semibold">Booked P&L</button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-semibold">Transaction</button>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="p-4 bg-gray-50 border-b">
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Invested</div>
                    <div className="text-2xl font-bold">65.21</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Current</div>
                    <div className="text-2xl font-bold">38.73</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Today's P&L</div>
                    <div className="text-2xl font-bold text-red-600">-0.34 (-0.87%)</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Total P&L</div>
                    <div className="text-2xl font-bold text-red-600">-26.48 (-40.61%)</div>
                  </div>
                </div>
              </div>

              {/* Holdings Table */}
              <div className="flex-1 overflow-auto flex">
                {/* Left Sidebar with Stock Cards */}
                <div className="w-80 border-r bg-white">
                  <div className="p-3 border-b">
                    <div className="flex items-center gap-2 mb-3">
                      <Search className="w-4 h-4 text-gray-400" />
                      <input type="text" placeholder="Search" className="flex-1 text-sm outline-none" />
                      <Settings className="w-4 h-4 text-gray-400 cursor-pointer" />
                    </div>
                    <div className="flex gap-2 text-xs overflow-x-auto">
                      <button className="px-3 py-1 bg-blue-600 text-white rounded whitespace-nowrap">My Stocks</button>
                      <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded whitespace-nowrap">Nifty50</button>
                      <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded whitespace-nowrap">MY WATCHLIST</button>
                      <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded whitespace-nowrap">WATC</button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 border-b">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-500">Current</span>
                      <span className="font-semibold">38.73</span>
                    </div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-500">Today's P&L</span>
                      <span className="text-red-600">-0.34 (-0.87%)</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Total P&L</span>
                      <span className="text-red-600">-26.48 (-40.61%)</span>
                    </div>
                  </div>

                  <div className="p-3 border-b bg-gray-50">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Stock Name ↕</span>
                      <span>Change ↕</span>
                      <span>Price ↕</span>
                    </div>
                  </div>

                  <div className="overflow-y-auto">
                    {/* AXISBPSETF Card */}
                    <div className="p-3 border-b hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center text-red-600 font-bold text-sm">A</div>
                          <div>
                            <div className="text-sm font-semibold">AXISBPSETF</div>
                            <div className="text-xs text-gray-500">📊 1 x 10.41</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">13.20</div>
                          <div className="text-xs text-green-600">+0.04 (0.30%)</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div>
                          <span className="text-gray-500">Current Value</span>
                          <div className="font-semibold">13.20</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Today's P&L</span>
                          <div className="text-green-600">0.04</div>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">Unrealized P&L</span>
                          <div className="text-green-600">2.79 (26.80%)</div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button className="flex-1 py-1 bg-green-600 text-white rounded text-xs font-semibold">B</button>
                        <button className="flex-1 py-1 bg-red-600 text-white rounded text-xs font-semibold">S</button>
                        <button className="p-1 bg-gray-200 rounded"><BarChart3 className="w-3 h-3" /></button>
                        <button className="p-1 bg-gray-200 rounded"><Grid3x3 className="w-3 h-3" /></button>
                        <button className="p-1 bg-gray-200 rounded"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </div>

                    {/* TRIDENT Card */}
                    <div className="p-3 border-b bg-blue-50 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <img src="/logo.png" className="w-8 h-8 rounded" />
                          <div>
                            <div className="text-sm font-semibold">TRIDENT</div>
                            <div className="text-xs text-gray-500">🏠 1 x 54.80</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">25.53</div>
                          <div className="text-xs text-red-600">-0.38 (1.47%)</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div>
                          <span className="text-gray-500">Current Value</span>
                          <div className="font-semibold">25.53</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Today's P&L</span>
                          <div className="text-red-600">-0.38</div>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">Unrealized P&L</span>
                          <div className="text-red-600">-29.27 (53.41%)</div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button className="flex-1 py-1 bg-green-600 text-white rounded text-xs font-semibold">B</button>
                        <button className="flex-1 py-1 bg-red-600 text-white rounded text-xs font-semibold">S</button>
                        <button className="p-1 bg-gray-200 rounded"><BarChart3 className="w-3 h-3" /></button>
                        <button className="p-1 bg-gray-200 rounded"><Grid3x3 className="w-3 h-3" /></button>
                        <button className="p-1 bg-gray-200 rounded"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Table */}
                <div className="flex-1 flex flex-col">
                  {/* Tabs */}
                  <div className="p-3 border-b flex gap-4">
                    <button className="text-sm text-blue-600 border-b-2 border-blue-600 pb-2 font-semibold">Equity</button>
                    <button className="text-sm text-gray-600 pb-2">FNO</button>
                    <button className="text-sm text-gray-600 pb-2">Mutual Funds</button>
                    <button className="text-sm text-gray-600 pb-2">Commodity</button>
                  </div>
                  
                  <div className="flex-1 overflow-auto p-4">
                <div className="bg-white rounded-lg border">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-3 text-sm font-semibold">Name</th>
                        <th className="text-right p-3 text-sm font-semibold">Qty</th>
                        <th className="text-right p-3 text-sm font-semibold">Avg. Price</th>
                        <th className="text-right p-3 text-sm font-semibold">LTP</th>
                        <th className="text-right p-3 text-sm font-semibold">Curr. Val</th>
                        <th className="text-right p-3 text-sm font-semibold">P&L (Rs)</th>
                        <th className="text-right p-3 text-sm font-semibold">P&L (%)</th>
                        <th className="text-right p-3 text-sm font-semibold">Today's P&L (Rs)</th>
                        <th className="text-right p-3 text-sm font-semibold">Today's P&L (%)</th>
                        <th className="text-right p-3 text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="font-semibold">AXISBPSETF</div>
                          <div className="text-xs text-gray-500">1 x 10.41</div>
                        </td>
                        <td className="text-right p-3">1</td>
                        <td className="text-right p-3">10.41</td>
                        <td className="text-right p-3">13.20</td>
                        <td className="text-right p-3">13.20</td>
                        <td className="text-right p-3 text-green-600">2.79</td>
                        <td className="text-right p-3 text-green-600">26.80%</td>
                        <td className="text-right p-3 text-green-600">0.04</td>
                        <td className="text-right p-3 text-green-600">0.30%</td>
                        <td className="text-right p-3">
                          <div className="flex gap-2 justify-end">
                            <button className="px-3 py-1 bg-green-600 text-white rounded text-xs font-semibold">B</button>
                            <button className="px-3 py-1 bg-red-600 text-white rounded text-xs font-semibold">S</button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="font-semibold">TRIDENT</div>
                          <div className="text-xs text-gray-500">1 x 54.80</div>
                        </td>
                        <td className="text-right p-3">1</td>
                        <td className="text-right p-3">54.80</td>
                        <td className="text-right p-3">25.53</td>
                        <td className="text-right p-3">25.53</td>
                        <td className="text-right p-3 text-red-600">-29.27</td>
                        <td className="text-right p-3 text-red-600">-53.41%</td>
                        <td className="text-right p-3 text-red-600">-0.38</td>
                        <td className="text-right p-3 text-red-600">-1.47%</td>
                        <td className="text-right p-3">
                          <div className="flex gap-2 justify-end">
                            <button className="px-3 py-1 bg-green-600 text-white rounded text-xs font-semibold">B</button>
                            <button className="px-3 py-1 bg-red-600 text-white rounded text-xs font-semibold">S</button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reports View */}
      <AnimatePresence>
        {showReports && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-50"
          >
            <div className="h-screen flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <div className="flex items-center gap-4">
                  <ArrowLeft className="w-5 h-5 cursor-pointer" onClick={() => setShowReports(false)} />
                </div>
                <div className="flex items-center gap-6">
                  <button className="text-sm text-blue-600 font-semibold">PORTFOLIO</button>
                  <button className="text-sm text-blue-600 font-semibold">TRADE REPORTS</button>
                  <button className="text-sm text-blue-600 font-semibold">OTHER REPORTS</button>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full border-2 border-pink-500 flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">BHUMPALLI</div>
                      <div className="text-xs text-gray-500">59924945</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center justify-between px-6 py-3 border-b">
                <div className="flex gap-6">
                  <button className="text-sm font-semibold text-pink-600 border-b-2 border-pink-600 pb-2">Summary</button>
                  <button className="text-sm text-gray-600 pb-2">Equity</button>
                  <button className="text-sm text-gray-600 pb-2">F&O</button>
                  <button className="text-sm text-gray-600 pb-2">Commodity</button>
                  <button className="text-sm text-gray-600 pb-2">Mutual Fund</button>
                  <button className="text-sm text-gray-600 pb-2">SmallCase</button>
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded text-sm flex items-center gap-2">
                  File Taxes
                  <span className="text-blue-600 font-semibold">cleartax</span>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-auto p-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column - Chart */}
                  <div className="bg-white border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold">My Portfolio Performance Vs Index</h3>
                      <select className="border rounded px-3 py-1 text-sm">
                        <option>BSE Sensex</option>
                      </select>
                    </div>
                    <div className="relative h-96 pl-12">
                      {/* Y-axis */}
                      <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-gray-500 text-right pr-2">
                        <span>12</span>
                        <span>10</span>
                        <span>8</span>
                        <span>6</span>
                        <span>4</span>
                        <span>2</span>
                        <span className="font-semibold">0</span>
                        <span>-2</span>
                        <span>-4</span>
                        <span>-6</span>
                      </div>
                      {/* Y-axis label */}
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-gray-500 whitespace-nowrap">
                        Percentage
                      </div>
                      {/* Chart area */}
                      <div className="absolute left-12 right-0 top-0 bottom-8 border-l border-b border-gray-300">
                        {/* Grid lines */}
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                          <div key={i} className="absolute w-full border-t border-gray-100" style={{top: `${i * 10}%`}}></div>
                        ))}
                        {/* Zero line */}
                        <div className="absolute w-full border-t border-gray-400" style={{top: '50%'}}></div>
                        
                        {/* Bars container */}
                        <div className="absolute inset-0 flex items-center justify-around px-8">
                          {/* 1M */}
                          <div className="flex flex-col items-center" style={{height: '100%', position: 'relative'}}>
                            <div className="flex-1"></div>
                            <div className="flex gap-2 items-end" style={{position: 'absolute', top: '50%', transform: 'translateY(-50%)'}}>
                              <div className="relative">
                                <div className="w-10 bg-yellow-400 rounded-t" style={{height: '40px', marginBottom: '0'}}></div>
                                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-semibold whitespace-nowrap">2.22</span>
                              </div>
                              <div className="relative">
                                <div className="w-10 bg-green-400 rounded-t" style={{height: '20px', marginBottom: '0'}}></div>
                                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">1.1</span>
                              </div>
                            </div>
                            <div className="flex-1"></div>
                            <div className="text-xs text-gray-600 font-medium mt-2">1M</div>
                          </div>
                          
                          {/* 3M */}
                          <div className="flex flex-col items-center" style={{height: '100%', position: 'relative'}}>
                            <div className="flex-1"></div>
                            <div className="flex gap-2 items-start" style={{position: 'absolute', top: '50%', transform: 'translateY(0)'}}>
                              <div className="relative">
                                <div className="w-10 bg-yellow-400 rounded-b" style={{height: '80px'}}></div>
                                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-semibold whitespace-nowrap">-4.43</span>
                              </div>
                              <div className="relative">
                                <div className="w-10 bg-green-400 rounded-b" style={{height: '50px'}}></div>
                                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">-2.84</span>
                              </div>
                            </div>
                            <div className="flex-1"></div>
                            <div className="text-xs text-gray-600 font-medium mt-2">3M</div>
                          </div>
                          
                          {/* 6M */}
                          <div className="flex flex-col items-center" style={{height: '100%', position: 'relative'}}>
                            <div className="flex-1"></div>
                            <div className="flex gap-2" style={{position: 'absolute', top: '50%', transform: 'translateY(-50%)'}}>
                              <div className="relative flex flex-col items-center">
                                <div className="w-10 bg-yellow-400 rounded-b" style={{height: '75px', marginTop: '0'}}></div>
                                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-semibold whitespace-nowrap" style={{top: '80px'}}>-4.13</span>
                              </div>
                              <div className="relative flex flex-col items-center">
                                <div className="w-10 bg-green-400 rounded-t" style={{height: '18px', marginBottom: '0'}}></div>
                                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">0.99</span>
                              </div>
                            </div>
                            <div className="flex-1"></div>
                            <div className="text-xs text-gray-600 font-medium mt-2">6M</div>
                          </div>
                          
                          {/* 1Y */}
                          <div className="flex flex-col items-center" style={{height: '100%', position: 'relative'}}>
                            <div className="flex-1"></div>
                            <div className="flex gap-2" style={{position: 'absolute', top: '50%', transform: 'translateY(-50%)'}}>
                              <div className="relative flex flex-col items-center">
                                <div className="w-10 bg-yellow-400 rounded-b" style={{height: '18px', marginTop: '0'}}></div>
                                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-semibold whitespace-nowrap" style={{top: '23px'}}>-1.03</span>
                              </div>
                              <div className="relative flex flex-col items-center">
                                <div className="w-10 bg-green-400 rounded-t" style={{height: '180px', marginBottom: '0'}}></div>
                                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">9.96</span>
                              </div>
                            </div>
                            <div className="flex-1"></div>
                            <div className="text-xs text-gray-600 font-medium mt-2">1Y</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Portfolio Value */}
                  <div className="space-y-6">
                    <div className="bg-white border rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm text-gray-500 mb-2">Portfolio Value</div>
                          <div className="text-xs text-gray-500 mb-1">Equity + MF</div>
                          <div className="text-3xl font-bold mb-4">₹38.73</div>
                          <div className="text-sm text-gray-500 mb-1">Today's P&L</div>
                          <div className="text-xl text-red-600 font-semibold mb-4">₹-0.34</div>
                          <div className="text-sm text-gray-500 mb-1">Unbooked P&L</div>
                          <div className="text-xl text-red-600 font-semibold">₹-26.48</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <svg className="w-32 h-32" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#FCD34D" strokeWidth="20" />
                          </svg>
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                              <span>Equity</span>
                              <span className="ml-auto font-semibold">100%</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-3 h-3 bg-pink-400 rounded"></div>
                              <span>Mutual Fund</span>
                              <span className="ml-auto font-semibold">0%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* My Portfolio Table */}
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4">My Portfolio</h3>
                      <table className="w-full">
                        <thead className="border-b">
                          <tr className="text-sm text-gray-500">
                            <th className="text-left py-2">Asset Class</th>
                            <th className="text-right py-2">Curr. Value</th>
                            <th className="text-right py-2">Unrealized P/L(%)</th>
                            <th className="text-right py-2">Day's P/L (%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-3 font-semibold">Equity</td>
                            <td className="text-right">38.73</td>
                            <td className="text-right text-red-600">-26.48 (-40.61%)</td>
                            <td className="text-right text-red-600">-0.34 (-0.87%)</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 font-semibold">Mutual Fund</td>
                            <td className="text-right">0</td>
                            <td className="text-right text-green-600">0 (0.00%)</td>
                            <td className="text-right text-green-600">0 (0.00%)</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 font-semibold">FnO</td>
                            <td className="text-right">-</td>
                            <td className="text-right text-green-600">0 (0.00%)</td>
                            <td className="text-right text-green-600">0 (0.00%)</td>
                          </tr>
                          <tr>
                            <td className="py-3 font-semibold">Commodity</td>
                            <td className="text-right">-</td>
                            <td className="text-right text-green-600">0 (0.00%)</td>
                            <td className="text-right text-green-600">0 (0.00%)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Top Gainers and Losers */}
                  <div className="col-span-2 bg-white rounded-lg p-8">
                    <h3 className="text-2xl font-bold mb-8">Top Gainers and Losers</h3>
                    <div className="grid grid-cols-2 gap-12">
                      {/* Gainers */}
                      <div>
                        <h4 className="text-green-600 font-bold mb-6 text-xl">Gainers</h4>
                        <table className="w-full">
                          <thead>
                            <tr className="text-sm text-gray-400 border-b">
                              <th className="text-left pb-4 font-normal">Asset Class</th>
                              <th className="text-left pb-4 font-normal pl-8">CMP</th>
                              <th className="text-left pb-4 font-normal pl-8">Change</th>
                              <th className="text-left pb-4 font-normal pl-8">Day's Change<br/>(%)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="pt-6 text-base leading-relaxed">Axis Nifty<br/>AAA Bond<br/>Plus SDL Apr<br/>2026 50:50<br/>ETF</td>
                              <td className="pt-6 text-base pl-8">13.20</td>
                              <td className="pt-6 text-base text-green-600 pl-8">0.04</td>
                              <td className="pt-6 text-base text-green-600 pl-8">0.30</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Losers */}
                      <div className="border-l pl-12">
                        <h4 className="text-red-600 font-bold mb-6 text-xl">Losers</h4>
                        <table className="w-full">
                          <thead>
                            <tr className="text-sm text-gray-400 border-b">
                              <th className="text-left pb-4 font-normal">Asset<br/>Class</th>
                              <th className="text-left pb-4 font-normal pl-8">CMP</th>
                              <th className="text-left pb-4 font-normal pl-8">Change</th>
                              <th className="text-left pb-4 font-normal pl-8">Day's Change<br/>(%)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="pt-6 text-base leading-relaxed">Trident<br/>Ltd.</td>
                              <td className="pt-6 text-base pl-8">25.53</td>
                              <td className="pt-6 text-base text-red-600 pl-8">-0.38</td>
                              <td className="pt-6 text-base text-red-600 pl-8">-1.47</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TraderDashboard;
