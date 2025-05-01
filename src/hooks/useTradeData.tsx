
import { useState, useEffect } from 'react';

// Define our data types
export type TradeAction = 'long' | 'short' | 'hold';

export interface AgentData {
  id: number;
  name: string;
  color: string;
  portfolioValue: number;
  cashBalance: number;
  lastAction: TradeAction;
  lastAmount: number;
  profitLoss: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  timestamp: Date;
  action: TradeAction;
  amount: number;
  price: number;
}

// Sample agent names and colors
const agentInfo = [
  { name: "AlphaBot", color: "#9b87f5" },
  { name: "TradeMaster", color: "#0EA5E9" },
  { name: "QuantumAI", color: "#F97316" },
  { name: "NexusTrader", color: "#10B981" },
  { name: "CryptoOracle", color: "#EF4444" }
];

// Generate random price between min and max
const randomPrice = (min: number, max: number) => Math.random() * (max - min) + min;

// Generate initial BTC price (example: around $70,000)
const initialPrice = 70000 + (Math.random() * 2000 - 1000);

export const useTradeData = () => {
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [latestCandle, setLatestCandle] = useState<CandleData | null>(null);
  const [showMarker, setShowMarker] = useState(false);
  
  // Initialize data
  useEffect(() => {
    // Initialize agents
    const initialAgents: AgentData[] = agentInfo.map((info, index) => ({
      id: index + 1,
      name: info.name,
      color: info.color,
      portfolioValue: 100000,
      cashBalance: 100000,
      lastAction: 'hold' as TradeAction,
      lastAmount: 0,
      profitLoss: 0,
      transactions: []
    }));
    
    setAgents(initialAgents);
    
    // Initialize candles with some historical data
    const now = new Date();
    const historicalCandles = Array.from({ length: 20 }).map((_, i) => {
      const timestamp = new Date(now.getTime() - (20 - i) * 10000);
      const open = i === 0 ? initialPrice : candles[i - 1]?.close || initialPrice;
      const close = open * (1 + (Math.random() * 0.02 - 0.01));
      const high = Math.max(open, close) * (1 + Math.random() * 0.005);
      const low = Math.min(open, close) * (1 - Math.random() * 0.005);
      
      return {
        timestamp,
        open,
        high,
        low,
        close,
        volume: Math.random() * 100 + 50
      };
    });
    
    setCandles(historicalCandles);
  }, []);
  
  // Update data every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Generate new candle
      const previousCandle = candles[candles.length - 1];
      const now = new Date();
      
      if (!previousCandle) return;
      
      const open = previousCandle.close;
      const close = open * (1 + (Math.random() * 0.04 - 0.02));
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      
      const newCandle = {
        timestamp: now,
        open,
        high,
        low,
        close,
        volume: Math.random() * 100 + 50
      };
      
      setLatestCandle(newCandle);
      setCandles(prev => [...prev.slice(-19), newCandle]);
      
      // Show marker briefly
      setShowMarker(true);
      setTimeout(() => setShowMarker(false), 3000);
      
      // Update agent actions
      setAgents(prevAgents => prevAgents.map(agent => {
        // Decide on action randomly
        const actions: TradeAction[] = ['long', 'short', 'hold'];
        const action = actions[Math.floor(Math.random() * actions.length)];
        
        // Calculate amount (10-20% of cash balance)
        const amount = action !== 'hold' 
          ? agent.cashBalance * (Math.random() * 0.1 + 0.1) 
          : 0;
          
        // Calculate new portfolio value with some randomization
        const profitLossFactor = (Math.random() * 0.06) - 0.03; // -3% to +3%
        const profitLoss = agent.portfolioValue * profitLossFactor;
        const newPortfolioValue = agent.portfolioValue + profitLoss;
        
        // Calculate new cash balance
        const newCashBalance = action === 'hold' 
          ? agent.cashBalance 
          : agent.cashBalance - amount;
          
        // Create new transaction
        const newTransaction = {
          id: `${agent.id}-${Date.now()}`,
          timestamp: new Date(),
          action,
          amount,
          price: close
        };
        
        return {
          ...agent,
          portfolioValue: newPortfolioValue,
          cashBalance: newCashBalance,
          lastAction: action,
          lastAmount: amount,
          profitLoss,
          transactions: [newTransaction, ...agent.transactions.slice(0, 9)] // Keep only the 10 most recent
        };
      }));
      
    }, 10000);
    
    return () => clearInterval(interval);
  }, [candles]);
  
  return { agents, candles, latestCandle, showMarker };
};

export interface CandleData {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
