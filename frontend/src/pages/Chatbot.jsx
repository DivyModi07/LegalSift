import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader, MessageSquare } from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your legal assistant. I can help you with questions about Indian law, IPC sections, and general legal guidance. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Simple keyword-based responses
    if (message.includes('fraud') || message.includes('cheat') || message.includes('scam')) {
      return {
        content: 'Fraud cases typically fall under IPC Section 420 (Cheating and Dishonestly Inducing Delivery of Property). This is a serious offense with imprisonment up to 7 years and fine. For immediate assistance, contact your nearest police station.',
        suggestions: ['What is IPC Section 420?', 'How to file a fraud complaint?', 'What documents do I need?']
      };
    } else if (message.includes('theft') || message.includes('steal')) {
      return {
        content: 'Theft is covered under IPC Section 379. It involves dishonestly taking any movable property out of the possession of any person without their consent. The punishment is imprisonment up to 3 years, or fine, or both.',
        suggestions: ['What is IPC Section 379?', 'How to report theft?', 'What is the punishment for theft?']
      };
    } else if (message.includes('harassment') || message.includes('molest')) {
      return {
        content: 'Harassment and molestation cases are serious offenses. IPC Section 354 covers assault or criminal force to woman with intent to outrage her modesty. The punishment is imprisonment up to 2 years, or fine, or both.',
        suggestions: ['What is IPC Section 354?', 'How to file harassment complaint?', 'What are my rights?']
      };
    } else if (message.includes('murder') || message.includes('kill')) {
      return {
        content: 'Murder is the most serious offense under IPC Section 302. The punishment is death or imprisonment for life, and fine. This is a non-bailable and cognizable offense.',
        suggestions: ['What is IPC Section 302?', 'What is the difference between murder and culpable homicide?', 'What are the defenses available?']
      };
    } else if (message.includes('cyber') || message.includes('online') || message.includes('internet')) {
      return {
        content: 'Cyber crimes are covered under the Information Technology Act, 2000. Common offenses include identity theft (Section 66C), cyber fraud, and online harassment. These are serious offenses with specific punishments.',
        suggestions: ['What is cyber crime?', 'How to report cyber crime?', 'What is Section 66C?']
      };
    } else if (message.includes('property') || message.includes('land') || message.includes('house')) {
      return {
        content: 'Property disputes can involve various laws including the Transfer of Property Act, 1882, and specific IPC sections depending on the nature of the dispute. It\'s advisable to consult a property lawyer for specific guidance.',
        suggestions: ['What are property rights?', 'How to resolve property disputes?', 'What documents are needed?']
      };
    } else if (message.includes('police') || message.includes('fir') || message.includes('complaint')) {
      return {
        content: 'To file a police complaint, visit your nearest police station. For cognizable offenses, police must register an FIR. For non-cognizable offenses, you may need to approach the magistrate. Always carry relevant documents and evidence.',
        suggestions: ['What is an FIR?', 'What documents do I need?', 'What are cognizable offenses?']
      };
    } else if (message.includes('lawyer') || message.includes('advocate') || message.includes('legal help')) {
      return {
        content: 'For legal representation, you can contact the Bar Council of India or local bar associations. Many lawyers offer free initial consultations. You can also approach legal aid services if you cannot afford a lawyer.',
        suggestions: ['How to find a good lawyer?', 'What are legal aid services?', 'How much do lawyers charge?']
      };
    } else {
      return {
        content: 'I understand you have a legal question. While I can provide general information about Indian law, for specific legal advice, it\'s best to consult a qualified lawyer. You can also explore our IPC Explorer for detailed information about specific sections.',
        suggestions: ['Tell me about IPC sections', 'How to file a complaint?', 'What are my legal rights?']
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot thinking
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse.content,
        suggestions: botResponse.suggestions,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        {message.suggestions && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs opacity-75">Suggested questions:</p>
                            <div className="flex flex-wrap gap-2">
                              {message.suggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="text-xs px-2 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
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

              <div ref={messagesEndRef} />
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

          {/* Quick Questions */}
          <div className="mt-6 card p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Quick Questions</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                'What is IPC Section 420?',
                'How to file a police complaint?',
                'What are my rights if I am arrested?',
                'How to report cyber crime?',
                'What is the punishment for theft?',
                'How to find a good lawyer?'
              ].map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(question)}
                  className="text-left p-3 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors text-sm"
                >
                  {question}
                </button>
              ))}
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
