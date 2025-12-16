export interface Strategy {
  id: string;
  name: string;
  author: string;
  type: 'Grid' | 'DCA' | 'Rebalancing' | 'Martingale' | 'AI Momentum';
  roi: number;
  pnl: number;
  copiers: number;
  runtime: string; // e.g., "12D 5H"
  minInvestment: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  asset: string; // e.g., "BTC/USDT", "NVDA/USD"
  description: string;
  chartData: { time: string; value: number }[];
  performanceFee: number; // 0.2 means 20%
}

export interface UserPortfolio {
  balance: number;
  activeStrategies: {
    strategyId: string;
    investedAmount: number;
    currentValue: number;
    status: 'Running' | 'Paused';
    startTime: number;
  }[];
}

export type ViewState = 'MARKETPLACE' | 'MY_BOTS' | 'CREATE_STRATEGY' | 'WALLET';

export interface AIAnalysisResult {
  summary: string;
  pros: string[];
  cons: string[];
  suitability: string;
}