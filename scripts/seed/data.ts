import { randomInt } from 'node:crypto';

import { pick, type SeedComment, type SeedPost, type SeedUser } from './utils';

const FIRST_NAMES = [
  'Alex',
  'Sam',
  'Jordan',
  'Casey',
  'Riley',
  'Taylor',
  'Morgan',
  'Jamie',
  'Avery',
  'Quinn',
  'Blake',
  'Cameron',
  'Dakota',
  'Emerson',
  'Finley',
  'Harper',
  'Jules',
  'Kendall',
  'Logan',
  'Peyton',
];

const LAST_NAMES = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Hernandez',
  'Lopez',
  'Gonzalez',
  'Wilson',
  'Anderson',
  'Thomas',
  'Taylor',
  'Moore',
  'Jackson',
  'Martin',
  'Lee',
  'Perez',
  'Thompson',
  'White',
];

export const TOPICS = [
  'remote work',
  'minimalism',
  'digital art',
  'open source',
  'machine learning',
  'urban gardening',
  'home cooking',
  'street photography',
  'productivity',
  'personal finance',
  'meditation',
  'trail running',
  'music production',
  'creative writing',
  'woodworking',
  'yoga',
  'indie gaming',
  'fermentation',
  'film photography',
  'calligraphy',
  'beekeeping',
  'pottery',
  'electronic music',
  'hiking',
  'vegan cooking',
  'journaling',
  'language learning',
  'camping',
  'cycling',
  'watercolor painting',
];

const ADJECTIVES = [
  'amazing',
  'challenging',
  'rewarding',
  'humbling',
  'eye-opening',
  'surprising',
  'inspiring',
  'transformative',
  'meditative',
  'liberating',
  'exhausting',
  'exhilarating',
  'therapeutic',
  'fascinating',
  'delightful',
  'soothing',
  'chaotic',
  'addictive',
  'grounding',
  'unexpected',
];

const NOUNS = [
  'journey',
  'experience',
  'perspective',
  'approach',
  'routine',
  'project',
  'experiment',
  'mindset',
  'habit',
  'practice',
  'craft',
  'skill',
  'lifestyle',
  'discipline',
  'adventure',
];

const GERUNDS = [
  'practicing',
  'exploring',
  'learning',
  'building',
  'creating',
  'mastering',
  'developing',
  'refining',
  'rediscovering',
  'embracing',
];

const TIMEFRAMES = [
  'this year',
  'over the weekend',
  'lately',
  'after months',
  'recently',
  'this past year',
  'during lockdown',
  'after a decade',
  'over the past few months',
  'this quarter',
  'since last summer',
  'in the last few weeks',
];

type Template = (t: string, a: string, n: string, g: string, tf: string) => string;

const TITLE_TEMPLATES: Template[] = [
  (t): string => `Why ${t} Changed Everything`,
  (t, _, __, ___, tf): string => `My ${tf} with ${t}`,
  (t, a, n, g): string => `${capitalize(g)} ${t} — A ${a} ${n}`,
  (t): string => `What ${t} Taught Me About ${t}`,
  (t, a, n): string => `${capitalize(t)}: A ${a} ${n}`,
  (t, a, n): string => `How ${t} Transformed My ${capitalize(n)}`,
  (t, a, n): string => `The ${a} ${n} of ${t}`,
  (t): string => `5 Things ${capitalize(t)} Taught Me About Life`,
  (t, a, n, g): string => `Why I Started ${g} ${t} (And Why You Should Too)`,
  (t, a, n): string => `From ${t} to ${t}: A ${a} ${n}`,
  (t, a, n, _, tf): string => `My ${a} ${n} with ${t} ${tf}`,
  (t, a, n, g): string => `${capitalize(g)} ${t}: ${a} Lessons Learned`,
];

const CONTENT_TEMPLATES: Template[] = [
  (t, a, n, g, tf): string => `I've been ${g} ${t} for ${tf} and it's been a truly ${a} ${n}.`,
  (t, a, n): string =>
    `What started as a simple ${n} turned into something far more ${a} than I ever expected.`,
  (t, a): string =>
    `The most ${a} part has been discovering how ${t} changes everyday life in unexpected ways.`,
  (t, a, _, g, tf): string => `After ${tf} of ${g} ${t}, I finally feel ${a} about my approach.`,
  (t, a): string =>
    `I wanted to share my ${a} journey with ${t} in case others are on the same path.`,
  (t, a, _, g): string =>
    `Has anyone else tried ${g} ${t}? I'd love to hear your stories and ${a} tips.`,
  (t, a): string =>
    `The community around ${t} has been incredibly ${a} and supportive every step of the way.`,
  (t, _, __, g): string =>
    `Looking back, the biggest lesson ${t} taught me is to stay curious and keep ${g}.`,
  (t, a, _, g): string =>
    `If you're curious about ${t}, my advice is to start ${g} today no matter how ${a} it seems.`,
  (t, a, _, g): string =>
    `Still ${g} and learning every day, but here are my ${a} takeaways so far.`,
  (t): string =>
    `${capitalize(t)} completely reshaped how I think about creativity and making things.`,
  (t, a): string =>
    `I never expected ${t} to be so ${a}, but the journey has been worth every moment.`,
  (t): string =>
    `Three months into ${t} and I can confidently say it was one of the best decisions.`,
  (t, a, _, g): string =>
    `For anyone curious about ${t}: just start ${g} and stay ${a} through the process.`,
  (t, a, n, _, tf): string =>
    `${capitalize(t)} has been the most ${a} ${n} I've embarked on ${tf}.`,
];

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function generateUser(index: number, rand: () => number): SeedUser {
  const first = pick(FIRST_NAMES, rand);
  const last = pick(LAST_NAMES, rand);
  return {
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}.seed${index}@example.com`,
    password: '123456',
  };
}

const COMMENT_TEMPLATES = [
  'Great post! Really enjoyed reading this.',
  'Thanks for sharing, this was helpful.',
  'I had a similar experience — totally agree!',
  'Interesting perspective, never thought of it that way.',
  'Nice write-up! Bookmarking this for later.',
  "Couldn't agree more. Well said.",
  'This is exactly what I needed to read today.',
  'Solid advice, thanks for putting this together.',
  "I've been thinking about this too. Great minds think alike!",
  'Love the practical tips in this. Going to try them out.',
  'Really well explained. Sharing this with my team.',
  'This resonates so much with my own journey.',
  'Thanks for the inspiration!',
  'You always have the best insights on this topic.',
  'Tried this out and it works wonders. Highly recommend.',
  'How long did it take you to get into this?',
  "Any beginner resources you'd recommend?",
  "What's your setup like for this?",
  'I wish I had read this sooner!',
  'Keep up the great work!',
];

export function generateComment(rand: () => number): SeedComment {
  return { content: pick(COMMENT_TEMPLATES, rand) };
}

export function generatePost(tagPool: string[], rand: () => number): SeedPost {
  const topic = pick(TOPICS, rand);
  const adj = pick(ADJECTIVES, rand);
  const noun = pick(NOUNS, rand);
  const gerund = pick(GERUNDS, rand);
  const timeframe = pick(TIMEFRAMES, rand);

  const title = pick(TITLE_TEMPLATES, rand)(topic, adj, noun, gerund, timeframe);
  const content = pick(CONTENT_TEMPLATES, rand)(topic, adj, noun, gerund, timeframe);

  const tagCount = randomInt(1, 4);
  const tags: string[] = [];
  for (let i = 0; i < tagCount; i++) {
    tags.push(pick(tagPool, rand));
  }

  return { title, content, tags };
}
