import React from 'react';
import { Bot, User } from 'lucide-react';

export interface PhoneMessage {
  id: string;
  sender: 'buyer' | 'system' | 'agent';
  text: string;
  time: string;
  isAutomated?: boolean;
}

export interface PhoneThreadProps {
  messages: PhoneMessage[];
  isTyping?: boolean;
  contactName?: string;
  contactSubtitle?: string;
  smartReplies?: string[];
  onSmartReplyClick?: (reply: string) => void;
  className?: string;
}

export const PhoneThread: React.FC<PhoneThreadProps> = ({
  messages,
  isTyping = false,
  contactName = 'Dana Whitfield | Alder & Stone',
  contactSubtitle = 'Fort Mill Sales Office',
  smartReplies,
  onSmartReplyClick,
  className = '',
}) => {
  return (
    <div
      className={`relative w-full max-w-[340px] h-[580px] bg-[#FBF9F4] rounded-[36px] border-[8px] border-[#1F2A27] shadow-[0_16px_40px_rgba(31,42,39,0.18)] flex flex-col overflow-hidden select-none ${className}`}
    >
      {/* Top Notch / Dynamic Island */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#1F2A27] rounded-full z-20" />

      {/* Phone Status Header */}
      <div className="pt-7 px-5 pb-3 border-b border-[#DDD6C8] bg-[#F6F3EC] flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#E0E8E3] text-[#2F4A3F] border border-[#C5D5CC] flex items-center justify-center font-medium text-xs">
            A&S
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#1F2A27] leading-tight flex items-center gap-1.5">
              {contactName}
              <span className="w-1.5 h-1.5 rounded-full bg-[#4C7A57]" />
            </h4>
            <p className="text-[10px] text-[#79827D]">{contactSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FBF9F4]/70">
        <div className="text-center my-1">
          <span className="text-[10px] uppercase tracking-wider text-[#79827D] bg-[#EDE8DD] px-2 py-0.5 rounded-full border border-[#DDD6C8]">
            Today • SMS Conversation
          </span>
        </div>

        {messages.map((msg) => {
          const isBuyer = msg.sender === 'buyer';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isBuyer ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-[14px] px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${
                  isBuyer
                    ? 'bg-[#2F4A3F] text-white rounded-br-sm'
                    : 'bg-[#EDE8DD] text-[#1F2A27] border border-[#DDD6C8] rounded-bl-sm'
                }`}
              >
                {!isBuyer && (
                  <div className="flex items-center gap-1 mb-1">
                    {msg.isAutomated ? (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-[#B4684A] bg-[#F0DFD5] px-1.5 py-0.2 rounded">
                        <Bot className="w-2.5 h-2.5" />
                        AUTOMATION
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-[#2F4A3F] bg-[#E0E8E3] px-1.5 py-0.2 rounded">
                        <User className="w-2.5 h-2.5" />
                        DANA (OSC)
                      </span>
                    )}
                  </div>
                )}
                <p>{msg.text}</p>
              </div>
              <span className="text-[9px] text-[#79827D] mt-0.5 px-1">{msg.time}</span>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-1 bg-[#EDE8DD] text-[#79827D] border border-[#DDD6C8] px-3 py-2 rounded-[14px] w-14">
            <span className="w-1.5 h-1.5 rounded-full bg-[#79827D] animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#79827D] animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#79827D] animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
      </div>

      {/* Smart Reply Suggestions */}
      {smartReplies && smartReplies.length > 0 && (
        <div className="p-2 border-t border-[#DDD6C8] bg-[#F6F3EC] flex flex-wrap gap-1.5 justify-end">
          {smartReplies.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => onSmartReplyClick?.(reply)}
              className="text-[11px] font-medium bg-white text-[#2F4A3F] border border-[#DDD6C8] hover:border-[#2F4A3F] px-2.5 py-1 rounded-full shadow-2xs transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Bottom Mock Input Bar */}
      <div className="p-3 border-t border-[#DDD6C8] bg-white flex items-center gap-2">
        <div className="flex-1 bg-[#F6F3EC] rounded-full px-3 py-1.5 text-xs text-[#79827D] border border-[#DDD6C8]">
          iMessage • Reply...
        </div>
        <div className="w-7 h-7 rounded-full bg-[#2F4A3F] text-white flex items-center justify-center text-xs">
          ↑
        </div>
      </div>
    </div>
  );
};
