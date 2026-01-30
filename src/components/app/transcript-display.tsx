'use client';

import { cn } from '@/lib/utils';
import React, { memo } from 'react';

type TranscriptDisplayProps = {
  chunks: string[];
  keywords: string[];
};

const HighlightedChunk = memo(({ chunk, keywords }: { chunk: string; keywords: string[] }) => {
  if (!keywords.length) {
    return <>{chunk}</>;
  }

  const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
  const parts = chunk.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        keywords.some(kw => new RegExp(`^${kw}$`, 'i').test(part)) ? (
          <span key={i} className="text-warning-foreground font-semibold rounded bg-warning/20 px-1.5 py-1">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
});
HighlightedChunk.displayName = 'HighlightedChunk';


export function TranscriptDisplay({ chunks, keywords }: TranscriptDisplayProps) {
  return (
    <div className="space-y-4 text-lg leading-relaxed">
      {chunks.map((chunk, index) => (
        <div key={index} className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
          <p>
            <span className="font-semibold text-muted-foreground mr-2">{index % 2 === 0 ? 'Caller:' : 'You:'}</span>
            <HighlightedChunk chunk={chunk} keywords={keywords} />
          </p>
        </div>
      ))}
    </div>
  );
}
