const ADJECTIVES = ['friendly', 'brave', 'calm', 'gentle', 'happy', 'wise', 'witty', 'clever', 'bright', 'warm'];
const NOUNS = ['wombat', 'panda', 'koala', 'dolphin', 'sparrow', 'river', 'ocean', 'mountain', 'meadow', 'forest'];

export function generateUID(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 900) + 100; // 100-999
  return `${adj}-${noun}-${num}`;
}
