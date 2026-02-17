import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ChatWidget from './components/ChatWidget';

const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState('');

  const handleOpenChat = (query: string = '') => {
    setInitialQuery(query);
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white via-blue-50 to-white overflow-x-hidden selection:bg-purple-100 selection:text-purple-900 flex flex-col">
      <Navbar />
      
      {/* Main Content Area - Swaps between Hero and Chat Interface */}
      <div className="flex-1 flex flex-col">
        {isChatOpen ? (
          <ChatWidget 
            onClose={() => setIsChatOpen(false)} 
            initialQuery={initialQuery}
          />
        ) : (
          <Hero onSearchClick={handleOpenChat} />
        )}
      </div>
    </div>
  );
};

export default App;