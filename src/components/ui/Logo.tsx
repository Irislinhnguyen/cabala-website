import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dark' | 'light';
  showText?: boolean;
  className?: string;
}

export default function Logo({ 
  size = 'md', 
  variant = 'default',
  showText = true,
  className = '' 
}: LogoProps) {
  const sizeMap = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-xl' },
    lg: { icon: 40, text: 'text-2xl' },
    xl: { icon: 48, text: 'text-3xl' }
  };

  const colorMap = {
    default: {
      text: '#0f172a'
    },
    dark: {
      text: '#ffffff'
    },
    light: {
      text: '#ffffff'
    }
  };

  const colors = colorMap[variant];
  const sizes = sizeMap[size];

  return (
    <div className={`flex items-center ${className}`}>
      {/* Logo Image - Using actual Cabala.png */}
      <Image 
        src="/Cabala.png" 
        alt="Cabala"
        width={sizes.icon}
        height={sizes.icon}
        className="mr-2 object-contain"
      />

      {/* Text */}
      {showText && (
        <span 
          className={`font-bold ${sizes.text} tracking-tight`}
          style={{ color: colors.text }}
        >
          Cabala
        </span>
      )}
    </div>
  );
}