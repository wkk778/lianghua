import React, { useState } from 'react';
import { StrategyCard } from './components/StrategyCard';
import { StrategyDetail } from './components/StrategyDetail';
import { MOCK_STRATEGIES, MOCK_USER } from './constants';
import { Strategy, ViewState } from './types';
import { generateStrategyIdea } from './services/geminiService';
import { 
  LayoutDashboard, 
  Bot, 
  Wallet, 
  PlusCircle, 
  Search, 
  Filter, 
  ArrowUpRight, 
  PlayCircle,
  PauseCircle,
  Sparkles,
  Loader2,
  Coins,
  ReceiptText,
  TrendingUp
} from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('MARKETPLACE');
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [activeStrategies, setActiveStrategies] = useState(MOCK_USER.activeStrategies);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  
  // AI Creation State
  const [aiPrompt, setAiPrompt] = useState({ risk: 'Medium', outlook: 'Bullish', capital: 10000 });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStrategy, setGeneratedStrategy] = useState<Partial<Strategy> | null>(null);

  const filteredStrategies = MOCK_STRATEGIES.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.asset.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || s.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleCopyStrategy = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
  };

  const handleInvest = (amount: number) => {
    if (!selectedStrategy) return;
    const newActive = {
      strategyId: selectedStrategy.id,
      investedAmount: amount,
      currentValue: amount, // Starts equal
      status: 'Running' as const,
      startTime: Date.now()
    };
    setActiveStrategies([...activeStrategies, newActive]);
    alert(`成功创建策略 "${selectedStrategy.name}"，投入金额 ¥${amount}\n\n注意：盈利时将自动收取 ${selectedStrategy.performanceFee * 100}% 分润。`);
    setView('MY_BOTS');
  };

  const handleGenerateStrategy = async () => {
    setIsGenerating(true);
    setGeneratedStrategy(null);
    try {
      const result = await generateStrategyIdea(aiPrompt.risk, aiPrompt.outlook, aiPrompt.capital);
      setGeneratedStrategy(result);
    } catch (e) {
      alert("AI 生成失败，请稍后重试");
    } finally {
      setIsGenerating(false);
    }
  };

  const NavItem = ({ icon: Icon, label, id }: { icon: any, label: string, id: ViewState }) => (
    <button 
      onClick={() => setView(id)}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${
        view === id 
        ? 'bg-trade-yellow text-black font-bold' 
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  const riskLabelMap: Record<string, string> = { 'Low': '稳健型', 'Medium': '平衡型', 'High': '进取型' };
  const outlookLabelMap: Record<string, string> = { 'Bullish': '看涨', 'Bearish': '看跌', 'Sideways': '震荡', 'Volatile': '高波动' };

  // Calculate total platform revenue (simulated)
  const totalPlatformFees = activeStrategies.reduce((acc, item) => {
      const strat = MOCK_STRATEGIES.find(s => s.id === item.strategyId);
      const grossPnl = item.currentValue - item.investedAmount;
      if (grossPnl > 0 && strat) {
        return acc + (grossPnl * strat.performanceFee);
      }
      return acc;
  }, 0);

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 bg-gray-900 flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
             <div className="w-8 h-8 bg-trade-yellow rounded-lg flex items-center justify-center text-black">
               <Bot size={20} />
             </div>
             WKK量化
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <NavItem icon={LayoutDashboard} label="策略广场" id="MARKETPLACE" />
          <NavItem icon={Bot} label="我的实盘" id="MY_BOTS" />
          <NavItem icon={PlusCircle} label="AI 策略创建" id="CREATE_STRATEGY" />
          <NavItem icon={Wallet} label="资金账户" id="WALLET" />
        </nav>

        <div className="p-4 border-t border-gray-800">
           <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl p-4">
              <div className="flex items-center gap-2 text-white font-bold mb-1">
                 <Sparkles size={16} className="text-yellow-400" />
                 <span>Pro 会员</span>
              </div>
              <p className="text-xs text-gray-300 mb-2">解锁 Gemini 3.0 高级策略分析</p>
              <button className="w-full bg-white/10 hover:bg-white/20 text-white text-xs py-1.5 rounded transition-colors">
                升级套餐
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900">
          <h1 className="font-bold text-white">陈虚谷量化</h1>
          <button onClick={() => setView('MARKETPLACE')}><LayoutDashboard className="text-gray-400"/></button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          
          {/* VIEW: MARKETPLACE */}
          {view === 'MARKETPLACE' && (
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">量化策略广场</h2>
                  <p className="text-gray-400">跟随顶尖量化模型，让 AI 替你打理 A 股资产。</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-3 text-gray-500" size={18} />
                    <input 
                      type="text" 
                      placeholder="搜索代码 (如 600519) 或名称..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-trade-yellow"
                    />
                  </div>
                  <button className="bg-gray-800 p-2.5 rounded-lg border border-gray-700 hover:bg-gray-700">
                    <Filter className="text-gray-400" size={20} />
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {['All', 'Grid', 'DCA', 'Rebalancing', 'Martingale', 'AI Momentum'].map(type => {
                   const labelMap: Record<string, string> = {
                     'All': '全部',
                     'Grid': '网格交易',
                     'DCA': '定投',
                     'Rebalancing': '轮动',
                     'Martingale': '马丁格尔',
                     'AI Momentum': 'AI 趋势'
                   };
                   return (
                    <button 
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        filterType === type 
                        ? 'bg-gray-700 text-white border border-gray-600' 
                        : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {labelMap[type]}
                    </button>
                  );
                })}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredStrategies.map(strategy => (
                  <StrategyCard 
                    key={strategy.id} 
                    strategy={strategy} 
                    onSelect={setSelectedStrategy}
                    onCopy={handleCopyStrategy}
                  />
                ))}
              </div>
            </div>
          )}

          {/* VIEW: MY BOTS */}
          {view === 'MY_BOTS' && (
             <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-6">我的实盘策略</h2>
                <div className="bg-gray-850 rounded-xl border border-gray-700 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-800 text-gray-400 text-sm">
                      <tr>
                        <th className="p-4 font-medium">策略名称</th>
                        <th className="p-4 font-medium">投入本金</th>
                        <th className="p-4 font-medium">当前持仓</th>
                        <th className="p-4 font-medium">盈亏 (净值/分润)</th>
                        <th className="p-4 font-medium">状态</th>
                        <th className="p-4 font-medium">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-gray-200">
                      {activeStrategies.map((item, idx) => {
                        const strat = MOCK_STRATEGIES.find(s => s.id === item.strategyId);
                        const grossPnl = item.currentValue - item.investedAmount;
                        
                        // Calculate Fee
                        const feeRate = strat?.performanceFee || 0;
                        const fee = grossPnl > 0 ? grossPnl * feeRate : 0;
                        const netPnl = grossPnl - fee;

                        const grossPnlPercent = (grossPnl / item.investedAmount) * 100;
                        
                        return (
                          <tr key={idx} className="hover:bg-gray-800/50 transition-colors">
                            <td className="p-4 flex items-center gap-3">
                               <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center">
                                 <Bot size={16} />
                               </div>
                               <div>
                                 <div className="font-bold">{strat?.name || '未知策略'}</div>
                                 <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">{strat?.asset}</span>
                                    <span className="text-[10px] bg-orange-900/40 text-orange-400 px-1 rounded border border-orange-900">
                                      提成 {(feeRate * 100).toFixed(0)}%
                                    </span>
                                 </div>
                               </div>
                            </td>
                            <td className="p-4 font-mono">¥{item.investedAmount.toLocaleString()}</td>
                            <td className="p-4 font-mono">¥{item.currentValue.toLocaleString()}</td>
                            <td className="p-4">
                              <div className={`font-mono font-medium ${grossPnl >= 0 ? 'text-trade-green' : 'text-trade-red'}`}>
                                {grossPnl >= 0 ? '+' : ''}{grossPnl.toFixed(2)} ({grossPnlPercent.toFixed(2)}%)
                              </div>
                              {fee > 0 && (
                                <div className="text-xs text-gray-500 mt-1 flex flex-col">
                                   <span>-¥{fee.toFixed(2)} (服务费)</span>
                                   <span className="text-gray-300">净赚: ¥{netPnl.toFixed(2)}</span>
                                </div>
                              )}
                            </td>
                            <td className="p-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-900">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                运行中
                              </span>
                            </td>
                            <td className="p-4">
                              <button className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white" title="暂停/停止">
                                <PauseCircle size={18} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {activeStrategies.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                       <Bot size={48} className="mx-auto mb-4 opacity-20" />
                       <p>暂无运行中的实盘策略</p>
                       <button onClick={() => setView('MARKETPLACE')} className="mt-4 text-trade-yellow hover:underline">去策略广场看看</button>
                    </div>
                  )}
                </div>
             </div>
          )}

          {/* VIEW: CREATE STRATEGY (AI) */}
          {view === 'CREATE_STRATEGY' && (
             <div className="max-w-2xl mx-auto mt-8">
               <div className="text-center mb-10">
                 <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-4 shadow-lg shadow-purple-900/50">
                    <Sparkles className="text-white" size={32} />
                 </div>
                 <h2 className="text-3xl font-bold text-white">AI 智能策略生成器</h2>
                 <p className="text-gray-400 mt-2">告诉 Gemini 您的投资偏好，自动生成 A 股量化方案。</p>
               </div>

               <div className="bg-gray-850 rounded-2xl p-8 border border-gray-700 shadow-xl">
                 <div className="space-y-6">
                   <div>
                     <label className="block text-gray-400 text-sm font-bold mb-2">风险偏好</label>
                     <div className="grid grid-cols-3 gap-4">
                       {['Low', 'Medium', 'High'].map(r => (
                         <button 
                           key={r}
                           onClick={() => setAiPrompt({...aiPrompt, risk: r})}
                           className={`py-3 rounded-xl border transition-all ${
                             aiPrompt.risk === r 
                             ? 'bg-gray-700 border-trade-yellow text-white' 
                             : 'border-gray-700 text-gray-500 hover:bg-gray-800'
                           }`}
                         >
                           {riskLabelMap[r]}
                         </button>
                       ))}
                     </div>
                   </div>

                   <div>
                     <label className="block text-gray-400 text-sm font-bold mb-2">市场观点</label>
                     <select 
                       className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:border-trade-yellow outline-none"
                       value={aiPrompt.outlook}
                       onChange={(e) => setAiPrompt({...aiPrompt, outlook: e.target.value})}
                     >
                       {Object.entries(outlookLabelMap).map(([key, label]) => (
                         <option key={key} value={key}>{label}</option>
                       ))}
                     </select>
                   </div>

                   <div>
                     <label className="block text-gray-400 text-sm font-bold mb-2">投入本金 (¥)</label>
                     <input 
                        type="number"
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:border-trade-yellow outline-none"
                        value={aiPrompt.capital}
                        onChange={(e) => setAiPrompt({...aiPrompt, capital: parseInt(e.target.value)})}
                     />
                   </div>

                   <button 
                     onClick={handleGenerateStrategy}
                     disabled={isGenerating}
                     className="w-full bg-gradient-to-r from-trade-yellow to-yellow-500 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                   >
                     {isGenerating ? <><Loader2 className="animate-spin"/> AI 正在思考中...</> : <><Sparkles size={18} /> 生成策略</>}
                   </button>
                 </div>
               </div>

               {/* Generated Result */}
               {generatedStrategy && (
                 <div className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-600 animate-fade-in">
                    <h3 className="text-xl font-bold text-white mb-2">{generatedStrategy.name}</h3>
                    <div className="flex gap-2 mb-4">
                      <span className="bg-gray-700 text-xs px-2 py-1 rounded text-gray-300">{generatedStrategy.type}</span>
                      <span className="bg-gray-700 text-xs px-2 py-1 rounded text-gray-300">{generatedStrategy.asset}</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                      {generatedStrategy.description}
                    </p>
                    <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg border border-gray-500">
                      保存并进行回测
                    </button>
                 </div>
               )}
             </div>
          )}

          {/* VIEW: WALLET */}
          {view === 'WALLET' && (
            <div className="max-w-4xl mx-auto">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                     <div className="flex items-center gap-3 text-gray-400 mb-2">
                        <Wallet size={20} />
                        <span>总资产估值</span>
                     </div>
                     <div className="text-3xl font-bold text-white">¥{MOCK_USER.balance.toLocaleString()}</div>
                     <div className="text-sm text-trade-green mt-1 flex items-center gap-1">
                        <TrendingUp size={14} /> 今日 +1.2%
                     </div>
                  </div>

                  <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                     <div className="flex items-center gap-3 text-orange-400 mb-2">
                        <ReceiptText size={20} />
                        <span>累计支付平台服务费</span>
                     </div>
                     <div className="text-3xl font-bold text-white">¥{totalPlatformFees.toFixed(2)}</div>
                     <p className="text-xs text-gray-500 mt-1">包含所有已结算和浮动盈利的分润费用</p>
                  </div>
               </div>

               <div className="bg-gray-850 rounded-xl border border-gray-700 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">资金流水</h3>
                  <div className="space-y-4">
                     {/* Mock Transactions */}
                     <div className="flex justify-between items-center py-3 border-b border-gray-800">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                              <Coins size={20} />
                           </div>
                           <div>
                              <div className="text-white font-medium">策略分润扣除 - 茅台价值网格</div>
                              <div className="text-xs text-gray-500">2023-10-24 14:30</div>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="text-white font-mono">-¥1,240.00</div>
                           <div className="text-xs text-orange-400">技术服务费</div>
                        </div>
                     </div>
                     <div className="flex justify-between items-center py-3 border-b border-gray-800">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                              <TrendingUp size={20} />
                           </div>
                           <div>
                              <div className="text-white font-medium">策略盈利结算 - 科创50动量</div>
                              <div className="text-xs text-gray-500">2023-10-22 09:15</div>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="text-trade-green font-mono">+¥5,600.00</div>
                           <div className="text-xs text-gray-500">已扣除 30% 分润</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedStrategy && (
        <StrategyDetail 
          strategy={selectedStrategy} 
          onClose={() => setSelectedStrategy(null)}
          onInvest={handleInvest}
        />
      )}
    </div>
  );
};

export default App;