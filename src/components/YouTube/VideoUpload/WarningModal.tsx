import React, { useMemo } from 'react';
import './WarningModal.css';
import { X } from 'lucide-react';
import { Card, Title, Text } from '@tremor/react';

interface FlaggedContent {
  timestamp: number;
  frame_number: number;
  text: string;
  toxic_categories: Record<string, number>;
}

interface WarningModalProps {
  message: string;
  flaggedContent: FlaggedContent[];
  onClose: () => void;
}

const WarningModal: React.FC<WarningModalProps> = ({ message, flaggedContent, onClose }) => {
  // Get unique flagged content based on text
  const uniqueFlaggedContent = useMemo(() => {
    const uniqueTexts = new Map<string, FlaggedContent>();
    
    flaggedContent.forEach(content => {
      if (!uniqueTexts.has(content.text)) {
        uniqueTexts.set(content.text, {
          ...content,
          timestamp: Math.round(content.timestamp * 100) / 100 // Round to 2 decimal places
        });
      }
    });
    
    return Array.from(uniqueTexts.values());
  }, [flaggedContent]);

  return (
    <div className="modal-overlay">
      <Card className="max-w-2xl w-full mx-4 bg-slate-800 text-white">
        <div className="flex justify-between items-start mb-4">
          <Title className="text-red-500">⚠️ Warning</Title>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <Text className="mb-4">{message}</Text>
        
        <div className="flagged-content-container max-h-[60vh] overflow-y-auto pr-2">
          <div className="space-y-4">
            {uniqueFlaggedContent.map((item, index) => (
              <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <Text className="font-medium">Flagged Content:</Text>
                  <Text className="text-sm text-slate-400">
                    at {item.timestamp}s
                  </Text>
                </div>
                <Text className="text-slate-300 mb-2 break-words">{item.text}</Text>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(item.toxic_categories).map(([category, score]) => (
                    <span 
                      key={category}
                      className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-sm"
                    >
                      {category}: {(score * 100).toFixed(1)}%
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WarningModal; 