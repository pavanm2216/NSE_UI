import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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

const StockChartZoom: React.FC<StockChartProps> = ({ data, currentPrice }) => {
  const [candleData, setCandleData] = useState<Candle[]>([]);
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [chartType, setChartType] = useState<'candle' | 'hollow' | 'hlc' | 'line' | 'lineMarkers' | 'stepLine' | 'area' | 'hlcArea' | 'baseline' | 'columns' | 'highLow' | 'heikinAshi'>('candle');
  const [selectedInterval, setSelectedInterval] = useState('5m');
  const [showChartMenu, setShowChartMenu] = useState(false);
  const [showIndicators, setShowIndicators] = useState(false);
  const [activeIndicators, setActiveIndicators] = useState<string[]>([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);

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

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoomLevel(prev => Math.max(0.5, Math.min(5, prev * delta)));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX - panOffset);
  }, [panOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset(e.clientX - dragStart);
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const visibleCandles = useMemo(() => {
    const totalCandles = candleData.length;
    const visibleCount = Math.floor(totalCandles / zoomLevel);
    const maxOffset = Math.max(0, totalCandles - visibleCount);
    const offsetIndex = Math.max(0, Math.min(maxOffset, Math.floor(-panOffset / (880 / visibleCount))));
    return candleData.slice(offsetIndex, offsetIndex + visibleCount);
  }, [candleData, zoomLevel, panOffset]);

  if (visibleCandles.length === 0) return null;

  const minPrice = Math.min(...visibleCandles.map(c => c.low));
  const maxPrice = Math.max(...visibleCandles.map(c => c.high));
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
            <button key={interval} className={`text-sm px-3 py-1 rounded ${selectedInterval === interval ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`} onClick={() => setSelectedInterval(interval)}>
              {interval}
            </button>
          ))}
          <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 relative" onClick={() => setShowChartMenu(!showChartMenu)}>
            <CandlestickChart className="w-4 h-4" />
            {showChartMenu && (
              <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-xl w-64 z-50 max-h-96 overflow-y-auto">
                <div className="py-2">
                  {['candle', 'hollow', 'hlc', 'line', 'lineMarkers', 'stepLine', 'area', 'hlcArea', 'baseline', 'columns', 'highLow', 'heikinAshi'].map((type) => (
                    <div key={type} className={`px-4 py-2 hover:bg-gray-50 cursor-pointer ${chartType === type ? 'bg-blue-50' : ''}`} onClick={() => { setChartType(type as any); setShowChartMenu(false); }}>
                      <span className="text-sm capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </button>
          <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 relative" onClick={() => setShowIndicators(!showIndicators)}>
            <BarChart3 className="w-4 h-4" />Indicators
            {showIndicators && (
              <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-xl w-80 z-50 max-h-96 overflow-y-auto">
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
                    '52 Week High/Low', 'Accelerator Oscillator', 'Accumulation/Distribution', 'Accumulative Swing Index', 'Advance/Decline',
                    'Arnaud Legoux Moving Average', 'Aroon', 'Average Directional Index', 'Average Price', 'Average True Range',
                    'Awesome Oscillator', 'Balance of Power', 'Bollinger Bands', 'Bollinger Bands %B', 'Bollinger Bands Width',
                    'Chaikin Money Flow', 'Chaikin Oscillator', 'Chaikin Volatility', 'Chande Kroll Stop', 'Chande Momentum Oscillator',
                    'Chop Zone', 'Choppiness Index', 'Commodity Channel Index', 'Connors RSI', 'Coppock Curve',
                    'Detrended Price Oscillator', 'Directional Movement', 'Donchian Channels', 'Double EMA', 'Ease Of Movement',
                    "Elder's Force Index", 'EMA Cross', 'Envelopes', 'Fisher Transform', 'Guppy Multiple Moving Average',
                    'Historical Volatility', 'Hull Moving Average', 'Ichimoku Cloud', 'Keltner Channels', 'Klinger Oscillator',
                    'Know Sure Thing', 'Least Squares Moving Average', 'Linear Regression Curve', 'Linear Regression Slope', 'MA Cross',
                    'MA with EMA Cross', 'MACD', 'Majority Rule', 'Mass Index', 'McGinley Dynamic',
                    'Median Price', 'Momentum', 'Money Flow Index', 'Moving Average', 'Moving Average Adaptive',
                    'Moving Average Channel', 'Moving Average Double', 'Moving Average Exponential', 'Moving Average Hamming', 'Moving Average Multiple',
                    'Moving Average Triple', 'Moving Average Weighted', 'Net Volume', 'On Balance Volume', 'Parabolic SAR',
                    'Pivot Points Standard', 'Price Channel', 'Price Oscillator', 'Price Volume Trend', 'Rank Correlation Index',
                    'Rate Of Change', 'Relative Strength Index', 'Relative Vigor Index', 'Relative Volatility Index', 'SMI Ergodic Indicator/Oscillator',
                    'Smoothed Moving Average', 'Standard Deviation', 'Standard Error', 'Standard Error Bands', 'Stochastic',
                    'Stochastic RSI', 'SuperTrend', 'Trend Strength Index', 'Triple EMA', 'TRIX',
                    'True Strength Index', 'Typical Price', 'Ultimate Oscillator', 'Volatility Close-to-Close', 'Volatility Index',
                    'Volatility O-H-L-C', 'Volatility Zero Trend Close-to-Close', 'Volume', 'Volume Oscillator', 'Volume Profile Fixed Range',
                    'Volume Profile Visible Range', 'Vortex Indicator', 'VWAP', 'VWMA', 'Williams %R',
                    'Williams Alligator', 'Williams Fractal', 'Zig Zag'
                  ].map((indicator, i) => (
                    <div key={i} className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm border-b" onClick={() => {
                      if (!activeIndicators.includes(indicator)) {
                        setActiveIndicators([...activeIndicators, indicator]);
                      }
                      setShowIndicators(false);
                    }}>
                      {indicator}
                    </div>
                  ))}
                </div>
              </div>
            )}
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
          <ZoomIn className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
        </div>

        <div className="flex-1 relative bg-white" onWheel={handleWheel}>
          <div className="h-full flex flex-col">
            <svg className={`w-full ${activeIndicators.length > 0 ? 'h-2/3' : 'h-full'}`} viewBox="0 0 1000 500" preserveAspectRatio="none" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
            <defs>
              <clipPath id="chartClip">
                <rect x="20" y="20" width="880" height="420" />
              </clipPath>
            </defs>
            
            {Array.from({ length: 8 }).map((_, i) => {
              const y = 20 + (420 / 7) * i;
              return <line key={i} x1="20" y1={y} x2="900" y2={y} stroke="#f0f0f0" strokeWidth="1" />;
            })}
            
            <g clipPath="url(#chartClip)">
              {visibleCandles.map((candle, i) => {
                const isGreen = candle.close >= candle.open;
                const color = isGreen ? '#22c55e' : '#ef4444';
                const x = 20 + (i / visibleCandles.length) * 880 + (880 / visibleCandles.length) / 2;
                const candleWidth = Math.min((880 / visibleCandles.length) * 0.7, 12);
                const highY = 20 + ((yMax - candle.high) / yRange) * 420;
                const lowY = 20 + ((yMax - candle.low) / yRange) * 420;
                const openY = 20 + ((yMax - candle.open) / yRange) * 420;
                const closeY = 20 + ((yMax - candle.close) / yRange) * 420;
                const bodyTop = Math.min(openY, closeY);
                const bodyHeight = Math.max(Math.abs(closeY - openY), 1);
                
                return (
                  <g key={i} onMouseEnter={() => { setHoveredCandle(candle); setHoveredIndex(i); }} onMouseLeave={() => { setHoveredCandle(null); setHoveredIndex(null); }} style={{ cursor: 'pointer' }}>
                    <line x1={x} y1={highY} x2={x} y2={lowY} stroke={color} strokeWidth="1.5" />
                    <rect x={x - candleWidth / 2} y={bodyTop} width={candleWidth} height={bodyHeight} fill={color} />
                  </g>
                );
              })}
            </g>
            
            {Array.from({ length: 5 }).map((_, i) => {
              const index = Math.floor((visibleCandles.length / 4) * i);
              if (index >= visibleCandles.length) return null;
              const x = 20 + (index / visibleCandles.length) * 880 + (880 / visibleCandles.length) / 2;
              return (
                <text key={i} x={x} y="470" textAnchor="middle" fontSize="11" fill="#666">
                  {visibleCandles[index].time}
                </text>
              );
            })}
          </svg>
          </div>

          {activeIndicators.length > 0 && (
            <div className="h-1/3 border-t flex flex-col">
              {activeIndicators.map((indicator, idx) => (
                <div key={idx} className="flex-1 border-b relative">
                  <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
                    <span className="text-xs font-semibold">{indicator}</span>
                    <span className="text-xs text-blue-600">1.00</span>
                    <button className="text-xs text-gray-400 hover:text-gray-600" onClick={() => setActiveIndicators(activeIndicators.filter(i => i !== indicator))}>×</button>
                  </div>
                  <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
                    <line x1="0" y1="50" x2="1000" y2="50" stroke="#e0e0e0" strokeWidth="1" />
                    <polyline
                      points={visibleCandles.map((_, i) => {
                        const x = 20 + (i / visibleCandles.length) * 880 + (880 / visibleCandles.length) / 2;
                        const y = 30 + Math.sin(i / 5) * 20 + Math.random() * 10;
                        return `${x},${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-between py-2 text-xs text-gray-600">
                    <div>2.50</div>
                    <div>1.00</div>
                    <div>0.00</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hoveredCandle && hoveredIndex !== null && (
            <div className="absolute bg-blue-600 text-white rounded shadow-lg p-2 text-xs z-20 pointer-events-none" style={{ left: `${(hoveredIndex / visibleCandles.length) * 100}%`, top: '50px', transform: 'translateX(-50%)' }}>
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
    </div>
  );
};

export default StockChartZoom;
