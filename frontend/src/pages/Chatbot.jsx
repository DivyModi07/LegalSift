import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader, MessageSquare } from 'lucide-react';
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
    }, 1000);
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
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-max py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Legal Assistant
          </h1>
          <p className="text-neutral-600">
            Get instant answers to your legal questions
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Chat Interface */}
          <div className="card h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="border-b border-neutral-200 p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-primary-100 p-2 rounded-lg">
                  <Bot className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Legal Assistant</h3>
                  <p className="text-sm text-neutral-600">AI-powered legal guidance</p>
                </div>
              </div>
            </div>

            {/* **NEW**: The ref is now on the message container div */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`p-2 rounded-lg ${message.type === 'user' ? 'bg-primary-500' : 'bg-neutral-100'}`}>
                        {message.type === 'user' ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-neutral-600" />
                        )}
                      </div>
                      <div className={`rounded-lg p-3 ${
                        message.type === 'user' 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-neutral-100 text-neutral-900'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                    <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-right' : 'text-left'} text-neutral-500`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                 <div className="flex justify-start">
                 <div className="max-w-[80%]">
                   <div className="flex items-start space-x-2">
                     <div className="p-2 rounded-lg bg-neutral-100">
                       <Bot className="h-4 w-4 text-neutral-600" />
                     </div>
                     <div className="bg-neutral-100 rounded-lg p-3">
                       <div className="flex items-center space-x-1">
                         <Loader className="h-4 w-4 animate-spin text-neutral-600" />
                         <span className="text-sm text-neutral-600">Typing...</span>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-neutral-200 p-4">
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your legal question here..."
                    className="form-input resize-none pr-12"
                    rows={2}
                    disabled={isTyping}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="btn btn-primary px-4 self-end"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Information Box */}
          <div className="mt-6 card p-6 bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-3">
              <MessageSquare className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Important Notice</h3>
                <p className="text-blue-800 text-sm leading-relaxed">
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