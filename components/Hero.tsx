import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  RefreshCw, 
  FileText, 
  BarChart3, 
  FileSearch, 
  Bot, 
  MessageSquare, 
  ShieldCheck, 
  ArrowRight,
  Search,
  Sparkles
} from 'lucide-react';
import GlobeVisual from './GlobeVisual';
import ServiceNode from './ServiceNode';

interface HeroProps {
  onSearchClick?: (query: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onSearchClick }) => {
  const [inputValue, setInputValue] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const fullPlaceholder = "Ask, search, and explore with iChatrobo";

  // Typewriter effect for placeholder
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullPlaceholder.length) {
        setPlaceholder(fullPlaceholder.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50); // Speed of typing

    return () => clearInterval(typingInterval);
  }, []);

  const handleSubmit = () => {
    if (onSearchClick) {
      onSearchClick(inputValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <main className="relative flex flex-col items-center justify-center pt-8 pb-20 lg:pt-12 px-4 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
      
      {/* Background decorative gradients */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-100/30 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-100/30 rounded-full blur-[100px] -z-10"></div>

      {/* Main Grid Content */}
      <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-12 items-center justify-items-center mb-16">
        
        {/* Left Column Services */}
        <div className="flex flex-col gap-12 lg:gap-20 w-full max-w-xs md:max-w-none">
          <ServiceNode 
            side="left" 
            icon={Truck} 
            iconColor="text-red-500" 
            title={['Smart Fleet', 'Management']} 
          />
          <ServiceNode 
            side="left" 
            icon={RefreshCw} 
            iconColor="text-purple-600" 
            title={['Frictionless Plant &', 'Process Management']} 
          />
          <ServiceNode 
            side="left" 
            icon={FileText} 
            iconColor="text-teal-600" 
            title={['Next-Gen Tax', 'Technology']} 
          />
          <ServiceNode 
            side="left" 
            icon={BarChart3} 
            iconColor="text-blue-800" 
            title={['Data That Drives', 'Decisions']} 
          />
        </div>

        {/* Center Globe Visualization */}
        <div className="relative flex items-center justify-center py-10 md:py-0">
          <GlobeVisual />
          
          {/* Faint connection lines (CSS Only decoration) */}
          <div className="hidden md:block absolute w-[120%] h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent top-1/4 -z-10 opacity-30"></div>
          <div className="hidden md:block absolute w-[120%] h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent bottom-1/4 -z-10 opacity-30"></div>
        </div>

        {/* Right Column Services */}
        <div className="flex flex-col gap-12 lg:gap-20 w-full max-w-xs md:max-w-none">
          <ServiceNode 
            side="right" 
            icon={FileSearch} 
            iconColor="text-blue-500" 
            title={['Gen-AI Document', 'Intelligence']} 
          />
          <ServiceNode 
            side="right" 
            icon={Bot} 
            iconColor="text-purple-700" 
            title={['Conversational AI', 'Enterprises']} 
          />
          <ServiceNode 
            side="right" 
            icon={MessageSquare} 
            iconColor="text-red-400" 
            title={['Simplified Intelligent', 'Insurance Automation']} 
          />
          <ServiceNode 
            side="right" 
            icon={ShieldCheck} 
            iconColor="text-cyan-500" 
            title={['Empowering Workforce', 'Operations']} 
          />
        </div>
      </div>

      {/* Main Headline */}
      <div className="text-center mb-10 z-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl text-gray-900 font-light mb-2">
          Experiential World that Connects
        </h1>
        <h2 className="text-4xl md:text-5xl lg:text-6xl text-gray-900 font-bold tracking-tight">
          People
        </h2>
      </div>

      {/* Search Bar Section - Acts as Trigger */}
      <div className="w-full max-w-3xl relative z-20 flex flex-col items-center gap-8">
        {/* Glow effect behind search */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cyan-200/30 blur-3xl rounded-full -z-10"></div>
        
        {/* Search Input Trigger */}
        <div className="w-full relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pl-2 pointer-events-none z-10">
             {/* The colorful orb icon inside input */}
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center text-white shadow-md">
                <Sparkles size={16} className="animate-pulse" />
             </div>
          </div>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full py-4 pl-16 pr-14 text-lg text-gray-700 bg-white border border-gray-200 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all placeholder:text-gray-400 placeholder:font-light"
            placeholder={placeholder}
          />
          <button 
            onClick={handleSubmit}
            className="absolute inset-y-0 right-3 flex items-center justify-center w-10 h-10 my-auto text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all z-10"
          >
            <ArrowRight size={24} />
          </button>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap justify-center gap-3 w-full">
          {[
            'Looking for smarter insurance?',
            'Ready to optimize fleets?',
            'Exploring data-driven growth?',
            'Planning digital transformation?',
            'Aiming for smarter operations?'
          ].map((chip, idx) => (
            <button 
              key={idx}
              onClick={() => onSearchClick?.(chip)}
              className="bg-blue-50/80 hover:bg-blue-100 text-slate-600 hover:text-slate-800 px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-colors border border-blue-100"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Hero;