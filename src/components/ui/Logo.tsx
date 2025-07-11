import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo = ({ className, size = 'md', showText = true }: LogoProps) => {
  const logoSizes = {
    sm: { width: 32, height: 32 },
    md: { width: 40, height: 40 },
    lg: { width: 56, height: 56 },
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={cn('flex items-center space-x-3', className)}>
      {/* Real Cabala Logo */}
      <div className="relative">
        <Image
          src="/Cabala.png"
          alt="Cabala Logo"
          width={logoSizes[size].width}
          height={logoSizes[size].height}
          className="object-contain"
          priority
        />
      </div>
      
      {showText && (
        <span className={cn(
          'font-bold text-cabala-navy',
          textSizeClasses[size]
        )}>
          Cabala
        </span>
      )}
    </div>
  );
};

export default Logo;