import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader, MessageSquare, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your legal assistant. How can I assist you today with the Indian Penal Code?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // --- Refs for Scrolling ---
  const messagesEndRef = useRef(null); // Ref for the empty div at the end
  const chatContainerRef = useRef(null); // **NEW**: Ref for the scrollable chat container

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // --- CORRECTED SCROLLING LOGIC ---
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      // **NEW**: We now scroll the container itself, not the whole window
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // This effect runs every time a new message is added
    scrollToBottom();
  }, [messages]);
  // ---------------------------------------------

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await api.post('/ml/chat/', { query: inputMessage });
      const { answer } = response.data;

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: answer || "I'm sorry, I could not find an answer.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error('Failed to get bot response:', error);
      toast.error('Failed to get a response. Please try again later.');

      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);

    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF5] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-12 w-12 animate-spin text-[#C9A227]" />
          <p className="text-[#7A7A7A] text-lg font-medium">Loading legal assistant...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF5] font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section with Gradient Background */}
        <div className="relative mb-12 p-8 bg-gradient-to-br from-[#1C1C1C] to-[#2D2D2D] rounded-2xl shadow-xl overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227] opacity-10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C9A227] opacity-10 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white mb-3">
              Legal <span className="text-[#C9A227]">Assistant</span>
            </h1>
            <p className="text-gray-300 text-lg">
              Get instant answers to your legal questions
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Chat Interface */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-[#1C1C1C] to-[#2D2D2D] px-8 py-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-[#C9A227] to-[#D4B332] p-3 rounded-xl shadow-lg">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Legal Assistant</h3>
                  <p className="text-gray-300">AI-powered legal guidance</p>
                </div>
              </div>
            </div>

            {/* Messages Container */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-br from-[#FAFAF5] to-white">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`p-3 rounded-xl shadow-lg ${message.type === 'user' ? 'bg-gradient-to-br from-[#C9A227] to-[#D4B332]' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}>
                        {message.type === 'user' ? (
                          <User className="h-5 w-5 text-white" />
                        ) : (
                          <Bot className="h-5 w-5 text-[#1C1C1C]" />
                        )}
                      </div>
                      <div className={`rounded-xl p-4 shadow-lg border ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-br from-[#C9A227] to-[#D4B332] text-white border-[#C9A227]/20' 
                          : 'bg-white text-[#1C1C1C] border-gray-200'
                      }`}>
                        <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                    <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-right' : 'text-left'} text-[#7A7A7A]`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%]">
                    <div className="flex items-start space-x-3">
                      <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-3 rounded-xl shadow-lg">
                        <Bot className="h-5 w-5 text-[#1C1C1C]" />
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
                        <div className="flex items-center space-x-2">
                          <Loader className="h-4 w-4 animate-spin text-[#C9A227]" />
                          <span className="text-[#7A7A7A]">Typing...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-6 bg-white">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your legal question here..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] transition-all duration-200 resize-none bg-white text-[#1C1C1C] placeholder-[#7A7A7A]"
                    rows={2}
                    disabled={isTyping}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="self-end px-6 py-3 bg-gradient-to-r from-[#C9A227] to-[#D4B332] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Information Box */}
          <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-500 rounded-xl p-6 shadow-md">
            <div className="flex items-start space-x-4">
              <MessageSquare className="h-10 w-10 text-yellow-800" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">Important Notice</h3>
                <p className="text-yellow-700 text-sm leading-relaxed">
                  This AI assistant provides general legal information for educational purposes only. 
                  It does not constitute legal advice. For specific legal matters, please consult a qualified lawyer. 
                  In emergencies, contact your nearest police station immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;