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
    <div className={`relative flex items-center gap-3 group cursor-default transition-transform hover:scale-105 duration-300 w-full ${isLeft ? 'flex-row-reverse md:flex-row justify-start md:justify-end text-left md:text-right' : 'justify-start text-left'}`}>

      {/* Icon Card */}
      <div className="relative z-10 shrink-0 bg-white p-3 lg:p-4 rounded-2xl shadow-card border border-gray-50 group-hover:shadow-lg group-hover:border-purple-100 transition-all">
        <Icon className={`w-6 h-6 lg:w-7 lg:h-7 ${iconColor}`} />
      </div>

      {/* Text Content */}
      <div className="flex flex-col">
        {title.map((line, i) => (
          <span key={i} className="text-gray-800 font-medium text-xs md:text-sm lg:text-[15px] leading-tight">
            {line}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ServiceNode;