import React, { useState } from 'react';
import { School } from 'lucide-react';

interface SchoolImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  fallbackCategory?: string;
}

export const SchoolImage: React.FC<SchoolImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
  fallbackCategory,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white p-6 text-center select-none ${className}`}>
        <div className="w-12 h-12 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-bold mb-3 shadow-md">
          <School className="w-6 h-6 text-blue-950" />
        </div>
        {fallbackCategory && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-1">
            {fallbackCategory}
          </span>
        )}
        <p className="text-sm font-bold font-serif-school text-slate-100 line-clamp-2">
          {fallbackTitle || alt || 'Hassan Scholars Public School'}
        </p>
        <span className="text-[11px] text-slate-400 mt-1">Zafarwal Campus</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || 'Hassan Scholars Public School'}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => {
        console.warn(`Image failed to load: ${src}. Activating graceful fallback.`);
        setHasError(true);
      }}
      {...props}
    />
  );
};
