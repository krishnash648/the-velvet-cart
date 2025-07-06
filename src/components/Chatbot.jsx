import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import products from '../data/products';
import { toast } from 'react-hot-toast';

const chatbotResponses = {
  greetings: [
    "Hello! 👋 How can I help you today?",
    "Hi there! Welcome to Velvet Cart. What can I assist you with?",
    "Hey! I'm your shopping assistant. What would you like to know?"
  ],
  product_search: [
    "I can help you find products! What are you looking for?",
    "Let me search for that for you. What product category interests you?",
    "I'll help you discover the perfect product. What's on your mind?"
  ],
  order_tracking: [
    "I can help you track your order! Do you have an order ID?",
    "Let me assist with order tracking. What's your order number?",
    "I'll help you check your order status. Got your order ID handy?"
  ],
  recommendations: [
    "Based on your interests, here are some great products:",
    "I think you might like these recommendations:",
    "Here are some trending products you might enjoy:"
  ],
  cart_help: [
    "I can help you with your cart! What would you like to know?",
    "Let me assist with your shopping cart. What do you need help with?",
    "I'm here to help with your cart. What's the issue?"
  ],
  shipping: [
    "We offer free shipping on orders over ₹999!",
    "Standard delivery takes 3-5 business days.",
    "Express delivery is available for ₹199 extra."
  ],
  returns: [
    "We have a 30-day return policy for most items.",
    "Returns are easy! Just contact our support team.",
    "You can return items within 30 days of purchase."
  ],
  payment: [
    "We accept all major credit cards, UPI, and digital wallets.",
    "Payment options include cards, UPI, and online banking.",
    "Secure payment processing with multiple options available."
  ]
};

const quickReplies = [
  { text: "Find Products", action: "product_search" },
  { text: "Track Order", action: "order_tracking" },
  { text: "Cart Help", action: "cart_help" },
  { text: "Shipping Info", action: "shipping" },
  { text: "Returns", action: "returns" },
  { text: "Payment", action: "payment" }
];

// Modern Cool Robot Icon
const RobotIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" fill="#6366f1" stroke="#a855f7" strokeWidth="2" />
    <ellipse cx="20" cy="25" rx="10" ry="5" fill="#fff" opacity="0.15" />
    <rect x="12" y="14" width="16" height="10" rx="5" fill="#fff" />
    <rect x="16" y="10" width="8" height="6" rx="3" fill="#a855f7" />
    <rect x="10" y="17" width="3" height="6" rx="1.5" fill="#a855f7" />
    <rect x="27" y="17" width="3" height="6" rx="1.5" fill="#a855f7" />
    <circle cx="16" cy="19" r="2" fill="#6366f1" />
    <circle cx="24" cy="19" r="2" fill="#6366f1" />
    <rect x="18" y="22" width="4" height="2" rx="1" fill="#a855f7" />
    <rect x="19.25" y="6" width="1.5" height="4" rx="0.75" fill="#a855f7" />
    <circle cx="20" cy="6" r="1.5" fill="#fff" stroke="#a855f7" strokeWidth="1" />
  </svg>
);

