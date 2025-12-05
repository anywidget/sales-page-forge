export type ProjectType = 'sales_letter' | 'jv_page';
export type ThemeType = 
  | 'classic_red'
  | 'clean_blue' 
  | 'money_green'
  | 'dark_authority'
  | 'sunset_orange'
  | 'tech_purple'
  | 'black_gold'
  | 'fresh_teal'
  | 'fire_red'
  | 'ocean_blue'
  | 'neon_gamer'
  | 'minimalist_white';
export type SectionType = 
  | 'hero' 
  | 'subheadline' 
  | 'video' 
  | 'bullets' 
  | 'feature_grid' 
  | 'bonus_stack' 
  | 'testimonial' 
  | 'guarantee' 
  | 'faq' 
  | 'cta' 
  | 'divider' 
  | 'jv_commissions' 
  | 'jv_calendar' 
  | 'jv_prizes'
  | 'pricing_table'
  | 'countdown_timer'
  | 'about_author'
  | 'story_section'
  | 'social_proof_bar'
  | 'warning_box'
  | 'who_is_this_for'
  | 'what_you_get'
  | 'ps_section'
  | 'image_section'
  | 'before_after'
  | 'step_by_step'
  | 'module_breakdown'
  | 'credibility_bar'
  | 'headline_only'
  | 'comparison_table'
  | 'order_bump'
  | 'testimonial_grid'
  | 'video_testimonials'
  | 'income_proof';

export interface PageSection {
  id: string;
  type: SectionType;
  position: number;
  data: Record<string, unknown>;
}

// Freeform element types for drag-and-drop positioning
export type FreeformElementType = 'text' | 'image';

// Text effect presets for IM-style pages
export type TextEffectPreset = 
  | 'none'
  | 'subtle-shadow'
  | 'bold-shadow'
  | 'glow'
  | 'neon-glow'
  | 'outline'
  | 'embossed'
  | 'fire'
  | 'golden';

export interface TextEffects {
  preset?: TextEffectPreset;
  textShadow?: string;
  letterSpacing?: string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration?: 'none' | 'underline' | 'line-through';
  textOutline?: string; // -webkit-text-stroke
}

export interface FreeformElement {
  id: string;
  type: FreeformElementType;
  x: number; // percentage from left (0-100)
  y: number; // pixels from top of page
  width: number; // percentage width (1-100)
  height: number; // pixels height (auto for text)
  zIndex: number; // layer ordering
  content: string; // text content or image URL
  styles?: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    textAlign?: 'left' | 'center' | 'right';
    backgroundColor?: string;
    padding?: string;
    borderRadius?: string;
    // Text effects
    textShadow?: string;
    letterSpacing?: string;
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    textDecoration?: 'none' | 'underline' | 'line-through';
    textOutline?: string;
  };
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  type: ProjectType;
  theme: ThemeType;
  sections: PageSection[];
  freeformElements?: FreeformElement[];
  createdAt: string;
  updatedAt: string;
}

export const SECTION_LABELS: Record<SectionType, string> = {
  hero: 'Hero Section',
  subheadline: 'Subheadline',
  video: 'Video Embed',
  bullets: 'Bullet Points',
  feature_grid: 'Feature Grid',
  bonus_stack: 'Bonus Stack',
  testimonial: 'Testimonial',
  guarantee: 'Guarantee',
  faq: 'FAQ',
  cta: 'Call to Action',
  divider: 'Divider',
  jv_commissions: 'JV Commissions',
  jv_calendar: 'JV Calendar',
  jv_prizes: 'JV Prizes',
  pricing_table: 'Pricing Table',
  countdown_timer: 'Countdown Timer',
  about_author: 'About the Author',
  story_section: 'Story / Copy Block',
  social_proof_bar: 'Social Proof Bar',
  warning_box: 'Warning Box',
  who_is_this_for: 'Who Is This For?',
  what_you_get: 'What You Get',
  ps_section: 'P.S. Section',
  image_section: 'Image Section',
  before_after: 'Before / After',
  step_by_step: 'Step by Step Process',
  module_breakdown: 'Module Breakdown',
  credibility_bar: 'Credibility Bar',
  headline_only: 'Headline Only',
  comparison_table: 'Comparison Table',
  order_bump: 'Order Bump',
  testimonial_grid: 'Testimonial Grid',
  video_testimonials: 'Video Testimonials',
  income_proof: 'Income Proof',
};

export const THEME_LABELS: Record<ThemeType, string> = {
  classic_red: 'Classic Red Urgency',
  clean_blue: 'Clean Blue Professional',
  money_green: 'Money Green',
  dark_authority: 'Dark Authority',
  sunset_orange: 'Sunset Orange',
  tech_purple: 'Tech Purple',
  black_gold: 'Black & Gold Luxury',
  fresh_teal: 'Fresh Teal',
  fire_red: 'Fire Red Energy',
  ocean_blue: 'Ocean Blue Trust',
  neon_gamer: 'Neon Gamer',
  minimalist_white: 'Minimalist White',
};

