import React from 'react';

interface HighlightMatchProps {
  text: string;
  query: string;
  className?: string;
}

export const HighlightMatch: React.FC<HighlightMatchProps> = React.memo(({ text, query, className }) => {
  if (!query || !query.trim() || !text) {
    return <span className={className}>{text}</span>;
  }

  const trimmed = query.trim();
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.toLowerCase() === trimmed.toLowerCase()) {
          return (
            <mark key={index} className="bg-yellow-200 text-gray-900 rounded-sm font-medium px-0.5">
              {part}
            </mark>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
});

HighlightMatch.displayName = 'HighlightMatch';
