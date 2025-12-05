export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  preview: string;
  colors: {
    background: string;
    backgroundSecondary: string;
    text: string;
    textSecondary: string;
    heading: string;
    accent: string;
    accentHover: string;
    cta: string;
    ctaText: string;
    border: string;
    highlight: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  style: 'bold' | 'clean' | 'dark' | 'luxury' | 'modern';
}

export const THEMES: Record<string, ThemeConfig> = {
  classic_red: {
    id: 'classic_red',
    name: 'Classic Red Urgency',
    description: 'Bold red and yellow, scarcity-focused classic direct response style',
    preview: 'linear-gradient(135deg, #dc2626 0%, #facc15 100%)',
    colors: {
      background: '#fffef0',
      backgroundSecondary: '#fef3c7',
      text: '#1f2937',
      textSecondary: '#4b5563',
      heading: '#dc2626',
      accent: '#dc2626',
      accentHover: '#b91c1c',
      cta: '#dc2626',
      ctaText: '#ffffff',
      border: '#fcd34d',
      highlight: '#fef08a',
    },
    fonts: {
      heading: 'Georgia, serif',
      body: 'Verdana, sans-serif',
    },
    style: 'bold',
  },
  clean_blue: {
    id: 'clean_blue',
    name: 'Clean Blue Professional',
    description: 'Trust-building corporate blue with professional appearance',
    preview: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)',
    colors: {
      background: '#ffffff',
      backgroundSecondary: '#f0f9ff',
      text: '#1e293b',
      textSecondary: '#64748b',
      heading: '#1e40af',
      accent: '#2563eb',
      accentHover: '#1d4ed8',
      cta: '#2563eb',
      ctaText: '#ffffff',
      border: '#bfdbfe',
      highlight: '#dbeafe',
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
    },
    style: 'clean',
  },
  money_green: {
    id: 'money_green',
    name: 'Money Green',
    description: 'Finance and income focused with green and gold accents',
    preview: 'linear-gradient(135deg, #16a34a 0%, #ca8a04 100%)',
    colors: {
      background: '#f0fdf4',
      backgroundSecondary: '#dcfce7',
      text: '#14532d',
      textSecondary: '#166534',
      heading: '#15803d',
      accent: '#16a34a',
      accentHover: '#15803d',
      cta: '#ca8a04',
      ctaText: '#ffffff',
      border: '#86efac',
      highlight: '#bbf7d0',
    },
    fonts: {
      heading: 'Playfair Display, Georgia, serif',
      body: 'Open Sans, sans-serif',
    },
    style: 'bold',
  },
  dark_authority: {
    id: 'dark_authority',
    name: 'Dark Authority',
    description: 'Premium dark theme with authoritative presence',
    preview: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
    colors: {
      background: '#111827',
      backgroundSecondary: '#1f2937',
      text: '#f3f4f6',
      textSecondary: '#9ca3af',
      heading: '#ffffff',
      accent: '#60a5fa',
      accentHover: '#3b82f6',
      cta: '#3b82f6',
      ctaText: '#ffffff',
      border: '#374151',
      highlight: '#1e3a5f',
    },
    fonts: {
      heading: 'Montserrat, sans-serif',
      body: 'Open Sans, sans-serif',
    },
    style: 'dark',
  },
  sunset_orange: {
    id: 'sunset_orange',
    name: 'Sunset Orange',
    description: 'Warm and friendly with approachable orange tones',
    preview: 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)',
    colors: {
      background: '#fffbeb',
      backgroundSecondary: '#fff7ed',
      text: '#1c1917',
      textSecondary: '#57534e',
      heading: '#c2410c',
      accent: '#ea580c',
      accentHover: '#c2410c',
      cta: '#ea580c',
      ctaText: '#ffffff',
      border: '#fed7aa',
      highlight: '#ffedd5',
    },
    fonts: {
      heading: 'Poppins, sans-serif',
      body: 'Lato, sans-serif',
    },
    style: 'modern',
  },
  tech_purple: {
    id: 'tech_purple',
    name: 'Tech Purple',
    description: 'Modern software and SaaS style with purple gradients',
    preview: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
    colors: {
      background: '#faf5ff',
      backgroundSecondary: '#f3e8ff',
      text: '#1e1b4b',
      textSecondary: '#4c1d95',
      heading: '#6d28d9',
      accent: '#7c3aed',
      accentHover: '#6d28d9',
      cta: '#7c3aed',
      ctaText: '#ffffff',
      border: '#c4b5fd',
      highlight: '#ddd6fe',
    },
    fonts: {
      heading: 'Space Grotesk, sans-serif',
      body: 'Inter, sans-serif',
    },
    style: 'modern',
  },
  black_gold: {
    id: 'black_gold',
    name: 'Black & Gold Luxury',
    description: 'Exclusive luxury feel with black and gold accents',
    preview: 'linear-gradient(135deg, #171717 0%, #ca8a04 100%)',
    colors: {
      background: '#0a0a0a',
      backgroundSecondary: '#171717',
      text: '#fafafa',
      textSecondary: '#a3a3a3',
      heading: '#fbbf24',
      accent: '#ca8a04',
      accentHover: '#a16207',
      cta: '#ca8a04',
      ctaText: '#000000',
      border: '#3f3f46',
      highlight: '#2b2311',
    },
    fonts: {
      heading: 'Playfair Display, serif',
      body: 'Lora, serif',
    },
    style: 'luxury',
  },
  fresh_teal: {
    id: 'fresh_teal',
    name: 'Fresh Teal',
    description: 'Clean health and wellness style with calming teal',
    preview: 'linear-gradient(135deg, #0d9488 0%, #5eead4 100%)',
    colors: {
      background: '#f0fdfa',
      backgroundSecondary: '#ccfbf1',
      text: '#134e4a',
      textSecondary: '#115e59',
      heading: '#0f766e',
      accent: '#0d9488',
      accentHover: '#0f766e',
      cta: '#0d9488',
      ctaText: '#ffffff',
      border: '#99f6e4',
      highlight: '#ccfbf1',
    },
    fonts: {
      heading: 'Nunito, sans-serif',
      body: 'Source Sans Pro, sans-serif',
    },
    style: 'clean',
  },
  fire_red: {
    id: 'fire_red',
    name: 'Fire Red Energy',
    description: 'High energy action-oriented with intense red gradients',
    preview: 'linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)',
    colors: {
      background: '#1a1a1a',
      backgroundSecondary: '#262626',
      text: '#fafafa',
      textSecondary: '#d4d4d4',
      heading: '#ef4444',
      accent: '#dc2626',
      accentHover: '#b91c1c',
      cta: '#ef4444',
      ctaText: '#ffffff',
      border: '#404040',
      highlight: '#3d1515',
    },
    fonts: {
      heading: 'Oswald, sans-serif',
      body: 'Roboto, sans-serif',
    },
    style: 'bold',
  },
  ocean_blue: {
    id: 'ocean_blue',
    name: 'Ocean Blue Trust',
    description: 'Calm and trustworthy with deep ocean blue tones',
    preview: 'linear-gradient(135deg, #0369a1 0%, #38bdf8 100%)',
    colors: {
      background: '#f0f9ff',
      backgroundSecondary: '#e0f2fe',
      text: '#0c4a6e',
      textSecondary: '#0369a1',
      heading: '#075985',
      accent: '#0284c7',
      accentHover: '#0369a1',
      cta: '#0284c7',
      ctaText: '#ffffff',
      border: '#7dd3fc',
      highlight: '#bae6fd',
    },
    fonts: {
      heading: 'Merriweather, serif',
      body: 'Source Sans Pro, sans-serif',
    },
    style: 'clean',
  },
  neon_gamer: {
    id: 'neon_gamer',
    name: 'Neon Gamer',
    description: 'Gaming and tech audience with vibrant neon colors',
    preview: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
    colors: {
      background: '#0f0f23',
      backgroundSecondary: '#1a1a2e',
      text: '#e0e0ff',
      textSecondary: '#a0a0c0',
      heading: '#00ff88',
      accent: '#ff00ff',
      accentHover: '#cc00cc',
      cta: '#00ff88',
      ctaText: '#000000',
      border: '#333366',
      highlight: '#1a1a4d',
    },
    fonts: {
      heading: 'Orbitron, sans-serif',
      body: 'Exo 2, sans-serif',
    },
    style: 'dark',
  },
  minimalist_white: {
    id: 'minimalist_white',
    name: 'Minimalist White',
    description: 'Clean modern design with minimal distractions',
    preview: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
    colors: {
      background: '#ffffff',
      backgroundSecondary: '#fafafa',
      text: '#171717',
      textSecondary: '#525252',
      heading: '#0a0a0a',
      accent: '#171717',
      accentHover: '#262626',
      cta: '#171717',
      ctaText: '#ffffff',
      border: '#e5e5e5',
      highlight: '#f5f5f5',
    },
    fonts: {
      heading: 'DM Sans, sans-serif',
      body: 'DM Sans, sans-serif',
    },
    style: 'clean',
  },
};

