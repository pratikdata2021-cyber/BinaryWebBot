import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ServiceNodeProps {
  title: string[];
  icon: LucideIcon;
  side: 'left' | 'right';
  iconColor: string;
}

const ServiceNode: React.FC<ServiceNodeProps> = ({ title, icon: Icon, side, iconColor }) => {
  const isLeft = side === 'left';

  return (
    <div className={`flex items-center gap-4 group cursor-default transition-transform hover:scale-105 duration-300 w-full ${isLeft ? 'justify-end text-right' : 'justify-start text-left'}`}>
      
      {/* Text Content (Left Side) */}
      {isLeft && (
        <div className="hidden md:flex flex-col">
          {title.map((line, i) => (
            <span key={i} className="text-gray-800 font-medium text-sm lg:text-[15px] leading-tight">
              {line}
            </span>
          ))}
        </div>
      )}

      {/* Icon Card */}
      <div className="relative z-10 bg-white p-3 lg:p-4 rounded-2xl shadow-card border border-gray-50 group-hover:shadow-lg group-hover:border-purple-100 transition-all">
        <Icon className={`w-6 h-6 lg:w-7 lg:h-7 ${iconColor}`} />
      </div>

      {/* Text Content (Right Side) */}
      {!isLeft && (
        <div className="hidden md:flex flex-col">
          {title.map((line, i) => (
            <span key={i} className="text-gray-800 font-medium text-sm lg:text-[15px] leading-tight">
              {line}
            </span>
          ))}
        </div>
      )}

      {/* Mobile Only Text (Below Icon) */}
      <div className="md:hidden absolute top-14 left-1/2 -translate-x-1/2 w-32 text-center bg-white/90 backdrop-blur-sm p-1 rounded border border-gray-100 shadow-sm z-20">
         <span className="text-xs font-medium text-gray-700">{title.join(' ')}</span>
      </div>
    </div>
  );
};

export default ServiceNode;