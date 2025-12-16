import React from 'react';
import { Strategy } from '../types';
import { TrendingUp, Users, Clock, AlertTriangle, ShieldCheck, Zap, Percent } from 'lucide-react';

interface StrategyCardProps {
  strategy: Strategy;
  onSelect: (s: Strategy) => void;
  onCopy: (s: Strategy) => void;
}

export const StrategyCard: React.FC<StrategyCardProps> = ({ strategy, onSelect, onCopy }) => {
  const isPositive = strategy.roi >= 0;

  const RiskIcon = {
    'Low': ShieldCheck,
    'Medium': Clock, // Using Clock as neutral placeholder or maybe Scale
    'High': Zap
  }[strategy.riskLevel] || AlertTriangle;

  const riskColor = {
    'Low': 'text-trade-green',
    'Medium': 'text-trade-yellow',
    'High': 'text-trade-red'
  }[strategy.riskLevel];

  const typeMap: Record<string, string> = {
    'Grid': '网格交易',
    'DCA': '定投策略',
    'Rebalancing': '智能轮动',
    'Martingale': '马丁格尔',
    'AI Momentum': 'AI 动量'
  };

  return (
    <div 
      className="bg-gray-850 border border-gray-700 rounded-xl p-5 hover:border-trade-yellow transition-all cursor-pointer flex flex-col justify-between h-full group"
      onClick={() => onSelect(strategy)}
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-100 group-hover:text-trade-yellow transition-colors">
                {strategy.name}
              </h3>
              <span className="text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded">
                {typeMap[strategy.type] || strategy.type}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">作者: {strategy.author}</p>
          </div>
          <div className={`p-2 rounded-lg bg-gray-800 ${riskColor} flex items-center gap-1`}>
            <RiskIcon size={16} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">总收益率 (ROI)</p>
            <p className={`text-xl font-mono font-bold ${isPositive ? 'text-trade-green' : 'text-trade-red'}`}>
              {isPositive ? '+' : ''}{strategy.roi}%
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">分润比例</p>
            <div className="flex items-center gap-1">
               <span className="text-orange-400 font-bold font-mono">{strategy.performanceFee * 100}%</span>
               <span className="text-[10px] text-gray-500 bg-gray-800 px-1 rounded">盈利提成</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">运行时间</p>
            <p className="text-sm text-gray-300 font-mono">{strategy.runtime}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">跟单人数</p>
            <div className="flex items-center gap-1 text-sm text-gray-300">
              <Users size={14} />
              <span>{strategy.copiers}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 pt-4 border-t border-gray-700 flex justify-between items-center">
         <span className="text-xs text-gray-400">
            起投: ¥{strategy.minInvestment}
         </span>
         <button 
           onClick={(e) => {
             e.stopPropagation();
             onCopy(strategy);
           }}
           className="bg-trade-yellow hover:bg-yellow-400 text-black font-semibold py-1.5 px-4 rounded-lg text-sm transition-transform active:scale-95"
         >
           立即跟单
         </button>
      </div>
    </div>
  );
};