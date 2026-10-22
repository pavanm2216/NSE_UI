import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, BarChart3, CandlestickChart, Undo2, Redo2, Eye, Camera, Plus, Pencil, Clock, Ruler, ZoomIn, Smile, MapPin, X, Layers, Star } from 'lucide-react';

interface StockChartProps {
  data: Array<{ time: string; price: number; volume: number }>;
  currentPrice: number;
  change: number;
  changePercent: number;
}

interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface ChartState {
  chartType: 'candle' | 'hollow' | 'hlc' | 'line' | 'lineMarkers' | 'stepLine' | 'area' | 'hlcArea' | 'baseline' | 'columns' | 'highLow' | 'heikinAshi';
  timeIntervalType: 'time' | 'number';
  showIndicators: boolean;
  selectedInterval: string;
}

const StockChart: React.FC<StockChartProps> = ({ data, currentPrice }) => {
  const [candleData, setCandleData] = useState<Candle[]>([]);
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [chartType, setChartType] = useState<'candle' | 'hollow' | 'hlc' | 'line' | 'lineMarkers' | 'stepLine' | 'area' | 'hlcArea' | 'baseline' | 'columns' | 'highLow' | 'heikinAshi'>('candle');
  const [selectedInterval, setSelectedInterval] = useState('5m');
  const [timeIntervalType, setTimeIntervalType] = useState<'time' | 'number'>('time');
  const [showChartMenu, setShowChartMenu] = useState(false);
  const [showIndicators, setShowIndicators] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showTimeMenu, setShowTimeMenu] = useState(false);
  
  // Undo/Redo state management
  const [history, setHistory] = useState<ChartState[]>([{
    chartType: 'candle',
    timeIntervalType: 'time',
    showIndicators: false,
    selectedInterval: '5m'
  }]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);

  // Save current state to history
  const saveToHistory = useCallback((newState: Partial<ChartState>) => {
    const currentState = {
      chartType,
      timeIntervalType,
      showIndicators,
      selectedInterval
    };
    
    const updatedState = { ...currentState, ...newState };
    
    // Only save if state actually changed
    const lastState = history[currentHistoryIndex];
    if (JSON.stringify(lastState) !== JSON.stringify(updatedState)) {
      const newHistory = history.slice(0, currentHistoryIndex + 1);
      newHistory.push(updatedState);
      setHistory(newHistory);
      setCurrentHistoryIndex(newHistory.length - 1);
    }
  }, [chartType, timeIntervalType, showIndicators, selectedInterval, history, currentHistoryIndex]);

  // Undo function
  const handleUndo = useCallback(() => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      const previousState = history[newIndex];
      
      setChartType(previousState.chartType);
      setTimeIntervalType(previousState.timeIntervalType);
      setShowIndicators(previousState.showIndicators);
      setSelectedInterval(previousState.selectedInterval);
      setCurrentHistoryIndex(newIndex);
    }
  }, [currentHistoryIndex, history]);

  // Redo function
  const handleRedo = useCallback(() => {
    if (currentHistoryIndex < history.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      const nextState = history[newIndex];
      
      setChartType(nextState.chartType);
      setTimeIntervalType(nextState.timeIntervalType);
      setShowIndicators(nextState.showIndicators);
      setSelectedInterval(nextState.selectedInterval);
      setCurrentHistoryIndex(newIndex);
    }
  }, [currentHistoryIndex, history]);

  // Enhanced setters with history
  const setChartTypeWithHistory = useCallback((newType: 'candle' | 'hollow' | 'hlc' | 'line' | 'lineMarkers' | 'stepLine' | 'area' | 'hlcArea' | 'baseline' | 'columns' | 'highLow' | 'heikinAshi') => {
    saveToHistory({ chartType: newType });
    setChartType(newType);
  }, [saveToHistory]);

  const setTimeIntervalTypeWithHistory = useCallback((newType: 'time' | 'number') => {
    saveToHistory({ timeIntervalType: newType });
    setTimeIntervalType(newType);
  }, [saveToHistory]);

  const setShowIndicatorsWithHistory = useCallback((show: boolean) => {
    saveToHistory({ showIndicators: show });
    setShowIndicators(show);
  }, [saveToHistory]);

  const setSelectedIntervalWithHistory = useCallback((interval: string) => {
    saveToHistory({ selectedInterval: interval });
    setSelectedInterval(interval);
  }, [saveToHistory]);

  // Generate chart data based on selected interval
  const generateIntervalData = useCallback(() => {
    const intervals = {
      '1m': { points: 390, volatility: 0.001 },
      '3m': { points: 130, volatility: 0.002 },
      '5m': { points: 78, volatility: 0.002 },
      '15m': { points: 26, volatility: 0.005 },
      '30m': { points: 13, volatility: 0.008 },
      '1h': { points: 7, volatility: 0.01 },
      'D': { points: 30, volatility: 0.02 }
    };
    
    const config = intervals[selectedInterval as keyof typeof intervals] || intervals['5m'];
    const candles = [];
    let currentPrice = data[0]?.price || 2400;
    
    for (let i = 0; i < config.points; i++) {
      const randomWalk = (Math.random() - 0.48) * (currentPrice * config.volatility * 2);
      const microTrend = Math.sin(i / 5) * (currentPrice * 0.001);
      
      const open = currentPrice;
      const close = currentPrice + randomWalk + microTrend;
      const high = Math.max(open, close) + Math.random() * (currentPrice * config.volatility * 0.5);
      const low = Math.min(open, close) - Math.random() * (currentPrice * config.volatility * 0.5);
      
      candles.push({
        time: selectedInterval === 'D' ? `Day ${i + 1}` : `${9 + Math.floor(i / 12)}:${((i * 5) % 60).toString().padStart(2, '0')}`,
        open,
        high,
        low,
        close,
        volume: Math.floor(10000 + Math.random() * 50000)
      });
      
      currentPrice = close;
    }
    
    return candles;
  }, [selectedInterval, data]);

  useEffect(() => {
    setCandleData(generateIntervalData());
  }, [generateIntervalData]);

  if (candleData.length === 0) return null;

  const minPrice = Math.min(...candleData.map(c => c.low));
  const maxPrice = Math.max(...candleData.map(c => c.high));
  const priceRange = maxPrice - minPrice;
  const buffer = priceRange * 0.1;
  const yMin = minPrice - buffer;
  const yMax = maxPrice + buffer;
  const yRange = yMax - yMin;

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-4">
          <TrendingUp className="w-5 h-5 text-red-500" />
          {['1m', '3m', '5m', '15m', '30m', '1h', 'D'].map((interval) => (
            <button 
              key={interval}
              className={`text-sm px-3 py-1 rounded ${
                selectedInterval === interval 
                  ? 'bg-blue-100 text-blue-600 font-medium' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setSelectedIntervalWithHistory(interval)}
            >
              {interval}
            </button>
          ))}
          <div className="relative">
            <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1" onClick={() => setShowTimeMenu(!showTimeMenu)}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {showTimeMenu && (
              <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-xl w-48 z-50">
                <div className="flex border-b">
                  <button 
                    className={`flex-1 py-2 text-sm ${timeIntervalType === 'time' ? 'bg-gray-100 font-semibold' : ''}`}
                    onClick={() => setTimeIntervalTypeWithHistory('time')}
                  >
                    Time Interval
                  </button>
                  <button 
                    className={`flex-1 py-2 text-sm ${timeIntervalType === 'number' ? 'bg-gray-100 font-semibold' : ''}`}
                    onClick={() => setTimeIntervalTypeWithHistory('number')}
                  >
                    Number or Range
                  </button>
                </div>
                <div className="py-2 max-h-64 overflow-y-auto">
                  {timeIntervalType === 'time' ? (
                    ['1s', '5s', '10s', '15s', '30s', '1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '1D', '1W', '1M'].map((interval) => (
                      <div key={interval} className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm" onClick={() => setSelectedIntervalWithHistory(interval)}>
                        {interval}
                      </div>
                    ))
                  ) : (
                    ['Range', 'Tick', 'Volume', 'Renko', 'Line Break', 'Kagi', 'Point & Figure'].map((type) => (
                      <div key={type} className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm">
                        {type}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 relative" onClick={() => setShowChartMenu(!showChartMenu)}>
            <CandlestickChart className="w-4 h-4" />
            {showChartMenu && (
              <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-xl w-64 z-50 max-h-96 overflow-y-auto">
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-blue-600 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Bars
                  </div>
                  <div className={`px-4 py-2 hover:bg-gray-50 cursor-pointer ${chartType === 'candle' ? 'bg-blue-50' : ''}`} onClick={() => { setChartTypeWithHistory('candle'); setShowChartMenu(false); }}>
                    <span className="text-sm">Candles</span>
                  </div>
                  <div className={`px-4 py-2 hover:bg-gray-50 cursor-pointer ${chartType === 'hollow' ? 'bg-blue-50' : ''}`} onClick={() => { setChartTypeWithHistory('hollow'); setShowChartMenu(false); }}>
                    <span className="text-sm">Hollow candles</span>
                  </div>
                  <div className={`px-4 py-2 hover:bg-gray-50 cursor-pointer ${chartType === 'hlc' ? 'bg-blue-50' : ''}`} onClick={() => { setChartTypeWithHistory('hlc'); setShowChartMenu(false); }}>
                    <span className="text-sm">HLC bars</span>
                  </div>
                  <div className={`px-4 py-2 hover:bg-gray-50 cursor-pointer ${chartType === 'line' ? 'bg-blue-50' : ''}`} onClick={() => { setChartTypeWithHistory('line'); setShowChartMenu(false); }}>
                    <span className="text-sm">Line</span>
                  </div>
                  <div className={`px-4 py-2 hover:bg-gray-50 cursor-pointer ${chartType === 'lineMarkers' ? 'bg-blue-50' : ''}`} onClick={() => { setChartTypeWithHistory('lineMarkers'); setShowChartMenu(false); }}>
                    <span className="text-sm">Line with markers</span>
                  </div>
                  <div className={`px-4 py-2 hover:bg-gray-50 cursor-pointer ${chartType === 'stepLine' ? 'bg-blue-50' : ''}`} onClick={() => { setChartTypeWithHistory('stepLine'); setShowChartMenu(false); }}>
                    <span className="text-sm">Step line</span>
                  </div>
                  <div className={`px-4 py-2 hover:bg-gray-50 cursor-pointer ${chartType === 'area' ? 'bg-blue-50' : ''}`} onClick={() => { setChartTypeWithHistory('area'); setShowChartMenu(false); }}>
                    <span className="text-sm">Area</span>
                  </div>
                  <div className={`px-4 py-2 hover:bg-gray-50 cursor-pointer ${chartType === 'hlcArea' ? 'bg-blue-50' : ''}`} onClick={() => { setChartTypeWithHistory('hlcArea'); setShowChartMenu(false); }}>
                    <span className="text-sm">HLC area</span>
                  </div>
                  <div className={`px-4 py-2 hover:bg-gray-50 cursor-pointer ${chartType === 'baseline' ? 'bg-blue-50' : ''}`} onClick={() => { setChartTypeWithHistory('baseline'); setShowChartMenu(false); }}>
                    <span className="text-sm">Baseline</span>
                  </div>
                  <div className={`px-4 py-2 hover:bg-gray-50 cursor-pointer ${chartType === 'columns' ? 'bg-blue-50' : ''}`} onClick={() => { setChartTypeWithHistory('columns'); setShowChartMenu(false); }}>
                    <span className="text-sm">Columns</span>
                  </div>
                  <div className={`px-4 py-2 hover:bg-gray-50 cursor-pointer ${chartType === 'highLow' ? 'bg-blue-50' : ''}`} onClick={() => { setChartTypeWithHistory('highLow'); setShowChartMenu(false); }}>
                    <span className="text-sm">High-low</span>
                  </div>
                  <div className={`px-4 py-2 hover:bg-gray-50 cursor-pointer ${chartType === 'heikinAshi' ? 'bg-blue-50' : ''}`} onClick={() => { setChartTypeWithHistory('heikinAshi'); setShowChartMenu(false); }}>
                    <span className="text-sm">Heikin Ashi</span>
                  </div>
                </div>
              </div>
            )}
          </button>
          <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 relative" onClick={() => setShowIndicatorsWithHistory(!showIndicators)}>
            <BarChart3 className="w-4 h-4" />Indicators
            {showIndicators && (
              <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-xl w-80 z-50" style={{ maxHeight: '500px' }}>
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="text-lg font-bold">Indicators</h3>
                  <X className="w-5 h-5 cursor-pointer" onClick={(e) => { e.stopPropagation(); setShowIndicators(false); }} />
                </div>
                <div className="p-4">
                  <div className="relative">
                    <input type="text" placeholder="Search" className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" />
                    <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Script Name</div>
                <div className="overflow-y-auto" style={{ maxHeight: '350px' }}>
                  {[
                    '52 Week High/Low',
                    'Accelerator Oscillator',
                    'Accumulation/Distribution',
                    'Accumulative Swing Index',
                    'Advance/Decline',
                    'Arnaud Legoux Moving Average',
                    'Aroon',
                    'Average Directional Index',
                    'Average Price',
                    'Average True Range',
                    'Awesome Oscillator',
                    'Balance of Power',
                    'Bollinger Bands',
                    'Bollinger Bands %B',
                    'Bollinger Bands Width',
                    'Chaikin Money Flow',
                    'Chaikin Oscillator',
                    'Chaikin Volatility',
                    'Chande Kroll Stop',
                    'Chande Momentum Oscillator',
                    'Chop Zone',
                    'Choppiness Index',
                    'Commodity Channel Index',
                    'Connors RSI',
                    'Coppock Curve',
                    'Detrended Price Oscillator',
                    'Directional Movement',
                    'Donchian Channels',
                    'Double EMA',
                    'Ease Of Movement',
                    "Elder's Force Index",
                    'EMA Cross',
                    'Envelopes',
                    'Fisher Transform',
                    'Guppy Multiple Moving Average',
                    'Historical Volatility',
                    'Hull Moving Average',
                    'Ichimoku Cloud',
                    'Keltner Channels',
                    'Klinger Oscillator',
                    'Know Sure Thing',
                    'Least Squares Moving Average',
                    'Linear Regression Curve',
                    'Linear Regression Slope',
                    'MA Cross',
                    'MA with EMA Cross',
                    'MACD',
                    'Majority Rule',
                    'Mass Index',
                    'McGinley Dynamic',
                    'Median Price',
                    'Momentum',
                    'Money Flow Index',
                    'Moving Average',
                    'Moving Average Adaptive',
                    'Moving Average Channel',
                    'Moving Average Double',
                    'Moving Average Exponential',
                    'Moving Average Hamming',
                    'Moving Average Multiple',
                    'Moving Average Triple',
                    'Moving Average Weighted',
                    'Net Volume',
                    'On Balance Volume',
                    'Parabolic SAR',
                    'Pivot Points Standard',
                    'Price Channel',
                    'Price Oscillator',
                    'Price Volume Trend',
                    'Rank Correlation Index',
                    'Rate Of Change',
                    'Relative Strength Index',
                    'Relative Vigor Index',
                    'Relative Volatility Index',
                    'SMI Ergodic Indicator/Oscillator',
                    'Smoothed Moving Average',
                    'Standard Deviation',
                    'Standard Error',
                    'Standard Error Bands',
                    'Stochastic',
                    'Stochastic RSI',
                    'SuperTrend',
                    'Trend Strength Index',
                    'Triple EMA',
                    'TRIX',
                    'True Strength Index',
                    'Typical Price',
                    'Ultimate Oscillator',
                    'Volatility Close-to-Close',
                    'Volatility Index',
                    'Volatility O-H-L-C',
                    'Volatility Zero Trend Close-to-Close',
                    'Volume',
                    'Volume Oscillator',
                    'Volume Profile Fixed Range',
                    'Volume Profile Visible Range',
                    'Vortex Indicator',
                    'VWAP',
                    'VWMA',
                    'Williams %R',
                    'Williams Alligator',
                    'Williams Fractal',
                    'Zig Zag'
                  ].map((indicator, i) => (
                    <div key={i} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm border-b flex items-center gap-2 ${indicator === 'Chop Zone' || indicator === 'Least Squares Moving Average' ? 'bg-gray-100' : ''}`}>
                      {(indicator === 'Chop Zone' || indicator === 'Least Squares Moving Average') && <Star className="w-4 h-4" />}
                      {indicator}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </button>
          <button className="text-sm text-gray-600 hover:text-gray-900" onClick={() => setShowSaveModal(true)}>Save</button>
          <button 
            className={`text-gray-600 hover:text-gray-900 ${currentHistoryIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleUndo}
            disabled={currentHistoryIndex === 0}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button 
            className={`text-gray-600 hover:text-gray-900 ${currentHistoryIndex === history.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleRedo}
            disabled={currentHistoryIndex === history.length - 1}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-3">
          <Eye className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
          <Camera className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-16 border-r flex flex-col items-center py-6 gap-6 bg-gray-50">
          <Plus className="w-5 h-5 text-blue-500 cursor-pointer" />
          <Pencil className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
          <Clock className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
          <X className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
          <Layers className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
          <MapPin className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
          <Smile className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
          <Ruler className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
          <ZoomIn className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
        </div>

        <div className="flex-1 relative bg-white">
          <svg className="w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="none">
            <defs>
              <clipPath id="chartClip">
                <rect x="20" y="20" width="880" height="420" />
              </clipPath>
            </defs>
            
            {/* Grid */}
            {Array.from({ length: 8 }).map((_, i) => {
              const y = 20 + (420 / 7) * i;
              return <line key={i} x1="20" y1={y} x2="900" y2={y} stroke="#f0f0f0" strokeWidth="1" />;
            })}
            
            <g clipPath="url(#chartClip)">
              {(chartType === 'candle' || chartType === 'hollow' || chartType === 'hlc' || chartType === 'highLow' || chartType === 'heikinAshi') ? (
                candleData.map((candle, i) => {
                  const isGreen = candle.close >= candle.open;
                  const color = isGreen ? '#22c55e' : '#ef4444';
                  
                  const x = 20 + (i / candleData.length) * 880 + (880 / candleData.length) / 2;
                  const candleWidth = Math.min((880 / candleData.length) * 0.7, 12);
                  
                  const highY = 20 + ((yMax - candle.high) / yRange) * 420;
                  const lowY = 20 + ((yMax - candle.low) / yRange) * 420;
                  const openY = 20 + ((yMax - candle.open) / yRange) * 420;
                  const closeY = 20 + ((yMax - candle.close) / yRange) * 420;
                  
                  const bodyTop = Math.min(openY, closeY);
                  const bodyHeight = Math.max(Math.abs(closeY - openY), 1);
                  
                  if (chartType === 'hollow') {
                    return (
                      <g key={i} onMouseEnter={() => { setHoveredCandle(candle); setHoveredIndex(i); }} onMouseLeave={() => { setHoveredCandle(null); setHoveredIndex(null); }} style={{ cursor: 'pointer' }}>
                        <line x1={x} y1={highY} x2={x} y2={lowY} stroke={color} strokeWidth="1.5" />
                        <rect x={x - candleWidth / 2} y={bodyTop} width={candleWidth} height={bodyHeight} fill={isGreen ? 'transparent' : color} stroke={color} strokeWidth="1.5" />
                      </g>
                    );
                  } else if (chartType === 'hlc') {
                    return (
                      <g key={i} onMouseEnter={() => { setHoveredCandle(candle); setHoveredIndex(i); }} onMouseLeave={() => { setHoveredCandle(null); setHoveredIndex(null); }} style={{ cursor: 'pointer' }}>
                        <line x1={x} y1={highY} x2={x} y2={lowY} stroke={color} strokeWidth="2" />
                        <line x1={x - candleWidth / 2} y1={closeY} x2={x} y2={closeY} stroke={color} strokeWidth="2" />
                      </g>
                    );
                  } else if (chartType === 'highLow') {
                    return (
                      <g key={i} onMouseEnter={() => { setHoveredCandle(candle); setHoveredIndex(i); }} onMouseLeave={() => { setHoveredCandle(null); setHoveredIndex(null); }} style={{ cursor: 'pointer' }}>
                        <line x1={x} y1={highY} x2={x} y2={lowY} stroke={color} strokeWidth="3" />
                        <circle cx={x} cy={highY} r="2" fill={color} />
                        <circle cx={x} cy={lowY} r="2" fill={color} />
                      </g>
                    );
                  } else if (chartType === 'heikinAshi') {
                    const haClose = (candle.open + candle.high + candle.low + candle.close) / 4;
                    const haOpen = i > 0 ? (candleData[i-1].open + candleData[i-1].close) / 2 : (candle.open + candle.close) / 2;
                    const haHigh = Math.max(candle.high, haOpen, haClose);
                    const haLow = Math.min(candle.low, haOpen, haClose);
                    const haIsGreen = haClose >= haOpen;
                    const haColor = haIsGreen ? '#22c55e' : '#ef4444';
                    const haHighY = 20 + ((yMax - haHigh) / yRange) * 420;
                    const haLowY = 20 + ((yMax - haLow) / yRange) * 420;
                    const haOpenY = 20 + ((yMax - haOpen) / yRange) * 420;
                    const haCloseY = 20 + ((yMax - haClose) / yRange) * 420;
                    const haBodyTop = Math.min(haOpenY, haCloseY);
                    const haBodyHeight = Math.max(Math.abs(haCloseY - haOpenY), 1);
                    return (
                      <g key={i} onMouseEnter={() => { setHoveredCandle(candle); setHoveredIndex(i); }} onMouseLeave={() => { setHoveredCandle(null); setHoveredIndex(null); }} style={{ cursor: 'pointer' }}>
                        <line x1={x} y1={haHighY} x2={x} y2={haLowY} stroke={haColor} strokeWidth="1.5" />
                        <rect x={x - candleWidth / 2} y={haBodyTop} width={candleWidth} height={haBodyHeight} fill={haColor} />
                      </g>
                    );
                  }
                  
                  return (
                    <g key={i} onMouseEnter={() => { setHoveredCandle(candle); setHoveredIndex(i); }} onMouseLeave={() => { setHoveredCandle(null); setHoveredIndex(null); }} style={{ cursor: 'pointer' }}>
                      <line x1={x} y1={highY} x2={x} y2={lowY} stroke={color} strokeWidth="1.5" />
                      <rect x={x - candleWidth / 2} y={bodyTop} width={candleWidth} height={bodyHeight} fill={color} />
                    </g>
                  );
                })
              ) : chartType === 'line' || chartType === 'lineMarkers' || chartType === 'stepLine' ? (
                <>
                  {chartType === 'stepLine' ? (
                    <polyline
                      points={candleData.map((candle, i) => {
                        const x = 20 + (i / candleData.length) * 880 + (880 / candleData.length) / 2;
                        const y = 20 + ((yMax - candle.close) / yRange) * 420;
                        const nextX = i < candleData.length - 1 ? 20 + ((i + 1) / candleData.length) * 880 + (880 / candleData.length) / 2 : x;
                        return `${x},${y} ${nextX},${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                  ) : (
                    <polyline
                      points={candleData.map((candle, i) => {
                        const x = 20 + (i / candleData.length) * 880 + (880 / candleData.length) / 2;
                        const y = 20 + ((yMax - candle.close) / yRange) * 420;
                        return `${x},${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                  )}
                  {chartType === 'lineMarkers' && candleData.map((candle, i) => {
                    const x = 20 + (i / candleData.length) * 880 + (880 / candleData.length) / 2;
                    const y = 20 + ((yMax - candle.close) / yRange) * 420;
                    return <circle key={i} cx={x} cy={y} r="3" fill="#3b82f6" />;
                  })}
                </>
              ) : (chartType === 'area' || chartType === 'hlcArea' || chartType === 'baseline') ? (
                <>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {chartType === 'baseline' && (
                    <line x1="20" y1={20 + ((yMax - candleData[0].close) / yRange) * 420} x2="900" y2={20 + ((yMax - candleData[0].close) / yRange) * 420} stroke="#999" strokeWidth="1" strokeDasharray="3 3" />
                  )}
                  <polygon
                    points={`20,440 ${candleData.map((candle, i) => {
                      const x = 20 + (i / candleData.length) * 880 + (880 / candleData.length) / 2;
                      const y = 20 + ((yMax - (chartType === 'hlcArea' ? candle.high : candle.close)) / yRange) * 420;
                      return `${x},${y}`;
                    }).join(' ')} 900,440`}
                    fill="url(#areaGradient)"
                  />
                  <polyline
                    points={candleData.map((candle, i) => {
                      const x = 20 + (i / candleData.length) * 880 + (880 / candleData.length) / 2;
                      const y = 20 + ((yMax - (chartType === 'hlcArea' ? candle.high : candle.close)) / yRange) * 420;
                      return `${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                </>
              ) : chartType === 'columns' ? (
                candleData.map((candle, i) => {
                  const isGreen = candle.close >= candle.open;
                  const color = isGreen ? '#22c55e' : '#ef4444';
                  const x = 20 + (i / candleData.length) * 880 + (880 / candleData.length) / 2;
                  const candleWidth = Math.min((880 / candleData.length) * 0.7, 12);
                  const closeY = 20 + ((yMax - candle.close) / yRange) * 420;
                  const baseY = 440;
                  const barHeight = baseY - closeY;
                  return (
                    <rect key={i} x={x - candleWidth / 2} y={closeY} width={candleWidth} height={barHeight} fill={color} onMouseEnter={() => { setHoveredCandle(candle); setHoveredIndex(i); }} onMouseLeave={() => { setHoveredCandle(null); setHoveredIndex(null); }} style={{ cursor: 'pointer' }} />
                  );
                })
              ) : null}
            </g>
            
            {/* Time labels */}
            {Array.from({ length: 5 }).map((_, i) => {
              const index = Math.floor((candleData.length / 4) * i);
              if (index >= candleData.length) return null;
              const x = 20 + (index / candleData.length) * 880 + (880 / candleData.length) / 2;
              return (
                <text key={i} x={x} y="470" textAnchor="middle" fontSize="11" fill="#666">
                  {candleData[index].time}
                </text>
              );
            })}
          </svg>

          {hoveredCandle && hoveredIndex !== null && (
            <div 
              className="absolute bg-blue-600 text-white rounded shadow-lg p-2 text-xs z-20 pointer-events-none"
              style={{ 
                left: `${(hoveredIndex / candleData.length) * 100}%`, 
                top: '50px',
                transform: 'translateX(-50%)'
              }}
            >
              <div className="font-bold whitespace-nowrap">
                {hoveredCandle.close.toFixed(2)} ({hoveredCandle.close >= hoveredCandle.open ? '+' : ''}{((hoveredCandle.close - hoveredCandle.open) / hoveredCandle.open * 100).toFixed(2)}%)
              </div>
              <div className="opacity-90">Vol {(hoveredCandle.volume / 1000).toFixed(1)}K</div>
            </div>
          )}

          <div className="absolute right-0 top-0 bottom-0 w-24 border-l flex flex-col justify-between py-6 text-xs text-right pr-3 bg-white">
            {Array.from({ length: 8 }).map((_, i) => {
              const price = yMax - (yRange * i / 7);
              return (
                <div key={i} className={Math.abs(price - currentPrice) < yRange * 0.02 ? 'bg-blue-600 text-white px-2 py-0.5 rounded' : 'text-gray-600'}>
                  {price.toFixed(2)}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowSaveModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 flex overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-4">Trade better with our dynamic trading charts</h3>
              <div className="space-y-4">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="text-sm mb-2">BUY</div>
                  <div className="text-xs opacity-80">Advanced charting tools</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="text-sm mb-2">SELL</div>
                  <div className="text-xs opacity-80">Real-time data</div>
                </div>
              </div>
            </div>
            <div className="w-1/2 p-8 flex flex-col justify-center">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={() => setShowSaveModal(false)}>
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold mb-2">Save and access your Chart Layouts anytime</h2>
              <p className="text-gray-600 mb-8">Simply sign in or open an account.</p>
              <div className="space-y-4">
                <button className="w-full py-3 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 font-semibold">
                  Log in to Nuvama
                </button>
                <button className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold">
                  Open Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockChart;