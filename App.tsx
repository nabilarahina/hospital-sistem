import React, { useState, useRef, useEffect } from 'react';
import { Message, AgentRole } from './types';
import { AGENTS } from './constants';
import * as GeminiService from './services/geminiService';
import AgentCard from './components/AgentCard';
import ChatMessage from './components/ChatMessage';
import BlueprintView from './components/BlueprintView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'simulation'>('simulation');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAgentId, setActiveAgentId] = useState<AgentRole>(AgentRole.COORDINATOR);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'init-1',
          role: 'model',
          senderName: AGENTS[AgentRole.COORDINATOR].name,
          content: 'Halo! Saya adalah Hospital System Coordinator. Jelaskan kebutuhan Anda, dan saya akan menghubungkan Anda dengan agen spesialis yang tepat.',
          timestamp: new Date()
        }
      ]);
    }
  }, [messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsProcessing(true);
    setActiveAgentId(AgentRole.COORDINATOR);

    try {
      // 1. Coordinator Step
      const systemMsgId = Date.now().toString() + '-sys';
      setMessages(prev => [...prev, {
        id: systemMsgId,
        role: 'system',
        content: 'Coordinator is analyzing request...',
        timestamp: new Date()
      }]);

      const routingDecision = await GeminiService.coordinateRequest(userMsg.content);
      
      // Update UI to show routing happened
      setMessages(prev => prev.map(m => 
        m.id === systemMsgId 
          ? { ...m, content: `Routed to ${AGENTS[routingDecision.targetAgent].name}` } 
          : m
      ));

      setActiveAgentId(routingDecision.targetAgent);

      // Add Coordinator's "Internal Thought" / Handoff message to UI (Optional, but good for transparency)
      const coordinatorMsg: Message = {
        id: Date.now().toString() + '-coord',
        role: 'model',
        senderName: AGENTS[AgentRole.COORDINATOR].name,
        content: `Saya akan mengalihkan Anda ke ${AGENTS[routingDecision.targetAgent].name} untuk menangani permintaan ini.`,
        timestamp: new Date(),
        metadata: { routingDecision }
      };
      setMessages(prev => [...prev, coordinatorMsg]);

      // 2. Sub-Agent Step
      await new Promise(resolve => setTimeout(resolve, 800)); // Small delay for UX

      let agentResponseText = "";
      
      if (routingDecision.targetAgent === AgentRole.MEDICAL_INFO) {
        agentResponseText = await GeminiService.getMedicalInformation(routingDecision.forwardedQuery);
      } else {
        // Mock handler for other agents
        agentResponseText = await GeminiService.getGenericAgentResponse(routingDecision.targetAgent, routingDecision.forwardedQuery);
      }

      const agentResponse: Message = {
        id: Date.now().toString() + '-agent',
        role: 'model',
        senderName: AGENTS[routingDecision.targetAgent].name,
        content: agentResponseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, agentResponse]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '-err',
        role: 'model',
        senderName: 'System Error',
        content: 'Maaf, terjadi kesalahan koneksi dengan sistem AI. Pastikan API Key valid.',
        timestamp: new Date()
      }]);
    } finally {
      setIsProcessing(false);
      // Reset active agent to coordinator after interaction loop finishes (conceptually)
      // or keep it to show who responded last. Let's keep it.
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans text-slate-800 bg-slate-50 overflow-hidden">
      
      {/* Sidebar / Navigation */}
      <aside className="w-full md:w-80 bg-white border-r border-slate-200 flex flex-col shadow-lg z-10">
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <span>🏥</span> MediCoord AI
          </h1>
          <p className="text-blue-100 text-xs mt-1 opacity-80">Hospital Multi-Agent System</p>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Mode</div>
          <button 
            onClick={() => setActiveTab('simulation')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3
              ${activeTab === 'simulation' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}
            `}
          >
            <span>💬</span> Live Simulation
          </button>
          <button 
            onClick={() => setActiveTab('blueprint')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3
              ${activeTab === 'blueprint' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}
            `}
          >
            <span>📄</span> Blueprint & Docs
          </button>

          <div className="mt-8 mb-2 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Active Agents</div>
          <div className="space-y-2">
            {Object.values(AGENTS).map(agent => (
              <div 
                key={agent.id}
                className={`px-3 py-2 rounded-md text-xs flex items-center gap-2 transition-all
                  ${activeAgentId === agent.id ? 'bg-slate-100 opacity-100 font-semibold' : 'opacity-50'}
                `}
              >
                <span>{agent.icon}</span> {agent.name}
              </div>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100 text-xs text-slate-400 text-center">
          Powered by Google Gemini
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {activeTab === 'blueprint' ? (
          <div className="flex-1 overflow-y-auto bg-white/50">
            <BlueprintView />
          </div>
        ) : (
          <div className="flex flex-col h-full relative">
            
            {/* Header for Chat */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-sm font-semibold text-slate-600">System Online</span>
              </div>
              <div className="text-xs text-slate-400">
                Session ID: {Date.now().toString().slice(-6)}
              </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/50">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200">
              <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Contoh: 'Apa gejala diabetes?' atau 'Saya ingin buat janji dengan dokter jantung'..."
                  className="flex-1 bg-slate-100 text-slate-800 placeholder-slate-400 border-0 rounded-xl px-5 py-4 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                  disabled={isProcessing}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isProcessing}
                  className={`
                    absolute right-2 p-2 rounded-lg transition-all duration-200
                    ${!inputValue.trim() || isProcessing 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md transform hover:scale-105'}
                  `}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </form>
              <div className="text-center mt-2">
                <p className="text-[10px] text-slate-400">
                  AI dapat membuat kesalahan. Harap verifikasi informasi medis penting.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;