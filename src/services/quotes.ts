export interface Quote {
  text: string;
  author: string;
  category: 'discipline' | 'consistency' | 'growth' | 'focus';
}

export const MOTIVATIONAL_QUOTES: Quote[] = [
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Will Durant", category: "consistency" },
  { text: "Small disciplines repeated with consistency every day lead to great achievements.", author: "John C. Maxwell", category: "discipline" },
  { text: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock", category: "consistency" },
  { text: "Don't count the days, make the days count.", author: "Muhammad Ali", category: "focus" },
  { text: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear", category: "growth" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso", category: "focus" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln", category: "discipline" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", category: "consistency" },
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson", category: "growth" },
  { text: "Motivation gets you started. Habit is what keeps you going.", author: "Jim Ryun", category: "consistency" },
  { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin", category: "discipline" },
  { text: "Today's preparation determines tomorrow's achievement.", author: "Anonymous", category: "growth" },
];

export function getRandomQuote(): Quote {
  const index = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[index];
}

export function getQuoteForDay(dayNumber: number): Quote {
  const index = (Math.max(1, dayNumber) - 1) % MOTIVATIONAL_QUOTES.length;
  return MOTIVATIONAL_QUOTES[index];
}
