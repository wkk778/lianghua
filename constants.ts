import { Strategy } from "./types";

// Helper to generate mock chart data
const generateChartData = (startValue: number, volatility: number, trend: number) => {
  let currentValue = startValue;
  return Array.from({ length: 20 }, (_, i) => {
    const change = (Math.random() - 0.5) * volatility + trend;
    currentValue = currentValue * (1 + change);
    return {
      time: `Day ${i + 1}`,
      value: currentValue
    };
  });
};

export const MOCK_STRATEGIES: Strategy[] = [
  {
    id: 's1',
    name: '茅台价值网格',
    author: '陈虚谷精选',
    type: 'Grid',
    roi: 12.4,
    pnl: 14502.20,
    copiers: 3421,
    runtime: '45天',
    minInvestment: 5000,
    riskLevel: 'Low',
    asset: '600519.SH',
    description: '针对贵州茅台设计的长期价值网格，在核心资产震荡区间内反复低吸高抛，摊薄成本。',
    chartData: generateChartData(10000, 0.02, 0.005),
    performanceFee: 0.20
  },
  {
    id: 's2',
    name: '红利低波定投',
    author: '稳健派',
    type: 'DCA',
    roi: 8.5,
    pnl: 3205.50,
    copiers: 8900,
    runtime: '120天',
    minInvestment: 1000,
    riskLevel: 'Low',
    asset: '510880.SH',
    description: '定期买入红利低波ETF，由高股息国企组成，适合防御性资产配置，穿越牛熊。',
    chartData: generateChartData(10000, 0.01, 0.002),
    performanceFee: 0.10
  },
  {
    id: 's3',
    name: '科创50动量增强',
    author: '量化先锋',
    type: 'AI Momentum',
    roi: 45.2,
    pnl: 45000.00,
    copiers: 1205,
    runtime: '15天',
    minInvestment: 10000,
    riskLevel: 'High',
    asset: '588000.SH',
    description: 'AI 模型驱动的半导体与硬科技趋势追踪策略，利用动量指标捕捉主升浪。',
    chartData: generateChartData(10000, 0.05, 0.02),
    performanceFee: 0.30
  },
  {
    id: 's4',
    name: '创业板抄底马丁',
    author: '逆势交易员',
    type: 'Martingale',
    roi: -5.4,
    pnl: -2301.10,
    copiers: 450,
    runtime: '3天',
    minInvestment: 2000,
    riskLevel: 'High',
    asset: '300750.SZ',
    description: '针对宁德时代等权重股的左侧交易策略，分批建仓，追求快速反弹获利。',
    chartData: generateChartData(10000, 0.08, -0.01),
    performanceFee: 0.25
  },
  {
    id: 's5',
    name: '中特估轮动',
    author: '宏观对冲',
    type: 'Rebalancing',
    roi: 18.9,
    pnl: 21004.45,
    copiers: 2300,
    runtime: '60天',
    minInvestment: 20000,
    riskLevel: 'Medium',
    asset: '中国移动/石油',
    description: '在中国特色估值体系核心资产间自动平衡仓位，捕捉板块轮动机会。',
    chartData: generateChartData(10000, 0.03, 0.01),
    performanceFee: 0.15
  },
  {
    id: 's6',
    name: '国债逆回购增强',
    author: '现金管理',
    type: 'Grid',
    roi: 2.1,
    pnl: 540.00,
    copiers: 12000,
    runtime: '200天',
    minInvestment: 1000,
    riskLevel: 'Low',
    asset: '204001.SH',
    description: '利用闲置资金自动参与国债逆回购，叠加货币基金套利，极低风险的现金管理工具。',
    chartData: generateChartData(10000, 0.001, 0.0005),
    performanceFee: 0.05
  }
];

export const MOCK_USER = {
  balance: 124500.00,
  activeStrategies: [
    {
      strategyId: 's1',
      investedAmount: 50000,
      currentValue: 56200,
      status: 'Running' as const,
      startTime: Date.now() - 86400000 * 5 // 5 days ago
    }
  ]
};