import React, { useEffect, useRef, useState } from 'react';
import { X, ArrowRight, Sparkles, Copy, ThumbsUp, ThumbsDown, RotateCcw, Share2, Mail, User, Plus, Download, ExternalLink, ChevronDown } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import scrapedData from '@/scraped_content_b0453cbe-8590-4143-a6b3-0fb851d2ba7e (1).json';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Prepare context from scraped data (truncate to avoid excessive payload size if needed)
const websiteContext = Object.entries(scrapedData)
  .filter(([key]) => key !== 'processed_urls')
  .map(([url, content]) => `Source: ${url}\n${content}`)
  .join('\n\n')
  .substring(0, 400000); // ~100k tokens for fast processing

interface ChatWidgetProps {
  onClose: () => void;
  initialQuery?: string;
}

// Structured response type for rich UI
interface RichResponse {
  intro: string;
  sections: { content: string }[];
  related: {
    title: string;
    type: 'Learn more' | 'Download brochure' | 'Case study';
    image: string;
    url: string;
  }[];
  suggestions: string[];
}

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string; // Plain text fallback
  richData?: RichResponse; // Optional rich data
}

const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// --- Sub-component: Message Action Bar ---
const MessageActionBar = ({ 
  onShare, 
  className = '' 
}: { 
  onShare: (p: 'whatsapp' | 'email') => void, 
  className?: string 
}) => (
  <div className={`flex items-center justify-between w-full max-w-4xl mt-3 px-1 ${className}`}>
      <div className="flex items-center gap-3">
           <button className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-purple-600 transition-colors">
              <RotateCcw size={13} /> 
              Regenerate 
           </button>
           <div className="flex items-center gap-1">
               <button className="p-1 text-gray-400 hover:text-purple-600 transition-colors" title="Thumbs Up"><ThumbsUp size={14} /></button>
               <button className="p-1 text-gray-400 hover:text-purple-600 transition-colors" title="Thumbs Down"><ThumbsDown size={14} /></button>
           </div>
      </div>
      
      <div className="flex items-center gap-2">
           <button className="p-1 text-gray-400 hover:text-green-600 transition-colors" onClick={() => onShare('whatsapp')} title="WhatsApp"><WhatsAppIcon size={15} /></button>
           <button className="p-1 text-gray-400 hover:text-purple-600 transition-colors" onClick={() => onShare('email')} title="Email"><Mail size={15} /></button>
           <button className="p-1 text-gray-400 hover:text-purple-600 transition-colors" title="Copy"><Copy size={14} /></button>
      </div>
  </div>
);

