import React from 'react';
import { Message, AgentRole } from '../types';
import { AGENTS } from '../constants';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-4 animate-fade-in">
        <div className="bg-slate-100 text-slate-600 text-xs py-1 px-3 rounded-full border border-slate-200 shadow-sm flex items-center gap-2">
           <span className="animate-pulse">●</span> {message.content}
        </div>
      </div>
    );
  }

  // Determine styling based on which agent sent it (if model)
  // We infer sender from context or default to coordinator if generic
  const isCoordinator = message.senderName === AGENTS[AgentRole.COORDINATOR].name;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] md:max-w-[70%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        
        {!isUser && (
          <span className="text-xs font-semibold text-slate-500 mb-1 ml-1">
            {message.senderName || 'MediCoord System'}
          </span>
        )}

        <div className={`
          p-4 rounded-2xl text-sm leading-relaxed shadow-sm relative
          ${isUser 
            ? 'bg-blue-600 text-white rounded-br-none' 
            : isCoordinator 
              ? 'bg-white border-2 border-blue-100 text-slate-700 rounded-bl-none'
              : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'}
        `}>
          {message.content}

          {/* Visualization of Routing Decision if present */}
          {message.metadata?.routingDecision && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Routing Analysis</div>
              <div className="bg-slate-50 rounded p-2 text-xs grid gap-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Target:</span>
                  <span className="font-bold text-blue-700">{AGENTS[message.metadata.routingDecision.targetAgent].name}</span>
                </div>
                <div className="text-slate-600 italic">
                  "{message.metadata.routingDecision.reasoning}"
                </div>
              </div>
            </div>
          )}
        </div>
        
        <span className="text-[10px] text-slate-400 mt-1 mx-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;