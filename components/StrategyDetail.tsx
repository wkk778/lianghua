import React, { useState, useEffect } from 'react';
import { Strategy, AIAnalysisResult } from '../types';
import { analyzeStrategyWithAI } from '../services/geminiService';
import { X, Bot, TrendingUp, AlertTriangle, CheckCircle, BrainCircuit, Wallet, Percent } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StrategyDetailProps {
  strategy: Strategy;
  onClose: () => void;
  onInvest: (amount: number) => void;
}

export const StrategyDetail: React.FC<StrategyDetailProps> = ({ strategy, onClose, onInvest }) => {
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState<string>(strategy.minInvestment.toString());

  useEffect(() => {
    // Auto-analyze when opened
    let mounted = true;
    const fetchAnalysis = async () => {
      setLoadingAI(true);
      const result = await analyzeStrategyWithAI(strategy);
      if (mounted) {
        setAiAnalysis(result);
        setLoadingAI(false);
      }
    };
    fetchAnalysis();
    return () => { mounted = false; };
  }, [strategy]);

  const handleInvest = () => {
    const val = parseFloat(investmentAmount);
    if (!isNaN(val) && val >= strategy.minInvestment) {
      onInvest(val);
      onClose();
    }
  };

  const typeMap: Record<string, string> = {
    'Grid': '网格交易',
    'DCA': '定投策略',
    'Rebalancing': '智能轮动',
    'Martingale': '马丁格尔',
    'AI Momentum': 'AI 动量'
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-850 w-full max-w-4xl max-h-[90vh] rounded-2xl border border-gray-700 overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-trade-yellow">
               <Bot size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{strategy.name}</h2>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span className="bg-gray-700 px-2 py-0.5 rounded text-gray-200">{strategy.asset}</span>
                <span>{typeMap[strategy.type] || strategy.type}</span>
                <span className="text-trade-green flex items-center gap-1"><TrendingUp size={14}/> 收益率: {strategy.roi}%</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full transition-colors">
            <X className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content: Chart & Stats */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 h-80">
              <h3 className="text-sm text-gray-400 mb-4">模拟收益走势 (近20日)</h3>
              <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={strategy.chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ecb81" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0ecb81" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={['auto', 'auto']} orientation="right" tick={{fill: '#4a5568', fontSize: 10}} stroke="#2d3748" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a202c', borderColor: '#2d3748', color: '#fff' }}
                    itemStyle={{ color: '#0ecb81' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#0ecb81" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BrainCircuit className="text-purple-400" /> Gemini 智能分析
              </h3>
              
              {loadingAI ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-20 bg-gray-700 rounded w-full"></div>
                </div>
              ) : aiAnalysis ? (
                <div className="bg-gray-900/50 border border-purple-900/30 rounded-xl p-5 space-y-4">
                  <p className="text-gray-300 italic">"{aiAnalysis.summary}"</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-trade-green font-semibold mb-2 flex items-center gap-2"><CheckCircle size={16}/> 核心优势</h4>
                      <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                        {aiAnalysis.pros.map((p, i) => <li key={i}>{p}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-trade-red font-semibold mb-2 flex items-center gap-2"><AlertTriangle size={16}/> 风险提示</h4>
                      <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                        {aiAnalysis.cons.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-800">
                     <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">适合人群:</span>
                     <p className="text-sm text-gray-300 mt-1">{aiAnalysis.suitability}</p>
                  </div>
                </div>
              ) : (
                <div className="text-red-400">AI 分析暂时不可用</div>
              )}
            </div>
          </div>

          {/* Sidebar: Action */}
          <div className="space-y-6">
             <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                <h3 className="text-white font-bold mb-4">投入资金</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">跟单金额 (¥)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg p-3 focus:outline-none focus:border-trade-yellow"
                      />
                      <span className="absolute right-3 top-3 text-gray-500 text-sm">CNY</span>
                    </div>
                    {parseFloat(investmentAmount) < strategy.minInvestment && (
                      <p className="text-red-500 text-xs mt-1">低于最低起投金额 ¥{strategy.minInvestment}</p>
                    )}
                  </div>
                  
                  <div className="p-3 bg-gray-900 rounded-lg text-xs text-gray-400 space-y-2">
                    <div className="flex justify-between">
                      <span>可用余额</span>
                      <span className="text-white">¥124,500.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>预估年化</span>
                      <span className="text-trade-green">{strategy.roi}%</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-800 mt-2">
                      <span className="text-orange-400 flex items-center gap-1"><Percent size={12}/> 技术服务费</span>
                      <span className="text-orange-400 font-mono">{strategy.performanceFee * 100}%</span>
                    </div>
                    <p className="text-[10px] text-gray-500">
                      * 仅在策略产生盈利时，自动扣除盈利部分的 {(strategy.performanceFee * 100).toFixed(0)}% 作为平台服务费（分润）。
                    </p>
                  </div>

                  <button 
                    onClick={handleInvest}
                    disabled={parseFloat(investmentAmount) < strategy.minInvestment}
                    className="w-full bg-trade-yellow hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg transition-colors"
                  >
                    确认创建
                  </button>
                </div>
             </div>

             <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                <h3 className="text-white font-bold mb-2 text-sm">策略参数详情</h3>
                <div className="space-y-2 text-sm">
                   <div className="flex justify-between border-b border-gray-700 pb-2">
                     <span className="text-gray-500">网格/定投频次</span>
                     <span className="text-gray-200">50格 / 日定投</span>
                   </div>
                   <div className="flex justify-between border-b border-gray-700 pb-2">
                     <span className="text-gray-500">价格区间</span>
                     <span className="text-gray-200">智能动态调整</span>
                   </div>
                   <div className="flex justify-between pt-1">
                     <span className="text-gray-500">止损保护</span>
                     <span className="text-gray-200">5% 回撤触发</span>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};