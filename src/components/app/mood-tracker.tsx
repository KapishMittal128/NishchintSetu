'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAppState } from '@/hooks/use-app-state';
import { Smile, Meh, Frown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type Mood = 'happy' | 'neutral' | 'sad';

export function MoodTracker() {
  const { addMoodEntry, userUID } = useAppState();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const { toast } = useToast();

  const handleMoodSelect = (mood: Mood) => {
    if (!userUID) return;

    addMoodEntry(userUID, mood);
    setSelectedMood(mood);
    toast({
      title: 'Mood Recorded',
      description: `We've noted that you're feeling ${mood}.`,
    });

    // Reset after a short delay for feedback
    setTimeout(() => setSelectedMood(null), 2000);
  };

  return (
    <div className="flex justify-around items-center p-4 rounded-lg bg-secondary/50">
      <Button
        variant="ghost"
        size="lg"
        className={cn("flex flex-col h-24 w-24 gap-2 transition-all duration-300", selectedMood === 'happy' && 'bg-success/20 scale-110')}
        onClick={() => handleMoodSelect('happy')}
      >
        <Smile className="h-10 w-10 text-success" />
        <span className="text-sm">Happy</span>
      </Button>
      <Button
        variant="ghost"
        size="lg"
        className={cn("flex flex-col h-24 w-24 gap-2 transition-all duration-300", selectedMood === 'neutral' && 'bg-warning/20 scale-110')}
        onClick={() => handleMoodSelect('neutral')}
      >
        <Meh className="h-10 w-10 text-warning" />
        <span className="text-sm">Neutral</span>
      </Button>
      <Button
        variant="ghost"
        size="lg"
        className={cn("flex flex-col h-24 w-24 gap-2 transition-all duration-300", selectedMood === 'sad' && 'bg-destructive/20 scale-110')}
        onClick={() => handleMoodSelect('sad')}
      >
        <Frown className="h-10 w-10 text-destructive" />
        <span className="text-sm">Sad</span>
      </Button>
    </div>
  );
}
