import React from 'react';
import { motion } from 'framer-motion';
import { WindowInstance } from '../types/os';
import { X, Minus, Maximize2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface WindowProps {
  window: WindowInstance;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  onUpdate: (id: string, updates: Partial<WindowInstance>) => void;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({ 
  window, 
  onClose, 
  onFocus, 
  onUpdate, 
  children 
}) => {
  const isMaximized = window.state === 'maximized';

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        x: isMaximized ? 0 : window.position.x,
        y: isMaximized ? 0 : window.position.y,
        width: isMaximized ? '100%' : window.size.width,
        height: isMaximized ? 'calc(100% - 32px)' : window.size.height,
        top: isMaximized ? '32px' : 0,
        left: isMaximized ? 0 : 0,
      }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      drag={!isMaximized}
      dragMomentum={false}
      onDragStart={() => onFocus(window.id)}
      onDragEnd={(_, info) => {
        onUpdate(window.id, { 
          position: { 
            x: window.position.x + info.offset.x, 
            y: window.position.y + info.offset.y 
          } 
        });
      }}
      onMouseDown={() => onFocus(window.id)}
      className={cn(
        "absolute flex flex-col overflow-hidden shadow-2xl border border-white/10",
        isMaximized ? "rounded-none" : "rounded-lg",
        window.isFocused ? "bg-os-bg/95 backdrop-blur-2xl" : "bg-os-bg/80 backdrop-blur-xl opacity-90",
        "pointer-events-auto"
      )}
      style={{ zIndex: window.zIndex }}
    >
      {/* Title Bar */}
      <div 
        className="h-9 bg-white/5 flex items-center px-3 gap-4 select-none cursor-default"
        onDoubleClick={() => onUpdate(window.id, { state: isMaximized ? 'normal' : 'maximized' })}
      >
        <div className="flex gap-2 group">
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(window.id); }}
            className="w-3 h-3 rounded-full bg-red-500/80 flex items-center justify-center group-hover:bg-red-500 transition-colors"
          >
            <X size={8} className="text-black opacity-0 group-hover:opacity-100" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onUpdate(window.id, { state: 'minimized' }); }}
            className="w-3 h-3 rounded-full bg-yellow-500/80 flex items-center justify-center group-hover:bg-yellow-500 transition-colors"
          >
            <Minus size={8} className="text-black opacity-0 group-hover:opacity-100" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onUpdate(window.id, { state: isMaximized ? 'normal' : 'maximized' }); }}
            className="w-3 h-3 rounded-full bg-green-500/80 flex items-center justify-center group-hover:bg-green-500 transition-colors"
          >
            <Maximize2 size={8} className="text-black opacity-0 group-hover:opacity-100" />
          </button>
        </div>
        <div className="flex-1 text-center text-[12px] font-medium opacity-70 truncate pr-14">
          {window.title}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto relative">
        {children}
      </div>

      {/* Resize Handle (only if not maximized) */}
      {!isMaximized && (
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
          onMouseDown={(e) => {
            e.stopPropagation();
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = window.size.width;
            const startHeight = window.size.height;

            const onMouseMove = (moveEvent: MouseEvent) => {
              onUpdate(window.id, {
                size: {
                  width: Math.max(window.minSize?.width || 200, startWidth + (moveEvent.clientX - startX)),
                  height: Math.max(window.minSize?.height || 100, startHeight + (moveEvent.clientY - startY)),
                }
              });
            };

            const onMouseUp = () => {
              document.removeEventListener('mousemove', onMouseMove);
              document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
          }}
        />
      )}
    </motion.div>
  );
};
