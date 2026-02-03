import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textClassName?: string;
}

const Logo: React.FC<LogoProps> = ({
  className,
  size = 32,
  showText = true,
  textClassName,
}) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div 
        className="relative flex items-center justify-center bg-[#0FA3B1] rounded overflow-hidden"
        style={{ width: size, height: size }}
      >
        <Image
          src="/globe.svg"
          alt="Stratigen AI Logo"
          width={size * 0.7}
          height={size * 0.7}
          className="brightness-0 invert"
        />
      </div>
      {showText && (
        <span className={cn("font-bold tracking-tight uppercase", textClassName)} style={{ fontSize: size * 0.56 }}>
          Stratigen AI
        </span>
      )}
    </div>
  );
};

export default Logo;