export function getTheme(themeId: string): ThemeConfig {
  return THEMES[themeId] || THEMES.classic_red;
}

export function getThemeCSS(theme: ThemeConfig): string {
  return `
    :root {
      --theme-background: ${theme.colors.background};
      --theme-background-secondary: ${theme.colors.backgroundSecondary};
      --theme-text: ${theme.colors.text};
      --theme-text-secondary: ${theme.colors.textSecondary};
      --theme-heading: ${theme.colors.heading};
      --theme-accent: ${theme.colors.accent};
      --theme-accent-hover: ${theme.colors.accentHover};
      --theme-cta: ${theme.colors.cta};
      --theme-cta-text: ${theme.colors.ctaText};
      --theme-border: ${theme.colors.border};
      --theme-highlight: ${theme.colors.highlight};
      --theme-font-heading: ${theme.fonts.heading};
      --theme-font-body: ${theme.fonts.body};
    }
    
    body {
      background-color: var(--theme-background);
      color: var(--theme-text);
      font-family: var(--theme-font-body);
    }
    
    h1, h2, h3, h4, h5, h6 {
      color: var(--theme-heading);
      font-family: var(--theme-font-heading);
    }
    
    .theme-cta {
      background-color: var(--theme-cta);
      color: var(--theme-cta-text);
    }
    
    .theme-cta:hover {
      background-color: var(--theme-accent-hover);
    }
    
    .theme-accent {
      color: var(--theme-accent);
    }
    
    .theme-highlight {
      background-color: var(--theme-highlight);
    }
    
    .theme-secondary-bg {
      background-color: var(--theme-background-secondary);
    }
  `;
}
