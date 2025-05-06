
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
  targetPortfolioValue?: number; // Add target value for smooth animation
}

export interface Transaction {
  id: string;
  timestamp: Date;
  action: TradeAction;
  amount: number;
  price: number;
}

// Sample agent names with enhanced color scheme and realistic trading names
const agentInfo = [
  { name: "MetropolitanLandfowl", color: "#9b87f5" },  // Primary Purple
  { name: "BetterEagle8900", color: "#7E69AB" },      // Secondary Purple
  { name: "EmbarrassedAnteater5", color: "#6E59A5" }, // Tertiary Purple
  { name: "JealousDove3996", color: "#0EA5E9" },      // Ocean Blue - this is "Your Agent"
  { name: "YammeringJunglefowl7", color: "#33C3F0" }  // Sky Blue
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
      transactions: [],
      targetPortfolioValue: 100000
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
  
  // Effect for smooth portfolio value animation
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setAgents(prevAgents => prevAgents.map(agent => {
        if (agent.targetPortfolioValue === undefined || agent.portfolioValue === agent.targetPortfolioValue) {
          return agent;
        }
        
        // Move 10% closer to target value each frame for smooth animation
        const step = (agent.targetPortfolioValue - agent.portfolioValue) * 0.1;
        const newValue = agent.portfolioValue + step;
        
        return {
          ...agent,
          portfolioValue: Math.abs(newValue - agent.targetPortfolioValue) < 100 
            ? agent.targetPortfolioValue 
            : newValue
        };
      }));
    }, 50); // Update animation at 50ms intervals for smooth motion
    
    return () => clearInterval(animationInterval);
  }, []);
  
  // Update trades every 2 seconds
  useEffect(() => {
    const tradeInterval = setInterval(() => {
      // Update agent actions
      setAgents(prevAgents => {
        // Sort agents by current portfolio value to determine ranking
        const sortedAgents = [...prevAgents].sort((a, b) => b.portfolioValue - a.portfolioValue);
        const positionMap = new Map(sortedAgents.map((agent, index) => [agent.id, index]));
        
        return prevAgents.map(agent => {
          // Decide action more realistically - with bias
          // JealousDove3996 is "Your Agent" with a bias toward shorting
          let action: TradeAction;
          const isYourAgent = agent.name === "JealousDove3996";
          
          if (isYourAgent) {
            // Your agent has a bias toward shorting
            const randNum = Math.random();
            action = randNum < 0.6 ? 'short' : (randNum < 0.9 ? 'long' : 'hold');
          } else if (agent.name === "EmbarrassedAnteater5" || agent.name === "YammeringJunglefowl7") {
            // These agents have a bias toward longing
            const randNum = Math.random();
            action = randNum < 0.6 ? 'long' : (randNum < 0.9 ? 'short' : 'hold');
          } else {
            // Others are more balanced
            const actions: TradeAction[] = ['long', 'short', 'hold'];
            action = actions[Math.floor(Math.random() * actions.length)];
          }
          
          // Calculate amount (10-20% of cash balance)
          const amount = action !== 'hold' 
            ? agent.cashBalance * (Math.random() * 0.1 + 0.1) 
            : 0;
          
          // Calculate new portfolio value with more significant changes
          // More dramatic changes (5-10%) for a more visible race
          const profitLossFactor = (Math.random() * 0.10) - 0.04; // -4% to +10% 
          
          // Higher agents have a better chance of making profit (to create more position changes)
          const position = positionMap.get(agent.id) || 0;
          const positionBonus = position < 2 ? 0.01 : position > 3 ? -0.01 : 0;
          const adjustedFactor = profitLossFactor + positionBonus;
          
          // Calculate profit/loss and new target portfolio value
          const profitLoss = agent.portfolioValue * adjustedFactor;
          const newTargetValue = agent.portfolioValue + profitLoss;
          
          // Calculate new cash balance
          const newCashBalance = action === 'hold' 
            ? agent.cashBalance 
            : agent.cashBalance - amount;
          
          // Create new transaction with realistic amount ranges
          const newTransaction = {
            id: `${agent.id}-${Date.now()}`,
            timestamp: new Date(),
            action,
            amount: action !== 'hold' ? Math.floor(9000 + Math.random() * 42000) : 0, // Amount between $9,000 and $51,000
            price: candles.length > 0 ? candles[candles.length - 1].close : initialPrice
          };
          
          return {
            ...agent,
            targetPortfolioValue: newTargetValue,
            cashBalance: newCashBalance,
            lastAction: action,
            lastAmount: newTransaction.amount,
            profitLoss,
            transactions: [newTransaction, ...agent.transactions.slice(0, 9)] // Keep only the 10 most recent
          };
        });
      });
      
    }, 2000); // Trade every 2 seconds
    
    return () => clearInterval(tradeInterval);
  }, [candles]);
  
  // Generate new candles less frequently (every 10 seconds)
  useEffect(() => {
    const candleInterval = setInterval(() => {
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
      
    }, 10000); // New candle every 10 seconds
    
    return () => clearInterval(candleInterval);
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
