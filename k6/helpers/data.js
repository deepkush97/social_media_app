function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const FIRST_NAMES = [
  'Alex', 'Sam', 'Jordan', 'Casey', 'Riley', 'Taylor', 'Morgan',
  'Jamie', 'Avery', 'Quinn', 'Blake', 'Cameron', 'Dakota', 'Emerson',
  'Finley', 'Harper', 'Jules', 'Kendall', 'Logan', 'Peyton',
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia',
  'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez',
  'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore',
  'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
];

const WORDS = {
  topics: [
    'remote work', 'minimalism', 'digital art', 'open source', 'machine learning',
    'urban gardening', 'home cooking', 'street photography', 'productivity', 'personal finance',
    'meditation', 'trail running', 'music production', 'creative writing', 'woodworking',
    'yoga', 'indie gaming', 'fermentation', 'film photography', 'calligraphy',
    'beekeeping', 'pottery', 'electronic music', 'hiking', 'vegan cooking',
    'journaling', 'language learning', 'camping', 'cycling', 'watercolor painting',
  ],
  adjectives: [
    'amazing', 'challenging', 'rewarding', 'humbling', 'eye-opening',
    'surprising', 'inspiring', 'transformative', 'meditative', 'liberating',
    'exhausting', 'exhilarating', 'therapeutic', 'fascinating', 'delightful',
    'soothing', 'chaotic', 'addictive', 'grounding', 'unexpected',
  ],
  nouns: [
    'journey', 'experience', 'perspective', 'approach', 'routine',
    'project', 'experiment', 'mindset', 'habit', 'practice',
    'craft', 'skill', 'lifestyle', 'discipline', 'adventure',
  ],
  verbs: [
    'changed', 'transformed', 'reshaped', 'deepened', 'influenced',
    'challenged', 'taught', 'inspired', 'pushed', 'guided',
    'connected', 'elevated', 'grounded', 'humbled', 'freed',
  ],
  gerunds: [
    'practicing', 'exploring', 'learning', 'building', 'creating',
    'mastering', 'developing', 'refining', 'rediscovering', 'embracing',
  ],
  timeframes: [
    'this year', 'over the weekend', 'lately', 'after months',
    'recently', 'this past year', 'during lockdown', 'after a decade',
    'over the past few months', 'this quarter', 'since last summer',
    'in the last few weeks',
  ],
};

const TITLE_TEMPLATES = [
  (w, t) => `Why ${t} ${pick(w.verbs)} ${pick(w.adjectives)}`,
  (w, t) => `My ${pick(w.timeframes)} with ${t}`,
  (w, t) => `${capitalize(pick(w.gerunds))} ${t} — A ${pick(w.adjectives)} ${pick(w.nouns)}`,
  (w, t) => `What ${t} Taught Me About ${t}`,
  (w, t) => `${capitalize(t)}: A ${pick(w.adjectives)} ${pick(w.nouns)}`,
  (w, t) => `How ${t} ${pick(w.verbs)} My ${pick(w.nouns)}`,
  (w, t) => `The ${pick(w.adjectives)} ${pick(w.nouns)} of ${t}`,
  (w, t) => `5 Things ${capitalize(t)} Taught Me About ${t}`,
  (w, t) => `Why I Started ${pick(w.gerunds)} ${t} (And Why You Should Too)`,
  (w, t) => `From ${t} to ${t}: A ${pick(w.adjectives)} ${pick(w.nouns)}`,
  (w, t) => `My ${pick(w.adjectives)} ${pick(w.nouns)} with ${t} ${pick(w.timeframes)}`,
  (w, t) => `${capitalize(pick(w.gerunds))} ${t}: ${pick(w.adjectives)} Lessons Learned`,
];

const SENTENCE_TEMPLATES = [
  (w, t) => `I've been ${pick(w.gerunds)} ${t} for ${pick(w.timeframes)} and it's been a truly ${pick(w.adjectives)} ${pick(w.nouns)}.`,
  (w, t) => `What started as a simple ${pick(w.nouns)} turned into something far more ${pick(w.adjectives)} than I ever expected.`,
  (w, t) => `The most ${pick(w.adjectives)} part has been discovering how ${t} ${pick(w.verbs)} everyday life in unexpected ways.`,
  (w, t) => `After ${pick(w.timeframes)} of ${pick(w.gerunds)} ${t}, I finally feel ${pick(w.adjectives)} about my approach.`,
  (w, t) => `I wanted to share my ${pick(w.adjectives)} journey with ${t} in case others are on the same path.`,
  (w, t) => `Has anyone else tried ${pick(w.gerunds)} ${t}? I'd love to hear your stories and ${pick(w.adjectives)} tips.`,
  (w, t) => `The community around ${t} has been incredibly ${pick(w.adjectives)} and supportive every step of the way.`,
  (w, t) => `Looking back, the biggest lesson ${t} taught me is to stay curious and keep ${pick(w.gerunds)}.`,
  (w, t) => `If you're curious about ${t}, my advice is to start ${pick(w.gerunds)} today — no matter how ${pick(w.adjectives)} it seems.`,
  (w, t) => `Still ${pick(w.gerunds)} and learning every day, but here are my ${pick(w.adjectives)} takeaways so far.`,
  (w, t) => `${capitalize(t)} completely reshaped how I think about creativity and ${pick(w.gerunds)}.`,
  (w, t) => `I never expected ${t} to be so ${pick(w.adjectives)}, but the journey has been worth every moment.`,
  (w, t) => `Three months into ${t} and I can confidently say it was one of the best decisions I've made.`,
  (w, t) => `For anyone curious about ${t}: just start ${pick(w.gerunds)} and stay ${pick(w.adjectives)} through the process.`,
  (w, t) => `${capitalize(t)} has been the most ${pick(w.adjectives)} ${pick(w.nouns)} I've embarked on ${pick(w.timeframes)}.`,
];

function generateTitle(topic) {
  return pick(TITLE_TEMPLATES)(WORDS, topic);
}

function generateContent(topic) {
  return pick(SENTENCE_TEMPLATES)(WORDS, topic);
}

export function uniqueUser(vu, iter) {
  const first = pick(FIRST_NAMES);
  const last = pick(LAST_NAMES);
  const tag = `${vu}_${iter}`;
  return {
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}.${tag}@example.com`,
    password: '123456',
  };
}

export function postData() {
  const tag = Math.random().toString(36).substring(2, 7);
  const topic = pick(WORDS.topics);
  const keyword = topic.split(' ')[0];
  const title = `${generateTitle(topic)} [${tag}]`;
  const content = generateContent(topic);
  return { title, content, keyword };
}
