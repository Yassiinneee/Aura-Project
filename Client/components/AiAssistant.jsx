import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Sparkles, Send, Bot, User, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '') 
  : '';

export const AiAssistant = ({
  isOpen,
  onClose,
  products,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm Aura AI, your personal shopping concierge. How can I help you curate your space or wardrobe today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMessage = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/ai/chat`, {
        message: query,
        contextProducts: products.map((p) => ({
          name: p.name,
          category: p.category,
          price: p.price,
          description: p.description,
        })),
      });

      const data = response.data;
      const aiReply = data.reply || "I'm here to help you find the perfect piece for your home or wardrobe!";
      setMessages((prev) => [...prev, { role: 'assistant', content: aiReply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "I'm having trouble connecting right now. Please explore our product collection directly or try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-slideLeft">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-stone-800 rounded-lg text-amber-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium">Aura AI Concierge</h3>
              <p className="text-[11px] text-stone-400">Powered by Gemini &bull; Styling & recommendations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-300 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Quick Prompts */}
        <div className="bg-stone-50 px-4 py-2 border-b border-stone-200 flex space-x-2 overflow-x-auto text-[11px]">
          <button
            type="button"
            onClick={() => handleSendMessage('Recommend a relaxing coffee setup for Sunday mornings.')}
            className="bg-white border border-stone-200 hover:border-stone-400 text-stone-700 px-3 py-1 rounded-full whitespace-nowrap shadow-xs"
          >
            ☕ Relaxing coffee setup
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage('What gifts do you recommend for an audiophile?')}
            className="bg-white border border-stone-200 hover:border-stone-400 text-stone-700 px-3 py-1 rounded-full whitespace-nowrap shadow-xs"
          >
            🎧 Audiophile gifts
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage('Tell me about the cashmere lounge hoodie.')}
            className="bg-white border border-stone-200 hover:border-stone-400 text-stone-700 px-3 py-1 rounded-full whitespace-nowrap shadow-xs"
          >
            🧥 Cashmere hoodie details
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start space-x-2.5 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-stone-900 text-white' : 'bg-amber-100 text-amber-900'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-stone-900 text-white rounded-tr-none'
                    : 'bg-stone-100 text-stone-800 rounded-tl-none font-light'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center space-x-2 text-stone-400 text-xs italic">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Aura AI is curating recommendations...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="p-4 border-t border-stone-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask for advice, materials, or gifts..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-800 focus:outline-none focus:border-stone-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white p-3 rounded-xl transition-all shadow"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
