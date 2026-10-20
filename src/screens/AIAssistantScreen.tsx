import React, { useState } from 'react';
import { AIChatMessage, Language } from '../types';
import { Bot, Send, Sparkles, User, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { getTranslation } from '../i18n';

interface AIAssistantScreenProps {
  onBack: () => void;
  language: Language;
}

export const AIAssistantScreen: React.FC<AIAssistantScreenProps> = ({
  onBack,
  language,
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: 'Akkam! I am your BUTTAA AI Agricultural Assistant. Ask me anything about crop diseases, yellowing leaves, fertilizer recommendations (NPS/Urea), pest control, or market advice.',
      timestamp: 'Just now',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const presetQuestions = [
    'Why are my maize leaves turning yellow?',
    'Which fertilizer ratio should I use for teff?',
    'When should I plant wheat in high altitude zones?',
    'How do I control Fall Armyworm organically?',
    'How do I improve soil pH and fertility?',
    'What are the best irrigation schedules for tomatoes?',
  ];

  const handleSendMessage = async (promptToSend?: string) => {
    const text = promptToSend || inputPrompt;
    if (!text.trim() || loading) return;

    const userMsg: AIChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!promptToSend) setInputPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, language }),
      });
      const data = await res.json();

      const aiMsg: AIChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: data.text || 'I apologize, I could not generate an answer right now. Please check your query or retry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'assistant',
          text: 'Maafan Hamaa! For yellow maize leaves, common causes are Nitrogen deficiency (V-shaped yellowing starting from tip of lower leaves) or waterlogging. Apply top-dressing Urea (100 kg/ha) when soil is moist.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-20 bg-slate-50 min-h-[85vh] flex flex-col justify-between">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white sticky top-0 z-30 px-4 py-3 flex items-center justify-between shadow-md">
        <button
          onClick={onBack}
          className="p-1 rounded-full hover:bg-emerald-800 text-emerald-100 flex items-center space-x-1"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xs font-bold hidden sm:inline">Back</span>
        </button>

        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black">
            <Sparkles className="w-4 h-4 text-amber-900 animate-pulse" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-amber-300 leading-tight">
              AI Agricultural Expert
            </h2>
            <p className="text-[10px] text-emerald-200">Gemini-Powered Agronomist</p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="p-1.5 text-emerald-200 hover:text-white"
          title="Clear Chat"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages List Area */}
      <div className="flex-1 p-4 space-y-3 max-w-3xl mx-auto w-full overflow-y-auto">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${
              m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                m.sender === 'user'
                  ? 'bg-slate-900 text-white'
                  : 'bg-amber-400 text-slate-950 ring-2 ring-emerald-600'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[82%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                m.sender === 'user'
                  ? 'bg-emerald-700 text-white rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none font-medium'
              }`}
            >
              <p className="whitespace-pre-line">{m.text}</p>
              <span
                className={`text-[9px] block mt-1.5 text-right font-semibold ${
                  m.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                }`}
              >
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-slate-500 italic bg-white p-3 rounded-2xl border border-slate-200 w-fit">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
            <span>AI Agronomist is preparing expert response...</span>
          </div>
        )}
      </div>

      {/* Preset Chips & Input Bar */}
      <div className="bg-white border-t border-slate-200 p-3 max-w-3xl mx-auto w-full space-y-2.5">
        {/* Chips */}
        <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar text-[11px]">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-bold whitespace-nowrap transition-colors shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Prompt Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask question (e.g., yellow maize leaves, teff fertilizer)..."
            className="flex-1 bg-slate-100 border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
          <button
            type="submit"
            disabled={loading || !inputPrompt.trim()}
            className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white p-2.5 rounded-xl shadow transition-transform active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