export default function Chatbot() {
  const { user } = useAuth();
  const { cart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      setTimeout(() => {
        addBotMessage(getRandomResponse('greetings'));
        setTimeout(() => {
          addBotMessage("I can help you with product searches, order tracking, recommendations, and more! What would you like to do?");
        }, 1000);
      }, 500);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getRandomResponse = (category) => {
    const responses = chatbotResponses[category];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const addBotMessage = (text, delay = 0, isProductList = false) => {
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text, timestamp: new Date(), isProductList }]);
      setIsTyping(false);
    }, delay);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { type: 'user', text, timestamp: new Date() }]);
  };

  const handleProductClick = (productName) => {
    const product = products.find(p => p.name.toLowerCase().includes(productName.toLowerCase()));
    if (product) {
      window.location.href = `/product/${product.id}`;
    }
  };

  const processUserInput = async (input) => {
    const lowerInput = input.toLowerCase();
    
    // Product search
    if (lowerInput.includes('product') || lowerInput.includes('find') || lowerInput.includes('search')) {
      addBotMessage(getRandomResponse('product_search'));
      setTimeout(() => {
        const categories = [...new Set(products.map(p => p.category))];
        addBotMessage(`We have products in these categories: ${categories.join(', ')}. What interests you?`);
      }, 1000);
    }
    
    // Specific product search
    else if (lowerInput.includes('headphone') || lowerInput.includes('earphone') || lowerInput.includes('audio')) {
      addBotMessage("I found some great audio products for you:");
      setTimeout(() => {
        const audioProducts = products.filter(p => 
          p.category === 'Audio' || p.name.toLowerCase().includes('headphone') || p.name.toLowerCase().includes('earphone')
        ).slice(0, 3);
        
        const productList = audioProducts.map(p => 
          `• ${p.name} - ₹${p.price.toLocaleString()} (${p.rating}★)`
        ).join('\n');
        
        addBotMessage(productList, 0, true);
      }, 1000);
    }
    
    else if (lowerInput.includes('camera') || lowerInput.includes('photo') || lowerInput.includes('video')) {
      addBotMessage("Here are some camera and video products:");
      setTimeout(() => {
        const cameraProducts = products.filter(p => 
          p.category === 'Electronics' || p.name.toLowerCase().includes('camera') || p.name.toLowerCase().includes('action')
        ).slice(0, 3);
        
        const productList = cameraProducts.map(p => 
          `• ${p.name} - ₹${p.price.toLocaleString()} (${p.rating}★)`
        ).join('\n');
        
        addBotMessage(productList, 0, true);
      }, 1000);
    }
    
    else if (lowerInput.includes('watch') || lowerInput.includes('fitness') || lowerInput.includes('smart')) {
      addBotMessage("Check out these smart devices:");
      setTimeout(() => {
        const smartProducts = products.filter(p => 
          p.category === 'Wearables' || p.name.toLowerCase().includes('watch') || p.name.toLowerCase().includes('fitness')
        ).slice(0, 3);
        
        const productList = smartProducts.map(p => 
          `• ${p.name} - ₹${p.price.toLocaleString()} (${p.rating}★)`
        ).join('\n');
        
        addBotMessage(productList, 0, true);
      }, 1000);
    }
    
    // Order tracking
    else if (lowerInput.includes('order') || lowerInput.includes('track') || lowerInput.includes('delivery')) {
      addBotMessage(getRandomResponse('order_tracking'));
      setTimeout(() => {
        addBotMessage("You can track your order by going to the 'Track Order' page or entering your order ID here.");
      }, 1000);
    }
    
    // Cart help
    else if (lowerInput.includes('cart') || lowerInput.includes('basket')) {
      addBotMessage(getRandomResponse('cart_help'));
      setTimeout(() => {
        const itemCount = cart.length;
        const totalValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        addBotMessage(`You currently have ${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart worth ₹${totalValue.toLocaleString()}. Would you like to view it?`);
      }, 1000);
    }
    
    // Shipping
    else if (lowerInput.includes('shipping') || lowerInput.includes('delivery') || lowerInput.includes('shipping')) {
      addBotMessage(getRandomResponse('shipping'));
    }
    
    // Returns
    else if (lowerInput.includes('return') || lowerInput.includes('refund')) {
      addBotMessage(getRandomResponse('returns'));
    }
    
    // Payment
    else if (lowerInput.includes('payment') || lowerInput.includes('pay') || lowerInput.includes('card')) {
      addBotMessage(getRandomResponse('payment'));
    }
    
    // Recommendations
    else if (lowerInput.includes('recommend') || lowerInput.includes('suggest')) {
      addBotMessage(getRandomResponse('recommendations'));
      setTimeout(() => {
        const trendingProducts = products
          .sort((a, b) => b.reviews - a.reviews)
          .slice(0, 3);
        
        const recommendations = trendingProducts.map(p => 
          `• ${p.name} - ₹${p.price.toLocaleString()} (${p.rating}★)`
        ).join('\n');
        
        addBotMessage(recommendations, 0, true);
      }, 1000);
    }
    
    // Price alerts
    else if (lowerInput.includes('price') || lowerInput.includes('alert') || lowerInput.includes('drop')) {
      addBotMessage("I can help you set up price alerts! When you view a product, you'll see a 📧 button to set price drop notifications.");
    }
    
    // Wishlist
    else if (lowerInput.includes('wishlist') || lowerInput.includes('save') || lowerInput.includes('favorite')) {
      addBotMessage("You can save products to your wishlist by clicking the ❤️ button on any product. View your wishlist in your profile!");
    }
    
    // Greeting
    else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      addBotMessage(getRandomResponse('greetings'));
    }
    
    // Help
    else if (lowerInput.includes('help')) {
      addBotMessage("I can help you with:\n• Finding products (audio, cameras, smart devices)\n• Order tracking\n• Cart assistance\n• Shipping info\n• Returns\n• Payment options\n• Price alerts\n• Wishlist management\n\nWhat do you need help with?");
    }
    
    // Default response
    else {
      addBotMessage("I'm not sure I understood that. Try asking me about:\n• Products (headphones, cameras, smart watches)\n• Orders and tracking\n• Cart and shipping\n• Price alerts\n• Or just say 'help' for more options!");
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = inputValue.trim();
    addUserMessage(userMessage);
    setInputValue('');
    setIsTyping(true);
    
    await processUserInput(userMessage);
  };

  const handleQuickReply = (action) => {
    addUserMessage(action);
    setIsTyping(true);
    processUserInput(action);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-3xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 z-50 border-2 border-white/20 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="flex items-center justify-center w-full h-full">
          {isOpen ? (
            <span className="text-3xl">✕</span>
          ) : (
            <span className="block animate-pulse">
              <RobotIcon size={40} />
            </span>
          )}
        </div>
        {!isOpen && (
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        {!isOpen && (
          <motion.div
            className="absolute -bottom-1 -left-1 bg-white/90 text-black text-xs px-2 py-1 rounded-lg font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            AI Help
          </motion.div>
        )}
      </motion.button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white/60 backdrop-blur-2xl rounded-3xl border-2 border-white/30 shadow-2xl z-40 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/30 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                  <RobotIcon size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Help Chatbot</h3>
                  <p className="text-xs text-gray-200">Your shopping companion</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
              >
                ✕
              </button>
            </div>
            <div className="border-b border-white/20"></div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 shadow ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-white text-gray-900 border border-white/30'
                    }`}
                  >
                    {message.isProductList ? (
                      <div>
                        {message.text.split('\n').map((line, index) => {
                          if (line.startsWith('•')) {
                            const productName = line.split(' - ')[0].substring(2);
                            return (
                              <button
                                key={index}
                                onClick={() => handleProductClick(productName)}
                                className="block text-left text-sm hover:text-purple-300 transition-colors mb-1"
                              >
                                {line}
                              </button>
                            );
                          }
                          return <p key={index} className="text-sm mb-1">{line}</p>;
                        })}
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                    )}
                    <p className="text-xs opacity-70 mt-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/30 text-white rounded-2xl px-4 py-3 border border-white/20 shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">🤖</span>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length === 0 && (
              <div className="p-4 border-t border-white/20 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
                <p className="text-xs text-gray-300 mb-3 font-medium">Quick actions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(reply.text)}
                      className="px-3 py-2 bg-white/20 text-white text-xs rounded-full hover:bg-white/30 transition-colors border border-white/20 font-medium"
                    >
                      {reply.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-white/20 bg-white/60 rounded-b-3xl">
              <div className="flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-3 bg-white border border-white/30 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className={`px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center ${
                    inputValue.trim()
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {/* Paper plane SVG */}
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M2 21l21-9-21-9v7l15 2-15 2v7z" fill="currentColor"/></svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 