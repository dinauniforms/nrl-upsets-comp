
import React from 'react';

interface TeamLogoProps {
  logoUrl: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const TeamLogo: React.FC<TeamLogoProps> = ({ logoUrl, name, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12 md:w-16 md:h-16',
    lg: 'w-20 h-20'
  };

  return (
    <div className={`flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      <img 
        src={logoUrl} 
        alt={`${name} logo`}
        className="max-w-full max-h-full object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://www.nrl.com/symbol/nrl/badge.svg';
        }}
      />
    </div>
  );
};

export default TeamLogo;