// --- Sub-component: Bot Message Renderer ---
const BotMessageRenderer = ({ 
  data, 
  onSuggestionClick,
  onShare
}: { 
  data: RichResponse, 
  onSuggestionClick: (s: string) => void,
  onShare: (p: 'whatsapp' | 'email') => void
}) => {
  const [displayedIntro, setDisplayedIntro] = useState('');
  const [showSections, setShowSections] = useState(false);

  useEffect(() => {
    let i = 0;
    const text = data.intro;
    // Faster typing speed for a snappier feel
    const interval = setInterval(() => {
      setDisplayedIntro(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setTimeout(() => setShowSections(true), 200); // Small pause before showing rest
      }
    }, 10);
    return () => clearInterval(interval);
  }, [data.intro]);

  return (
    <div className="w-full max-w-4xl space-y-8">
      
      {/* 1. Main Text Response */}
      <div className="space-y-5">
        <p className="text-[15px] leading-relaxed text-gray-800">
           {displayedIntro}
           {!showSections && <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-purple-500 animate-pulse" />}
        </p>
        
        {/* Bullet Points */}
        <div className={`space-y-4 transition-all duration-700 ease-out ${showSections ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {data.sections.map((section, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <div className="flex-shrink-0 mt-2">
                 <div className="w-2 h-2 rounded-full bg-[#c084fc]"></div>
              </div>
              <div className="text-[15px] leading-relaxed text-gray-800">
                 {/* Safe to use strictly for bolding provided by our mock data */}
                 <span dangerouslySetInnerHTML={{ __html: section.content }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. CTA Section (Static) */}
      <div className={`space-y-2 pt-1 text-[15px] text-gray-700 leading-relaxed transition-all duration-700 delay-200 ease-out ${showSections ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <p>
          If you’d like to see specific business cases or request tailored solution mapping, please <a href="https://binarysemantics.com/contact-us" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-0.5">Request a proposal <ExternalLink size={13} strokeWidth={2.5} /></a>.
        </p>
        <p>
          For more details or collaboration opportunities, please <a href="https://binarysemantics.com/contact-us" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-0.5">Contact Us <ExternalLink size={13} strokeWidth={2.5} /></a>.
        </p>
      </div>

      {/* 3. Related Content Cards */}
      <div className={`transition-all duration-700 delay-300 ease-out ${showSections ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          Related content
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.related.map((item, idx) => (
            <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" className="group relative h-48 rounded-xl overflow-hidden cursor-pointer shadow-card border border-gray-100 hover:shadow-xl transition-all duration-300 bg-gray-900 block">
              {/* Image Background */}
              <img 
                src={item.image} 
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-60"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              
              {/* Content */}
              <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-md p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/20">
                 {item.type === 'Download brochure' ? <Download size={14} /> : <ExternalLink size={14} />}
              </div>

              <div className="absolute bottom-0 left-0 p-4 w-full">
                <h4 className="text-white font-bold text-[15px] mb-2 leading-tight drop-shadow-sm">{item.title}</h4>
                <div className="flex items-center text-white/90 text-xs font-medium group-hover:text-white transition-colors">
                  <span>{item.type}</span>
                  <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 4. Follow-up Questions (Accordion Style) */}
      <div className={`transition-all duration-700 delay-500 ease-out ${showSections ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
         <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold text-lg">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-gray-700">
                <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>What would you like to ask next?</h3>
         </div>
         <div className="flex flex-col gap-2">
            {data.suggestions.map((suggestion, idx) => (
                <button 
                  key={idx}
                  onClick={() => onSuggestionClick(suggestion)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50/80 hover:bg-white border border-gray-100 hover:border-purple-200 rounded-lg text-left transition-all duration-200 group shadow-sm hover:shadow-md"
                >
                    <span className="text-gray-700 font-medium text-[15px] group-hover:text-purple-700">{suggestion}</span>
                    <div className="w-6 h-6 rounded-full bg-gray-200 group-hover:bg-purple-100 flex items-center justify-center text-gray-500 group-hover:text-purple-600 transition-colors">
                        <Plus size={14} />
                    </div>
                </button>
            ))}
         </div>
      </div>
      
      {/* 5. Action Bar (Moved here for proper sequencing) */}
      <MessageActionBar 
          onShare={onShare} 
          className={`transition-all duration-700 delay-700 ease-out ${showSections ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      />

    </div>
  );
};


const ChatWidget: React.FC<ChatWidgetProps> = ({ onClose, initialQuery = '' }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const initialQueryHandled = useRef(false);

  const suggestions = [
    'Looking for smarter insurance with VISoF?',
    'Ready to optimize fleets with Fleetrobo?',
    'Streamlining compliance with GSTrobo?',
    'Exploring AI Products for growth?',
    'Planning digital transformation (DX)?',
    'Aiming to innovate with EdTech?'
  ];

  const fullPlaceholder = "Ask, search, and explore with iChatrobo";
  const [placeholder, setPlaceholder] = useState('');
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullPlaceholder.length) {
        setPlaceholder(fullPlaceholder.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);
    return () => clearInterval(typingInterval);
  }, []);

  // --- MOCK DATA GENERATOR ---
  const getBotResponseData = (text: string): RichResponse => {
    const t = text.toLowerCase();
    
    // Default / Generic Response Structure
    let response: RichResponse = {
      intro: "Binary Semantics offers a comprehensive global portfolio of products, platforms, frameworks and solutions spanning industries including technology, insurance, automotive, and retail. These offerings combine software innovation, cloud strategy, and data intelligence to enable enterprises to achieve scalability and digital transformation globally.",
      sections: [
        { content: "The <span class='font-bold text-gray-900'>Products and Platforms</span> portfolio delivers a robust mix of proprietary software and an expansive partnership ecosystem. It supports enterprise-grade <span class='font-bold text-gray-900'>AI automation, digital commerce</span> and <span class='font-bold text-gray-900'>data management</span> products backed by ROI-focused offerings." },
        { content: "Across <span class='font-bold text-gray-900'>financial services</span>, our Intelligent Insurance Automation suite combines <span class='font-bold text-gray-900'>microservices architecture</span> and <span class='font-bold text-gray-900'>AI-driven analytics</span> for seamless policy lifecycle management and claims processing." },
        { content: "In <span class='font-bold text-gray-900'>Fleet & Logistics</span>, our Smart Fleet Management ecosystem brings together <span class='font-bold text-gray-900'>IoT hardware, real-time telematics</span> and <span class='font-bold text-gray-900'>predictive maintenance</span> frameworks for accelerated operational efficiency." }
      ],
      related: [
        {
          title: "Intelligent Insurance Automation Suite",
          type: "Learn more",
          image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=400&auto=format&fit=crop",
          url: "https://www.binarysemantics.com/industries/insurance"
        },
        {
          title: "Binary Semantics and Google Cloud Partnership",
          type: "Case study",
          image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=400&auto=format&fit=crop",
          url: "https://www.binarysemantics.com/case-studies"
        },
        {
          title: "Smart Fleet Management Solutions Brochure",
          type: "Download brochure",
          image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=400&auto=format&fit=crop",
          url: "https://www.binarysemantics.com/products/fleetrobo"
        }
      ],
      suggestions: [
        "What are Binary Semantics' flagship software and platforms?",
        "Which industries do the digital and cloud services target?",
        "How does the Fleet Management solution optimize costs?"
      ]
    };

    // Specific Overrides based on keywords
    if (t.includes('fleet') || t.includes('transport')) {
      response.intro = "Our Smart Fleet Management ecosystem is designed to revolutionize logistics. By leveraging IoT-enabled telematics and real-time data analytics, we provide complete visibility into fleet performance, ensuring safety, compliance, and cost efficiency.";
      response.sections = [
         { content: "Real-time <span class='font-bold text-gray-900'>Vehicle Tracking</span> and route optimization to minimize fuel consumption and delivery delays." },
         { content: "<span class='font-bold text-gray-900'>Predictive Maintenance</span> alerts that prevent costly breakdowns by analyzing engine health data." },
         { content: "Comprehensive <span class='font-bold text-gray-900'>Driver Behavior Analysis</span> to improve safety standards and reduce insurance premiums." }
      ];
      response.related[0] = { title: "Fleet Telematics Dashboard Demo", type: "Learn more", image: "https://images.unsplash.com/photo-1592861956120-e524fc739696?q=80&w=400", url: "https://www.binarysemantics.com/products/fleetrobo" };
      response.suggestions = ["How does the driver behavior scoring work?", "Can this integrate with existing ERP systems?", "What hardware is required for tracking?"];
    }

    else if (t.includes('insurance')) {
      response.intro = "Binary Semantics empowers the insurance sector with Intelligent Insurance Automation. We streamline the entire policy lifecycle—from risk assessment to claims processing—using Generative AI and Machine Learning to reduce operational costs by up to 30%.";
      response.sections = [
         { content: "<span class='font-bold text-gray-900'>Automated Underwriting</span> engine that assesses risk in real-time using alternative data sources." },
         { content: "AI-driven <span class='font-bold text-gray-900'>Claims Processing</span> that reduces turnaround time from days to minutes." },
         { content: "Hyper-personalized <span class='font-bold text-gray-900'>Customer Engagement</span> tools powered by conversational AI." }
      ];
      response.related[0] = { title: "AI in Insurance: A Whitepaper", type: "Download brochure", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=400", url: "https://www.binarysemantics.com/industries/insurance" };
      response.suggestions = ["How does the fraud detection system work?", "Is the platform compliant with GDPR?", "Can I see a demo of the claims module?"];
    }

    return response;
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const newMessage: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a helpful assistant for Binary Semantics. Answer the user's query based on the provided scraped website content.
        
        Website Content:
        ${websiteContext}
        
        User Query: ${text}
        
        Provide a structured response.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              intro: { type: Type.STRING, description: "A short introductory paragraph answering the query." },
              sections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    content: { type: Type.STRING, description: "A detailed point or section. You can use HTML <span> tags with Tailwind classes like <span class='font-bold text-gray-900'> for emphasis." }
                  }
                }
              },
              related: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    type: { type: Type.STRING, description: "Must be one of: 'Learn more', 'Download brochure', 'Case study'" },
                    image: { type: Type.STRING, description: "A relevant Unsplash image URL, e.g., https://images.unsplash.com/photo-..." },
                    url: { type: Type.STRING, description: "A relevant URL from the provided website content." }
                  }
                }
              },
              suggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 follow-up questions the user can ask."
              }
            },
            required: ["intro", "sections", "related", "suggestions"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}") as RichResponse;
      
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'bot', 
        content: data.intro, 
        richData: data 
      }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      // Fallback to mock data if API fails
      const data = getBotResponseData(text);
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'bot', 
        content: data.intro, 
        richData: data 
      }]);
    }
  };

  // Initial Query & Scroll handlers
  useEffect(() => {
    if (initialQuery && !initialQueryHandled.current) {
      handleSend(initialQuery);
      initialQueryHandled.current = true;
    } else if (!initialQuery) {
        setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend(inputValue);
  };

  // Share menu logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    };
    if (showShareMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showShareMenu]);

  const handleShare = (platform: 'whatsapp' | 'email') => {
    const text = "Check out this information from Binary Semantics!";
    const url = window.location.href;
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    } else if (platform === 'email') {
      window.open(`mailto:?subject=Information from Binary Semantics&body=${encodeURIComponent(text + '\n\n' + url)}`, '_blank');
    }
    setShowShareMenu(false);
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-white animate-fade-in-up relative">
      <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col relative">
        
        {/* Header / Close Button */}
        <div className="absolute top-4 right-6 z-20">
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors group"
            title="Close Chat"
          >
            <X size={24} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 md:px-12 pt-6 pb-0 custom-scrollbar flex flex-col space-y-6 mt-4">
          
          {messages.map((msg) => (
             msg.role === 'bot' ? (
                // --- BOT MESSAGE ---
                <div key={msg.id} className="flex gap-4 md:gap-6 animate-fade-in-up">
                   <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9d1f88] to-purple-400 flex items-center justify-center text-white shadow-sm ring-4 ring-purple-50">
                        <Sparkles size={18} />
                      </div>
                   </div>
                   
                   <div className="flex-1 space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-[#9d1f88]">iChatrobo</h3>
                      </div>
                      
                      {/* Rich Content Renderer */}
                      {msg.richData ? (
                        <BotMessageRenderer 
                            data={msg.richData} 
                            onSuggestionClick={handleSend} 
                            onShare={handleShare}
                        />
                      ) : (
                        <div className="space-y-4">
                          <p className="text-[15px] text-gray-700 leading-relaxed">{msg.content}</p>
                          <MessageActionBar onShare={handleShare} />
                        </div>
                      )}
                      
                   </div>
                </div>
             ) : (
                // --- USER MESSAGE ---
                <div key={msg.id} className="flex justify-end animate-fade-in-up">
                    <div className="flex gap-3 max-w-[85%] md:max-w-[75%]">
                      <div className="bg-[#f0f9ff] border border-blue-100 text-gray-800 px-5 py-3.5 rounded-2xl rounded-tr-sm shadow-sm">
                          <p className="text-[15px] leading-relaxed">{msg.content}</p>
                      </div>
                      <div className="flex-shrink-0 mt-auto">
                           <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200">
                              <User size={16} />
                           </div>
                      </div>
                    </div>
                </div>
             )
          ))}

          {isTyping && (
             <div className="flex gap-4 md:gap-6 animate-fade-in-up">
                <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9d1f88] to-purple-400 flex items-center justify-center text-white shadow-sm ring-4 ring-purple-50">
                       <Sparkles size={18} className="animate-pulse" />
                    </div>
                </div>
                <div className="flex-1 py-3">
                     <div className="flex space-x-1.5">
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                     </div>
                </div>
             </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Footer Input Area */}
        <div className="px-6 py-2 md:px-10 md:py-4 bg-white z-10 border-t border-gray-50/50 sticky bottom-0">
          <div className="max-w-4xl mx-auto space-y-3">
            
            {/* Chips */}
            {messages.length === 0 && (
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {suggestions.map((chip, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleSend(chip)}
                  disabled={isTyping}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700/80 hover:text-blue-900 text-sm font-medium rounded-full transition-colors border border-blue-100/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {chip}
                </button>
              ))}
            </div>
            )}

            {/* Search Bar */}
            <div className="relative group w-full">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                 <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center text-white shadow-md">
                    <Sparkles size={18} className="animate-pulse" />
                 </div>
              </div>
              <input 
                ref={inputRef}
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full py-5 pl-16 pr-16 text-lg text-gray-700 bg-white border border-gray-200 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all placeholder:text-gray-400 font-light"
              />
              <button 
                onClick={() => handleSend(inputValue)}
                className="absolute inset-y-0 right-3 flex items-center justify-center w-11 h-11 my-auto text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
              >
                <ArrowRight size={26} strokeWidth={1.5} />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatWidget;