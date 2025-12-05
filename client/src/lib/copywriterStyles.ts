export interface CopywriterStyle {
  id: number;
  name: string;
  known_for: string;
  ai_prompt: string;
}

export const COPYWRITER_STYLES: CopywriterStyle[] = [
  {
    id: 1,
    name: "David Ogilvy",
    known_for: "Father of Advertising, big ideas, research-driven ads.",
    ai_prompt: "Write in the style of David Ogilvy: clear, research-based, sophisticated, emphasizing a single big idea, using long-form structured body copy with strong headlines."
  },
  {
    id: 2,
    name: "Claude Hopkins",
    known_for: "Scientific advertising, testing, coupons, measurable results.",
    ai_prompt: "Write in the style of Claude Hopkins: logical, scientific, testable claims; simple language; focus on measurable results; offer-driven persuasion."
  },
  {
    id: 3,
    name: "Eugene Schwartz",
    known_for: "Breakthrough Advertising, stages of awareness, deep market psychology.",
    ai_prompt: "Write in the style of Eugene Schwartz: deep market psychology, amplification of existing desire, escalation of emotional tension, and awareness-based messaging."
  },
  {
    id: 4,
    name: "Gary Halbert",
    known_for: "The Boron Letters, raw persuasion, simple but powerful copy.",
    ai_prompt: "Write in the style of Gary Halbert: conversational, punchy, street-smart, emotional, with simple structure and highly compelling hooks."
  },
  {
    id: 5,
    name: "Dan Kennedy",
    known_for: "No B.S. marketing, direct response formulas, ruthless clarity.",
    ai_prompt: "Write in the style of Dan Kennedy: clear, no-nonsense, direct response structure, authority positioning, hard-hitting offers, and strong urgency."
  },
  {
    id: 6,
    name: "John Caples",
    known_for: "Legendary headlines, benefit-driven, curiosity-based ads.",
    ai_prompt: "Write in the style of John Caples: results-focused, curiosity-driven headlines, simple language, strong benefits, and clear calls to action."
  },
  {
    id: 7,
    name: "Robert Collier",
    known_for: "Letters that join the conversation already in the reader's mind.",
    ai_prompt: "Write in the style of Robert Collier: empathetic, intimate, problem-aware copy that addresses the reader's internal dialogue and deeper wants."
  },
  {
    id: 8,
    name: "Joe Sugarman",
    known_for: "The Adweek Copywriting Handbook, emotional triggers, storytelling.",
    ai_prompt: "Write in the style of Joe Sugarman: emotionally driven storytelling, curiosity hooks, smooth one-sitting-flow copy, and natural transitions."
  },
  {
    id: 9,
    name: "Victor Schwab",
    known_for: "How to Write a Good Advertisement, headline scientist.",
    ai_prompt: "Write in the style of Victor Schwab: structured reasoning, headline formulas, educational tone, and clear benefit-driven messaging."
  },
  {
    id: 10,
    name: "Rosser Reeves",
    known_for: "USP (Unique Selling Proposition) pioneer.",
    ai_prompt: "Write in the style of Rosser Reeves: USP-driven copy, direct claims, repetitive reinforcement, and clarity of product superiority."
  },
  {
    id: 11,
    name: "Gary Bencivenga",
    known_for: "Often called the world's greatest living copywriter, proof-heavy persuasion.",
    ai_prompt: "Write in the style of Gary Bencivenga: elegant persuasion, proof-rich arguments, credibility building, and benefit amplification."
  },
  {
    id: 12,
    name: "John Carlton",
    known_for: "Hard-hitting, streetwise, brutally direct sales copy.",
    ai_prompt: "Write in the style of John Carlton: raw, bold, aggressive, conversational copy with strong hooks and street-level empathy."
  },
  {
    id: 13,
    name: "Clayton Makepeace",
    known_for: "High-converting financial and health copy, dramatic storytelling.",
    ai_prompt: "Write in the style of Clayton Makepeace: bold claims, dramatic storytelling, proof stacking, and high-stakes emotional drivers."
  },
  {
    id: 14,
    name: "Paris Lampropoulos",
    known_for: "Elite health and financial VSL copywriter.",
    ai_prompt: "Write in the style of Paris Lampropoulos: suspenseful open loops, emotionally intense storytelling, deep research, and dramatic revelations."
  },
  {
    id: 15,
    name: "David Deutsch",
    known_for: "Legendary financial copywriter, complex opportunity narratives.",
    ai_prompt: "Write in the style of David Deutsch: authoritative, research-backed, opportunity-driven copy with strong emotional appeal."
  },
  {
    id: 16,
    name: "Parris",
    known_for: "Deep emotional angles, psychological intensity in copy.",
    ai_prompt: "Write in the style of Parris: psychologically intense copy anchored in curiosity, taboo angles, and high emotional stakes."
  },
  {
    id: 17,
    name: "Chris Haddad",
    known_for: "Hyper-emotional relationship and self-help VSLs.",
    ai_prompt: "Write in the style of Chris Haddad: emotionally charged storytelling, vulnerability, relationship dynamics, and primal desire triggers."
  },
  {
    id: 18,
    name: "Stefan Georgi",
    known_for: "RMBC method, scalable direct response structure.",
    ai_prompt: "Write in the style of Stefan Georgi: research-first, problem-agitation-solution structure, logical flow, and conversion-focused clarity."
  },
  {
    id: 19,
    name: "Justin Goff",
    known_for: "Conversion optimization, simple and empathetic copy.",
    ai_prompt: "Write in the style of Justin Goff: empathy-rich, honest, simple messaging focused on connection, trust, and clean direct response hooks."
  },
  {
    id: 20,
    name: "Ryan Deiss",
    known_for: "Customer value journey, scalable digital marketing.",
    ai_prompt: "Write in the style of Ryan Deiss: structured messaging, customer journey awareness, clear frameworks, and scalable marketing logic."
  },
  {
    id: 21,
    name: "Russell Brunson",
    known_for: "Sales funnels, hook-story-offer framework.",
    ai_prompt: "Write in the style of Russell Brunson: energetic storytelling, hook-story-offer framework, identity-driven messaging, and high urgency."
  },
  {
    id: 22,
    name: "Alex Hormozi",
    known_for: "$100M Offers, value stacking, simple but powerful offers.",
    ai_prompt: "Write in the style of Alex Hormozi: ultra-clear, logical, value-dense messaging with strong offers, bold claims, and simple language."
  },
  {
    id: 23,
    name: "Frank Kern",
    known_for: "Intent-based branding, relaxed persuasive style.",
    ai_prompt: "Write in the style of Frank Kern: relaxed, charming, conversational copy with subtle persuasion and value-driven education."
  },
  {
    id: 24,
    name: "Todd Brown",
    known_for: "Big marketing ideas and funnel strategy.",
    ai_prompt: "Write in the style of Todd Brown: big idea-led messaging, logical sales arguments, mechanism-driven persuasion, and strong narrative flow."
  },
  {
    id: 25,
    name: "Dean Jackson",
    known_for: "Simple lead-gen, short-form persuasion.",
    ai_prompt: "Write in the style of Dean Jackson: minimalistic copy, clear offers, simple curiosity-based hooks, and conversational tone."
  },
  {
    id: 26,
    name: "Ann Handley",
    known_for: "Human, story-driven content marketing.",
    ai_prompt: "Write in the style of Ann Handley: warm, human, story-driven, witty content that builds trust, relatability, and delight."
  },
  {
    id: 27,
    name: "Seth Godin",
    known_for: "Permission marketing, simple but profound ideas.",
    ai_prompt: "Write in the style of Seth Godin: philosophical, simple, metaphorical writing that focuses on insight, human behavior, and big ideas."
  },
  {
    id: 28,
    name: "Rory Sutherland",
    known_for: "Behavioral economics applied to advertising.",
    ai_prompt: "Write in the style of Rory Sutherland: psychological insights, contrarian perspectives, and behavior-based reasoning woven into the copy."
  },
  {
    id: 29,
    name: "Donald Miller",
    known_for: "StoryBrand framework, customer-as-hero messaging.",
    ai_prompt: "Write in the style of Donald Miller: clear, character-driven story structure with the customer as hero and the brand as guide."
  },
  {
    id: 30,
    name: "Joe Coleman",
    known_for: "Modern brand copy with wit and personality.",
    ai_prompt: "Write in the style of Joe Coleman: quirky, modern, humorous copy with personality and sharp, memorable lines."
  },
  {
    id: 31,
    name: "Leo Burnett",
    known_for: "Iconic brand characters (Marlboro Man), emotional branding.",
    ai_prompt: "Write in the style of Leo Burnett: emotional, visual storytelling with iconic, timeless brand character and simple language."
  },
  {
    id: 32,
    name: "Bill Bernbach",
    known_for: "Creative revolution, simple yet powerful ads.",
    ai_prompt: "Write in the style of Bill Bernbach: human emotion, simplicity, witty contrast, and bold creative ideas that break conventions."
  },
  {
    id: 33,
    name: "Mary Wells Lawrence",
    known_for: "Dramatic, emotional branding campaigns.",
    ai_prompt: "Write in the style of Mary Wells Lawrence: bold, dramatic, visually driven messaging with strong, confident brand personality."
  },
  {
    id: 34,
    name: "George Lois",
    known_for: "Provocative, shocking big ideas and visuals.",
    ai_prompt: "Write in the style of George Lois: shocking, bold, simple, big-idea-driven copy designed to grab immediate attention."
  },
  {
    id: 35,
    name: "Shirley Polykoff",
    known_for: "Intimate beauty copy ('Does she… or doesn't she?').",
    ai_prompt: "Write in the style of Shirley Polykoff: intimate, feminine, aspirational messaging with emotional nuance and subtle intrigue."
  },
  {
    id: 36,
    name: "Helen Lansdowne Resor",
    known_for: "First major female copywriter, emotional appeals.",
    ai_prompt: "Write in the style of Helen Lansdowne Resor: storytelling with emotional desire, subtle sensuality, and strong brand imagery."
  },
  {
    id: 37,
    name: "Ben Settle",
    known_for: "Daily email copy, personality-driven promotions.",
    ai_prompt: "Write in the style of Ben Settle: punchy, contrarian, personality-driven email copy with strong opinions and tight storytelling."
  },
  {
    id: 38,
    name: "Andre Chaperon",
    known_for: "Autoresponder mastery, serialized email storytelling.",
    ai_prompt: "Write in the style of Andre Chaperon: serialized storytelling, cliffhangers, emotional continuity, and deep relationship building."
  },
  {
    id: 39,
    name: "Laura Belgray",
    known_for: "Witty, relatable, conversational copy.",
    ai_prompt: "Write in the style of Laura Belgray: witty, personal, relatable copy with humor, self-awareness, and strong personality."
  },
  {
    id: 40,
    name: "Joanna Wiebe",
    known_for: "Conversion copywriting, voice-of-customer focused.",
    ai_prompt: "Write in the style of Joanna Wiebe: data-backed clarity, voice-of-customer integration, and high-converting UX and microcopy."
  },
  {
    id: 41,
    name: "Neville Medhora",
    known_for: "Ultra-simple, fun direct response copy.",
    ai_prompt: "Write in the style of Neville Medhora: ultra-simple language, humor, brevity, and punchy direct response-style messaging."
  },
  {
    id: 42,
    name: "Justin Welsh",
    known_for: "Short-form LinkedIn & X frameworks, solopreneur content.",
    ai_prompt: "Write in the style of Justin Welsh: structured, punchy, minimalist insights with simple, easy-to-follow frameworks."
  },
  {
    id: 43,
    name: "Dickie Bush",
    known_for: "Atomic essays, structured short-form writing.",
    ai_prompt: "Write in the style of Dickie Bush: concise, high-impact, structured ideas with momentum-building phrasing and clear takeaways."
  },
  {
    id: 44,
    name: "Alex Cattoni",
    known_for: "Modern copy education, energetic personal brand.",
    ai_prompt: "Write in the style of Alex Cattoni: energetic, modern, personality-rich copy with storytelling flair and playful tone."
  },
  {
    id: 45,
    name: "Chase Dimond",
    known_for: "High-performing email marketing campaigns.",
    ai_prompt: "Write in the style of Chase Dimond: high-converting email structures, benefit-driven messaging, and a warm, helpful tone."
  },
  {
    id: 46,
    name: "Becca Courtney",
    known_for: "Modern, friendly brand voice for online businesses.",
    ai_prompt: "Write in the style of Becca Courtney: friendly, quirky, relatable tone with modern, approachable brand energy."
  },
  {
    id: 47,
    name: "Drayton Bird",
    known_for: "Direct marketing genius, long-form persuasion.",
    ai_prompt: "Write in the style of Drayton Bird: intelligent, witty, long-form persuasion with clear reasoning and strong offers."
  },
  {
    id: 48,
    name: "Joe Karbo",
    known_for: "The Lazy Man's Way to Riches, calm self-help persuasion.",
    ai_prompt: "Write in the style of Joe Karbo: inspirational, self-help persuasion with a calm, confident, and reassuring tone."
  },
  {
    id: 49,
    name: "Maxwell Sackheim",
    known_for: "'Do You Make These Mistakes…' headline, educational ads.",
    ai_prompt: "Write in the style of Maxwell Sackheim: provocative questions, educational tone, and long-form logical copy that teaches while selling."
  },
  {
    id: 50,
    name: "Eddie Shleyner",
    known_for: "Microcopy and sharp, concise messaging.",
    ai_prompt: "Write in the style of Eddie Shleyner: concise, sharp microcopy that clarifies, reassures, and directs action with minimal words."
  }
];
