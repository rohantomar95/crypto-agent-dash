
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CandleData } from '@/hooks/useTradeData';

interface CandlestickChartProps {
  data: CandleData[];
  latestCandle: CandleData | null;
  showMarker: boolean;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ data, latestCandle, showMarker }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Helper to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  // Calculate chart dimensions and scales
  const calculateChartDimensions = () => {
    if (!data.length || !chartRef.current) return null;
    
    const prices = data.flatMap(candle => [candle.high, candle.low]);
    const maxPrice = Math.max(...prices) * 1.01;
    const minPrice = Math.min(...prices) * 0.99;
    const priceRange = maxPrice - minPrice;
    
    const chartWidth = chartRef.current.clientWidth;
    const chartHeight = chartRef.current.clientHeight - 40; // Account for labels
    
    const candleWidth = Math.min(30, (chartWidth / data.length) * 0.8);
    const gap = (chartWidth / data.length) - candleWidth;
    
    const pixelPerDollar = chartHeight / priceRange;
    
    return {
      chartHeight,
      chartWidth,
      candleWidth,
      gap,
      maxPrice,
      minPrice,
      priceRange,
      pixelPerDollar
    };
  };

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold crypto-gradient-text">
            BTC-USD Live Chart
          </CardTitle>
          {latestCandle && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Last Price:</span>
              <span className={`font-mono text-lg font-bold ${latestCandle.close > latestCandle.open ? 'text-crypto-green' : 'text-crypto-red'}`}>
                {formatPrice(latestCandle.close)}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-4">
        <div className="w-full h-72 relative" ref={chartRef}>
          {/* Price axis */}
          <div className="absolute top-0 right-0 h-full w-12 flex flex-col justify-between text-xs text-muted-foreground pr-1 z-10">
            {[0, 1, 2, 3, 4].map((i) => {
              const dimensions = calculateChartDimensions();
              if (!dimensions) return null;
              const { maxPrice, priceRange } = dimensions;
              const price = maxPrice - (i * priceRange / 4);
              return (
                <div key={i} className="font-mono">{formatPrice(price)}</div>
              );
            })}
          </div>
          
          {/* Candlesticks */}
          <div className="absolute inset-0 flex items-end pr-14">
            <div className="flex-1 h-full relative flex items-end">
              {data.map((candle, index) => {
                const dimensions = calculateChartDimensions();
                if (!dimensions) return null;
                
                const { chartHeight, candleWidth, gap, maxPrice, pixelPerDollar } = dimensions;
                
                // Calculate candle position and size
                const x = index * (candleWidth + gap);
                const candleHeight = Math.abs(candle.open - candle.close) * pixelPerDollar;
                const y = chartHeight - ((Math.max(candle.open, candle.close) - (maxPrice - chartHeight / pixelPerDollar)) * pixelPerDollar);
                
                // Calculate wick position and size
                const wickHeight = (candle.high - candle.low) * pixelPerDollar;
                const wickY = chartHeight - ((candle.high - (maxPrice - chartHeight / pixelPerDollar)) * pixelPerDollar);
                
                // Is this an up or down candle?
                const isUp = candle.close > candle.open;
                
                // Apply animation only to the latest candle
                const isLatest = index === data.length - 1;
                
                return (
                  <div key={index} className="absolute" style={{ 
                    left: `${x}px`, 
                    width: `${candleWidth}px`,
                  }}>
                    {/* Candle wick */}
                    <div 
                      className={`absolute left-1/2 w-[1px] bg-foreground opacity-60 ${isLatest ? 'animate-candle-appear' : ''}`}
                      style={{ 
                        height: `${wickHeight}px`, 
                        bottom: `${chartHeight - wickY - wickHeight}px`,
                        transform: 'translateX(-50%)',
                      }}
                    />
                    
                    {/* Candle body */}
                    <div 
                      className={`absolute ${isUp ? 'candle-up' : 'candle-down'} ${isLatest ? 'animate-candle-appear' : ''}`}
                      style={{ 
                        height: `${Math.max(1, candleHeight)}px`, 
                        bottom: `${chartHeight - y - candleHeight}px`,
                        width: '100%',
                        transformOrigin: 'bottom',
                      }}
                    />
                  </div>
                );
              })}
              
              {/* Trading marker */}
              {showMarker && (
                <div className="absolute right-16 top-8 flex items-center animate-fade-in-right">
                  <div className="h-3 w-3 rounded-full bg-accent animate-marker-pulse mr-2" />
                  <span className="text-accent text-xs font-semibold">Trading Occurred</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Time axis - simplified */}
          <div className="absolute bottom-0 left-0 right-14 flex justify-between text-xs text-muted-foreground">
            {[0, 1, 2].map((i) => {
              if (!data.length) return null;
              const index = i === 0 ? 0 : i === 1 ? Math.floor(data.length / 2) : data.length - 1;
              const time = data[index]?.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
              return (
                <div key={i} className="font-mono">{time}</div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandlestickChart;
