import React from 'react';
import { AgentDef } from '../types';

interface AgentCardProps {
  agent: AgentDef;
  isActive?: boolean;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, isActive }) => {
  return (
    <div className={`
      relative p-5 rounded-xl border transition-all duration-300
      ${isActive 
        ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]' 
        : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm'}
    `}>
      {isActive && (
        <span className="absolute top-3 right-3 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
        </span>
      )}
      
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl text-white shadow-sm ${agent.color}`}>
          {agent.icon}
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-lg">{agent.name}</h3>
          <p className="text-slate-500 text-sm mt-1 leading-relaxed">{agent.description}</p>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;