export const DEFAULT_SECTION_DATA: Record<SectionType, Record<string, unknown>> = {
  hero: {
    headline: 'Transform Your Business Today',
    subheadline: 'Discover the secret that top marketers use to 10x their results',
    buttonText: 'Get Started Now',
    buttonUrl: '#',
    backgroundStyle: 'gradient',
    scarcityText: 'LIMITED TIME OFFER',
  },
  subheadline: {
    text: 'Finally, a solution that actually works...',
    highlightWords: ['Finally', 'actually works'],
  },
  video: {
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    autoplay: false,
    caption: 'Watch this short video to learn more',
  },
  bullets: {
    title: 'What You Get:',
    items: [
      'Complete step-by-step training',
      'Access to exclusive community',
      'Lifetime updates included',
      'Money-back guarantee',
    ],
  },
  feature_grid: {
    columns: 3,
    features: [
      { icon: 'zap', title: 'Lightning Fast', description: 'Get results in days, not months' },
      { icon: 'shield', title: 'Proven System', description: 'Used by 10,000+ marketers' },
      { icon: 'award', title: 'Premium Quality', description: 'Industry-leading standards' },
    ],
  },
  bonus_stack: {
    bonuses: [
      { title: 'Bonus #1', description: 'Quick Start Guide', value: '$97' },
      { title: 'Bonus #2', description: 'Template Pack', value: '$197' },
      { title: 'Bonus #3', description: 'Private Community', value: '$297' },
    ],
  },
  testimonial: {
    quote: 'This product completely changed my business. I went from struggling to making $10k/month in just 90 days!',
    name: 'John Smith',
    role: 'Online Entrepreneur',
    avatarUrl: '',
  },
  guarantee: {
    title: '30-Day Money Back Guarantee',
    description: 'Try it risk-free for 30 days. If you are not satisfied, get a full refund.',
    badgeText: '100% Secure',
  },
  faq: {
    items: [
      { question: 'How long do I have access?', answer: 'You get lifetime access to all materials.' },
      { question: 'Is there a guarantee?', answer: 'Yes, 30-day money back guarantee.' },
      { question: 'Do I need experience?', answer: 'No, this works for complete beginners.' },
    ],
  },
  cta: {
    headline: 'Ready to Get Started?',
    buttonText: 'Yes! I Want This Now',
    buttonUrl: '#',
    scarcityText: 'Only 7 spots left at this price!',
    guaranteeText: '30-Day Money Back Guarantee',
  },
  divider: {
    style: 'gradient',
  },
  jv_commissions: {
    headline: 'Earn 50% Commissions',
    tiers: [
      { name: 'Front-End', commission: '50%' },
      { name: 'Upsell 1', commission: '50%' },
      { name: 'Upsell 2', commission: '50%' },
    ],
    epc: '$2.50',
    cookieDuration: '60 days',
  },
  jv_calendar: {
    launchDate: '2024-02-01',
    cartOpen: '9:00 AM EST',
    cartClose: '11:59 PM EST',
    webinarTime: '2:00 PM EST',
  },
  jv_prizes: {
    headline: 'Win Amazing Prizes',
    prizes: [
      { position: '1st', amount: '$1,000 Cash' },
      { position: '2nd', amount: '$500 Cash' },
      { position: '3rd', amount: '$250 Cash' },
    ],
  },
  pricing_table: {
    headline: 'Choose Your Package',
    subheadline: 'Select the plan that works best for you',
    packages: [
      { 
        name: 'Basic', 
        price: '$47', 
        originalPrice: '$97',
        features: ['Core Training', 'Community Access', 'Email Support'],
        buttonText: 'Get Basic',
        highlighted: false 
      },
      { 
        name: 'Pro', 
        price: '$97', 
        originalPrice: '$197',
        features: ['Everything in Basic', 'Advanced Modules', 'Priority Support', 'Bonus Templates'],
        buttonText: 'Get Pro',
        highlighted: true 
      },
      { 
        name: 'Elite', 
        price: '$197', 
        originalPrice: '$497',
        features: ['Everything in Pro', '1-on-1 Coaching', 'Lifetime Updates', 'Private Mastermind'],
        buttonText: 'Get Elite',
        highlighted: false 
      },
    ],
  },
  countdown_timer: {
    headline: 'This Special Offer Expires In:',
    urgencyText: 'Act now before this offer disappears forever!',
    endDate: '',
  },
  about_author: {
    name: 'Your Name Here',
    title: 'Expert & Entrepreneur',
    bio: 'Share your story, credentials, and why you created this product. What makes you uniquely qualified to help your customers achieve their goals?',
    imageUrl: '',
  },
  story_section: {
    headline: '',
    content: 'Tell your story here. Share your journey, the struggles you faced, and how you discovered the solution you are now offering to others...',
    paragraphs: [
      'Tell your story here. Share your journey, the struggles you faced, and how you discovered the solution you are now offering to others...',
    ],
  },
  social_proof_bar: {
    headline: 'As Featured In:',
    logos: ['Forbes', 'Inc', 'Entrepreneur', 'Business Insider'],
  },
  warning_box: {
    headline: 'WARNING',
    content: 'This offer will not last forever. Once the timer hits zero, this page will be taken down and you will miss out on this incredible opportunity.',
  },
  who_is_this_for: {
    headline: 'Who Is This For?',
    forYou: [
      'You want to achieve real results fast',
      'You are ready to take action today',
      'You are committed to your success',
    ],
    notForYou: [
      'You are looking for get-rich-quick schemes',
      'You are not willing to put in any work',
      'You expect overnight success',
    ],
  },
  what_you_get: {
    headline: 'Here\'s Everything You Get Today:',
    items: [
      { name: 'Core Training Program', description: 'Complete step-by-step video training', value: '$497' },
      { name: 'Quick Start Guide', description: 'Get started in under 30 minutes', value: '$97' },
      { name: 'Private Community', description: 'Connect with other successful members', value: '$197' },
    ],
    totalValue: '$791',
    todayPrice: '$47',
  },
  ps_section: {
    items: [
      { prefix: 'P.S.', content: 'Remember, you are fully protected by our 30-day money back guarantee. You have nothing to lose and everything to gain.' },
      { prefix: 'P.P.S.', content: 'This special pricing will not last forever. Take action now before the price goes up.' },
    ],
  },
  image_section: {
    imageUrl: '',
    alt: 'Image',
    caption: '',
  },
  before_after: {
    headline: 'See The Transformation',
    before: 'Struggling, confused, and overwhelmed with no clear path forward...',
    after: 'Confident, successful, and achieving your goals with a proven system...',
  },
  step_by_step: {
    headline: 'How It Works',
    steps: [
      { title: 'Step 1: Get Access', description: 'Sign up and get instant access to all the training materials.' },
      { title: 'Step 2: Follow The System', description: 'Watch the videos and implement the proven strategies.' },
      { title: 'Step 3: See Results', description: 'Start seeing real results as you apply what you learn.' },
    ],
  },
  module_breakdown: {
    headline: 'What\'s Inside The Training',
    modules: [
      { name: 'Foundation Fundamentals', description: 'Master the core principles that drive success', lessons: 8 },
      { name: 'Advanced Strategies', description: 'Deep dive into proven tactics that get results', lessons: 12 },
      { name: 'Implementation Blueprint', description: 'Step-by-step action plan to put it all together', lessons: 6 },
    ],
  },
  credibility_bar: {
    items: ['Secure Checkout', '256-bit SSL Encryption', 'Money Back Guarantee', '24/7 Support'],
  },
  headline_only: {
    headline: 'Your Big, Bold Headline Goes Here',
  },
  comparison_table: {
    headline: 'Why We\'re Different',
    usLabel: 'Our Solution',
    themLabel: 'Others',
    rows: [
      { feature: 'Step-by-step training', us: true, them: false },
      { feature: 'Proven results', us: true, them: false },
      { feature: 'Money back guarantee', us: true, them: false },
      { feature: '24/7 support', us: true, them: false },
    ],
  },
  order_bump: {
    headline: 'YES! Add This To My Order!',
    description: 'Get our exclusive templates pack and save hours of work. This one-time offer is only available right now!',
    price: '$27',
  },
  testimonial_grid: {
    headline: 'What Our Customers Say',
    testimonials: [
      { quote: 'This product changed my life. Highly recommend!', name: 'John D.', role: 'Entrepreneur' },
      { quote: 'Best investment I ever made. Results came fast.', name: 'Sarah M.', role: 'Business Owner' },
      { quote: 'Finally something that actually works!', name: 'Mike R.', role: 'Freelancer' },
    ],
  },
  video_testimonials: {
    headline: 'Video Success Stories',
    videos: [
      { embedUrl: '', name: 'Success Story #1' },
      { embedUrl: '', name: 'Success Story #2' },
    ],
  },
  income_proof: {
    headline: 'Real Results From Real People',
    disclaimer: 'Results may vary. These are actual results from dedicated users.',
    proofs: [
      { amount: '$5,247', timeframe: 'First Month', name: 'John D.' },
      { amount: '$12,890', timeframe: 'First Quarter', name: 'Sarah M.' },
      { amount: '$47,500', timeframe: 'First Year', name: 'Mike R.' },
    ],
  },
};
