import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, Smartphone, Eye, Copy, Download, FileJson, Type, Image, MousePointer2 } from 'lucide-react';
import type { PageSection, ThemeType, ProjectType, FreeformElement as FreeformElementType } from '@/lib/projectTypes';
import { useToast } from '@/hooks/use-toast';
import { generateHtml, generateJson, downloadFile, copyToClipboard } from '@/lib/exportUtils';
import { FreeformElementsLayer } from './FreeformElement';
import { buildTextEffectStyles, type TextEffectsValues } from './TextEffectsEditor';

import maleAvatar from '@assets/generated_images/male_testimonial_avatar.png';
import femaleAvatar from '@assets/generated_images/female_testimonial_avatar.png';
import heroClassicRed from '@assets/stock_images/businessman_success__7d16691b.jpg';
import heroCleanBlue from '@assets/stock_images/corporate_profession_c8ce1fd7.jpg';
import heroMoneyGreen from '@assets/stock_images/money_green_dollars__60688080.jpg';
import heroDarkAuthority from '@assets/stock_images/dark_mysterious_exec_ea292d9f.jpg';
import heroSunsetOrange from '@assets/stock_images/sunset_beach_freedom_60b410f0.jpg';
import heroTechPurple from '@assets/stock_images/technology_futuristi_248403bc.jpg';
import heroBlackGold from '@assets/stock_images/luxury_gold_coins_in_aa8a0211.jpg';
import heroFreshTeal from '@assets/stock_images/health_wellness_fitn_865cc857.jpg';
import heroFireRed from '@assets/stock_images/fire_flames_intense__96065250.jpg';
import heroOceanBlue from '@assets/stock_images/ocean_waves_blue_wat_4f2c4b0f.jpg';
import heroNeonGamer from '@assets/stock_images/neon_lights_gaming_e_a3c2587e.jpg';
import heroMinimalistWhite from '@assets/stock_images/minimal_clean_white__8ea30bcd.jpg';

// Strip HTML tags from content
const stripHtml = (html: string | undefined): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

interface PagePreviewProps {
  sections: PageSection[];
  theme: ThemeType;
  hasWatermark: boolean;
  canDownloadHtml: boolean;
  canExportJson: boolean;
  onPreview: () => void;
  projectName?: string;
  projectType?: ProjectType;
  onSectionsChange?: (sections: PageSection[]) => void;
  freeformElements?: FreeformElementType[];
  onFreeformElementsChange?: (elements: FreeformElementType[]) => void;
  isEditMode?: boolean;
}

const THEME_HERO_IMAGES: Record<ThemeType, string> = {
  classic_red: heroClassicRed,
  clean_blue: heroCleanBlue,
  money_green: heroMoneyGreen,
  dark_authority: heroDarkAuthority,
  sunset_orange: heroSunsetOrange,
  tech_purple: heroTechPurple,
  black_gold: heroBlackGold,
  fresh_teal: heroFreshTeal,
  fire_red: heroFireRed,
  ocean_blue: heroOceanBlue,
  neon_gamer: heroNeonGamer,
  minimalist_white: heroMinimalistWhite,
};

const THEME_STYLES: Record<ThemeType, {
  bg: string;
  text: string;
  accent: string;
  button: string;
  card: string;
  heroOverlay: string;
  badgeStyle: string;
  testimonialBg: string;
}> = {
  classic_red: {
    bg: 'bg-gradient-to-b from-amber-50 to-yellow-100',
    text: 'text-gray-900',
    accent: 'text-red-600',
    button: 'bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg',
    card: 'bg-white border-2 border-yellow-400 shadow-lg',
    heroOverlay: 'linear-gradient(rgba(0,0,0,0.5), rgba(139,0,0,0.6))',
    badgeStyle: 'bg-red-600 text-white',
    testimonialBg: 'bg-amber-50',
  },
  clean_blue: {
    bg: 'bg-gradient-to-b from-white to-blue-50',
    text: 'text-slate-900',
    accent: 'text-blue-600',
    button: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md',
    card: 'bg-white border border-blue-200 shadow-md',
    heroOverlay: 'linear-gradient(rgba(0,30,60,0.6), rgba(0,60,120,0.7))',
    badgeStyle: 'bg-blue-600 text-white',
    testimonialBg: 'bg-blue-50',
  },
  money_green: {
    bg: 'bg-gradient-to-b from-green-50 to-emerald-100',
    text: 'text-green-900',
    accent: 'text-emerald-600',
    button: 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-bold shadow-lg',
    card: 'bg-white border-2 border-green-400 shadow-lg',
    heroOverlay: 'linear-gradient(rgba(0,50,0,0.6), rgba(0,80,0,0.7))',
    badgeStyle: 'bg-emerald-600 text-white',
    testimonialBg: 'bg-green-50',
  },
  dark_authority: {
    bg: 'bg-gradient-to-b from-gray-900 to-gray-800',
    text: 'text-gray-100',
    accent: 'text-blue-400',
    button: 'bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-xl shadow-blue-500/30',
    card: 'bg-gray-800/90 border border-gray-600 shadow-xl',
    heroOverlay: 'linear-gradient(rgba(0,0,0,0.7), rgba(20,20,40,0.8))',
    badgeStyle: 'bg-blue-500 text-white',
    testimonialBg: 'bg-gray-800',
  },
  sunset_orange: {
    bg: 'bg-gradient-to-b from-amber-50 to-orange-100',
    text: 'text-stone-900',
    accent: 'text-orange-600',
    button: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg',
    card: 'bg-white border-2 border-orange-300 shadow-lg',
    heroOverlay: 'linear-gradient(rgba(80,30,0,0.5), rgba(120,50,0,0.6))',
    badgeStyle: 'bg-orange-500 text-white',
    testimonialBg: 'bg-orange-50',
  },
  tech_purple: {
    bg: 'bg-gradient-to-b from-purple-50 to-violet-100',
    text: 'text-indigo-900',
    accent: 'text-violet-600',
    button: 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-violet-500/25',
    card: 'bg-white border border-violet-300 shadow-lg',
    heroOverlay: 'linear-gradient(rgba(50,0,80,0.6), rgba(80,0,120,0.7))',
    badgeStyle: 'bg-violet-600 text-white',
    testimonialBg: 'bg-violet-50',
  },
  black_gold: {
    bg: 'bg-gradient-to-b from-neutral-900 to-black',
    text: 'text-neutral-100',
    accent: 'text-yellow-500',
    button: 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-bold shadow-xl shadow-yellow-500/30',
    card: 'bg-neutral-800/90 border-2 border-yellow-500/50 shadow-xl',
    heroOverlay: 'linear-gradient(rgba(0,0,0,0.7), rgba(40,30,0,0.8))',
    badgeStyle: 'bg-yellow-500 text-black',
    testimonialBg: 'bg-neutral-800',
  },
  fresh_teal: {
    bg: 'bg-gradient-to-b from-teal-50 to-cyan-100',
    text: 'text-teal-900',
    accent: 'text-teal-600',
    button: 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold shadow-lg',
    card: 'bg-white border-2 border-teal-300 shadow-lg',
    heroOverlay: 'linear-gradient(rgba(0,60,60,0.5), rgba(0,80,80,0.6))',
    badgeStyle: 'bg-teal-600 text-white',
    testimonialBg: 'bg-teal-50',
  },
  fire_red: {
    bg: 'bg-gradient-to-b from-neutral-900 to-neutral-800',
    text: 'text-neutral-100',
    accent: 'text-red-500',
    button: 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold shadow-xl shadow-red-500/30',
    card: 'bg-neutral-800/90 border border-red-500/50 shadow-xl',
    heroOverlay: 'linear-gradient(rgba(40,0,0,0.6), rgba(60,0,0,0.7))',
    badgeStyle: 'bg-red-600 text-white',
    testimonialBg: 'bg-neutral-800',
  },
  ocean_blue: {
    bg: 'bg-gradient-to-b from-sky-50 to-cyan-100',
    text: 'text-sky-900',
    accent: 'text-sky-600',
    button: 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold shadow-lg',
    card: 'bg-white border-2 border-sky-300 shadow-lg',
    heroOverlay: 'linear-gradient(rgba(0,40,80,0.5), rgba(0,60,100,0.6))',
    badgeStyle: 'bg-sky-600 text-white',
    testimonialBg: 'bg-sky-50',
  },
  neon_gamer: {
    bg: 'bg-gradient-to-b from-purple-900 via-violet-800 to-indigo-900',
    text: 'text-white',
    accent: 'text-fuchsia-400',
    button: 'bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 hover:from-fuchsia-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold shadow-xl shadow-fuchsia-500/40 animate-pulse',
    card: 'bg-black/40 backdrop-blur-md border-2 border-fuchsia-500/50 shadow-xl shadow-fuchsia-500/20',
    heroOverlay: 'linear-gradient(rgba(40,0,60,0.7), rgba(60,0,80,0.8))',
    badgeStyle: 'bg-fuchsia-500 text-white',
    testimonialBg: 'bg-purple-900/50',
  },
  minimalist_white: {
    bg: 'bg-gradient-to-b from-white to-neutral-50',
    text: 'text-neutral-900',
    accent: 'text-neutral-700',
    button: 'bg-neutral-900 hover:bg-neutral-800 text-white font-medium shadow-md',
    card: 'bg-white border border-neutral-200 shadow-sm',
    heroOverlay: 'linear-gradient(rgba(255,255,255,0.3), rgba(240,240,240,0.5))',
    badgeStyle: 'bg-neutral-800 text-white',
    testimonialBg: 'bg-neutral-50',
  },
};

export function PagePreview({
  sections,
  theme,
  hasWatermark,
  canDownloadHtml,
  canExportJson,
  onPreview,
  projectName = 'Untitled Project',
  projectType = 'sales_letter',
  onSectionsChange,
  freeformElements = [],
  onFreeformElementsChange,
  isEditMode = true,
}: PagePreviewProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedFreeformId, setSelectedFreeformId] = useState<string | null>(null);
  const [freeformEditMode, setFreeformEditMode] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const styles = THEME_STYLES[theme] || THEME_STYLES.classic_red;

  const handleAddFreeformElement = (type: 'text' | 'image') => {
    if (!onFreeformElementsChange) return;
    
    const newElement: FreeformElementType = {
      id: `freeform-${Date.now()}`,
      type,
      x: 10,
      y: 100,
      width: type === 'text' ? 30 : 20,
      height: type === 'text' ? 0 : 150,
      zIndex: freeformElements.length + 1,
      content: type === 'text' ? 'Click to edit text' : '',
      styles: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: '12px',
        borderRadius: '8px',
      },
    };
    
    onFreeformElementsChange([...freeformElements, newElement]);
    setSelectedFreeformId(newElement.id);
    setFreeformEditMode(true);
    toast({ title: 'Element Added', description: `${type === 'text' ? 'Text box' : 'Image'} added. Drag to position.` });
  };

  const handleUpdateFreeformElement = (id: string, updates: Partial<FreeformElementType>) => {
    if (!onFreeformElementsChange) return;
    
    const updatedElements = freeformElements.map((el) =>
      el.id === id ? { ...el, ...updates } : el
    );
    onFreeformElementsChange(updatedElements);
  };

  const handleDeleteFreeformElement = (id: string) => {
    if (!onFreeformElementsChange) return;
    
    onFreeformElementsChange(freeformElements.filter((el) => el.id !== id));
    setSelectedFreeformId(null);
    toast({ title: 'Deleted', description: 'Element removed' });
  };

  const handlePricingBoxClick = (sectionId: string, clickedIndex: number) => {
    if (!onSectionsChange) return;
    
    const updatedSections = sections.map(section => {
      if (section.id === sectionId && section.type === 'pricing_table') {
        const packages = (section.data.packages as Array<{name: string; price: string; originalPrice?: string; features: string[]; buttonText: string; highlighted?: boolean}>) || [];
        const updatedPackages = packages.map((pkg, i) => ({
          ...pkg,
          highlighted: i === clickedIndex
        }));
        return {
          ...section,
          data: {
            ...section.data,
            packages: updatedPackages
          }
        };
      }
      return section;
    });
    
    onSectionsChange(updatedSections);
  };

  const handleCopyHtml = async () => {
    try {
      const html = generateHtml(sections, theme, projectName, hasWatermark);
      await copyToClipboard(html);
      toast({ title: 'Copied!', description: 'HTML copied to clipboard' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to copy HTML', variant: 'destructive' });
    }
  };

  const handleDownloadHtml = () => {
    try {
      const html = generateHtml(sections, theme, projectName, hasWatermark);
      const filename = `${projectName.toLowerCase().replace(/\s+/g, '-')}.html`;
      downloadFile(html, filename, 'text/html');
      toast({ title: 'Downloaded!', description: `${filename} saved` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to download HTML', variant: 'destructive' });
    }
  };

  const handleExportJson = () => {
    try {
      const json = generateJson(sections, theme, projectName, projectType);
      const filename = `${projectName.toLowerCase().replace(/\s+/g, '-')}.json`;
      downloadFile(json, filename, 'application/json');
      toast({ title: 'Exported!', description: `${filename} saved` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to export JSON', variant: 'destructive' });
    }
  };

  const renderSection = (section: PageSection) => {
    const data = section.data;

    switch (section.type) {
      case 'hero': {
        const heroImage = THEME_HERO_IMAGES[theme] || THEME_HERO_IMAGES.classic_red;
        const heroTextEffects = buildTextEffectStyles((data.textEffects as TextEffectsValues) || {});
        return (
          <div 
            key={section.id}
            className="relative min-h-[450px] flex items-center justify-center"
            style={{
              backgroundImage: `${styles.heroOverlay}, url(${heroImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {(data.scarcityText as string) && (
              <Badge className={`absolute top-4 right-4 z-10 ${styles.badgeStyle} animate-pulse px-3 py-1 text-sm font-bold`}>
                {stripHtml(data.scarcityText as string)}
              </Badge>
            )}
            <div className="text-center px-6 py-20 max-w-4xl mx-auto">
              <h1 
                className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg"
                style={heroTextEffects}
              >
                {stripHtml(data.headline as string) || 'Your Headline Here'}
              </h1>
              <p 
                className="text-lg md:text-xl lg:text-2xl text-gray-100 mb-10 max-w-2xl mx-auto drop-shadow-md"
                style={heroTextEffects}
              >
                {stripHtml(data.subheadline as string) || 'Your compelling subheadline goes here'}
              </p>
              <Button size="lg" className={`${styles.button} px-10 py-7 text-lg md:text-xl uppercase tracking-wide`}>
                {stripHtml(data.buttonText as string) || 'Get Started Now'}
              </Button>
              <p className="text-gray-300 text-sm mt-4 opacity-80">
                No credit card required. Instant access.
              </p>
            </div>
          </div>
        );
      }

      case 'subheadline': {
        const subheadlineTextEffects = buildTextEffectStyles((data.textEffects as TextEffectsValues) || {});
        return (
          <div key={section.id} className="py-12 px-6">
            <p 
              className={`text-xl md:text-2xl text-center max-w-3xl mx-auto leading-relaxed ${styles.text}`}
              style={subheadlineTextEffects}
            >
              {stripHtml(data.text as string) || 'Your subheadline text here...'}
            </p>
          </div>
        );
      }

      case 'video':
        return (
          <div key={section.id} className="py-12 px-6">
            <div className="max-w-4xl mx-auto">
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-900 shadow-2xl">
                {(data.embedUrl as string) ? (
                  <iframe
                    src={data.embedUrl as string}
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Video Placeholder
                  </div>
                )}
              </div>
              {(data.caption as string) && (
                <p className={`text-center mt-4 ${styles.text} opacity-80`}>
                  {data.caption as string}
                </p>
              )}
            </div>
          </div>
        );

      case 'bullets': {
        const bulletsTextEffects = buildTextEffectStyles((data.textEffects as TextEffectsValues) || {});
        return (
          <div key={section.id} className="py-14 px-6">
            <div className="max-w-2xl mx-auto">
              {(data.title as string) && (
                <h3 
                  className={`text-2xl md:text-3xl font-bold mb-8 text-center ${styles.text}`}
                  style={bulletsTextEffects}
                >
                  {data.title as string}
                </h3>
              )}
              <ul className="space-y-5">
                {((data.items as string[]) || []).map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className={`flex-shrink-0 w-7 h-7 rounded-full ${styles.badgeStyle} flex items-center justify-center text-sm font-bold`}>
                      &#10003;
                    </span>
                    <span className={`text-lg md:text-xl ${styles.text}`} style={bulletsTextEffects}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      }

      case 'testimonial': {
        const testimonialIndex = sections.filter(s => s.type === 'testimonial').findIndex(s => s.id === section.id);
        const avatar = testimonialIndex % 2 === 0 ? maleAvatar : femaleAvatar;
        return (
          <div key={section.id} className={`py-12 px-6 ${styles.testimonialBg}`}>
            <div className={`max-w-2xl mx-auto p-8 rounded-xl ${styles.card}`}>
              <div className="flex justify-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-yellow-400 text-xl">&#9733;</span>
                ))}
              </div>
              <p className={`text-lg md:text-xl italic mb-6 text-center ${styles.text}`}>
                "{(data.quote as string) || 'Customer testimonial goes here...'}"
              </p>
              <div className="flex items-center justify-center gap-4">
                <img 
                  src={avatar} 
                  alt="Avatar" 
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-offset-2 ring-primary/50"
                />
                <div>
                  <p className={`font-bold text-lg ${styles.text}`}>
                    {(data.name as string) || 'Customer Name'}
                  </p>
                  <p className={`text-sm opacity-70 ${styles.text}`}>
                    {(data.role as string) || 'Verified Buyer'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'cta': {
        const ctaTextEffects = buildTextEffectStyles((data.textEffects as TextEffectsValues) || {});
        return (
          <div key={section.id} className="py-20 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
            <div className="max-w-3xl mx-auto text-center relative z-10">
              <Badge className={`${styles.badgeStyle} mb-6 px-4 py-1`}>
                SPECIAL OFFER
              </Badge>
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${styles.text}`} style={ctaTextEffects}>
                {stripHtml(data.headline as string) || 'Ready to Get Started?'}
              </h2>
              {(data.scarcityText as string) && (
                <p className="text-red-500 font-bold text-lg mb-6 animate-pulse">
                  {stripHtml(data.scarcityText as string)}
                </p>
              )}
              <div className="mb-6">
                <Button size="lg" className={`${styles.button} px-14 py-8 text-xl md:text-2xl uppercase tracking-wide`}>
                  {stripHtml(data.buttonText as string) || 'Get Started Now'}
                </Button>
              </div>
              <div className="flex items-center justify-center gap-6 flex-wrap text-sm opacity-70">
                <span className={styles.text}>Secure Checkout</span>
                <span className={styles.text}>Instant Access</span>
                <span className={styles.text}>30-Day Guarantee</span>
              </div>
              {(data.guaranteeText as string) && (
                <p className={`mt-6 text-sm ${styles.text} opacity-80`}>
                  {stripHtml(data.guaranteeText as string)}
                </p>
              )}
            </div>
          </div>
        );
      }

      case 'divider':
        return (
          <div key={section.id} className="py-8">
            <div className="max-w-xl mx-auto h-px bg-gradient-to-r from-transparent via-gray-500/50 to-transparent" />
          </div>
        );

      case 'guarantee':
        return (
          <div key={section.id} className="py-16 px-6">
            <div className={`max-w-2xl mx-auto text-center p-10 rounded-xl ${styles.card} border-2`}>
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${styles.text}`}>
                {(data.title as string) || '100% Money Back Guarantee'}
              </h3>
              <p className={`text-lg ${styles.text} opacity-80 leading-relaxed`}>
                {(data.description as string) || 'Try it completely risk-free. If you are not 100% satisfied within 30 days, we will refund every penny. No questions asked.'}
              </p>
            </div>
          </div>
        );

      case 'jv_commissions':
        return (
          <div key={section.id} className="py-12 px-6">
            <div className={`max-w-2xl mx-auto p-8 rounded-xl ${styles.card}`}>
              <h3 className={`text-2xl font-bold mb-6 text-center ${styles.text}`}>
                {(data.headline as string) || 'Earn 50% Commissions'}
              </h3>
              <div className="grid gap-4">
                {((data.tiers as Array<{name: string; commission: string}>) || []).map((tier, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                    <span className={styles.text}>{tier.name}</span>
                    <span className={`text-2xl font-bold ${styles.accent}`}>{tier.commission}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
                <Badge variant="secondary">EPC: {(data.epc as string) || '$2.50'}</Badge>
                <Badge variant="secondary">Cookie: {(data.cookieDuration as string) || '60 days'}</Badge>
              </div>
            </div>
          </div>
        );

      case 'bonus_stack':
        return (
          <div key={section.id} className="py-16 px-6">
            <div className="max-w-3xl mx-auto">
              <h3 className={`text-3xl md:text-4xl font-bold mb-4 text-center ${styles.text}`}>
                {(data.title as string) || 'But Wait... There\'s More!'}
              </h3>
              <p className={`text-center mb-10 text-lg ${styles.text} opacity-80`}>
                Order now and get these exclusive bonuses FREE:
              </p>
              <div className="space-y-6">
                {((data.bonuses as Array<{title: string; description: string; value: string}>) || []).map((bonus, i) => (
                  <div key={i} className={`${styles.card} p-6 rounded-xl flex items-center gap-6`}>
                    <div className={`w-16 h-16 flex-shrink-0 rounded-full ${styles.badgeStyle} flex items-center justify-center text-2xl font-bold`}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-xl font-bold ${styles.text}`}>{bonus.title}</h4>
                      <p className={`${styles.text} opacity-80`}>{bonus.description}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl font-bold ${styles.accent}`}>{bonus.value}</span>
                      <span className={`block text-sm ${styles.text} opacity-60`}>Value</span>
                    </div>
                  </div>
                ))}
              </div>
              {(data.totalValue as string) && (
                <div className="mt-8 text-center">
                  <p className={`text-xl ${styles.text}`}>Total Bonus Value: <span className={`font-bold ${styles.accent}`}>{data.totalValue as string}</span></p>
                </div>
              )}
            </div>
          </div>
        );

      case 'faq':
        return (
          <div key={section.id} className="py-16 px-6">
            <div className="max-w-3xl mx-auto">
              <h3 className={`text-3xl font-bold mb-10 text-center ${styles.text}`}>
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {((data.items as Array<{question: string; answer: string}>) || []).map((item, i) => (
                  <div key={i} className={`${styles.card} p-6 rounded-xl`}>
                    <h4 className={`text-lg font-bold mb-2 ${styles.text}`}>
                      Q: {stripHtml(item.question)}
                    </h4>
                    <p className={`${styles.text} opacity-80 leading-relaxed`}>
                      A: {stripHtml(item.answer)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'feature_grid':
        return (
          <div key={section.id} className="py-16 px-6">
            <div className="max-w-5xl mx-auto">
              {(data.headline as string) && (
                <h3 className={`text-3xl font-bold mb-10 text-center ${styles.text}`}>
                  {data.headline as string}
                </h3>
              )}
              <div className={`grid gap-6 ${(data.columns as number) === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
                {((data.features as Array<{icon: string; title: string; description: string}>) || []).map((feature, i) => (
                  <div key={i} className={`${styles.card} p-6 rounded-xl text-center`}>
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-full ${styles.badgeStyle} flex items-center justify-center`}>
                      <span className="text-2xl">
                        {feature.icon === 'zap' && '\u26A1'}
                        {feature.icon === 'shield' && '\u{1F6E1}'}
                        {feature.icon === 'award' && '\u{1F3C6}'}
                        {feature.icon === 'check' && '\u2713'}
                        {feature.icon === 'star' && '\u2B50'}
                        {feature.icon === 'heart' && '\u2764'}
                        {!['zap', 'shield', 'award', 'check', 'star', 'heart'].includes(feature.icon) && '\u2713'}
                      </span>
                    </div>
                    <h4 className={`text-xl font-bold mb-2 ${styles.text}`}>{feature.title}</h4>
                    <p className={`${styles.text} opacity-80`}>{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'jv_calendar':
        return (
          <div key={section.id} className="py-12 px-6">
            <div className={`max-w-2xl mx-auto p-8 rounded-xl ${styles.card}`}>
              <h3 className={`text-2xl font-bold mb-6 text-center ${styles.text}`}>
                Launch Schedule
              </h3>
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 bg-black/10 rounded-lg">
                  <span className={`font-medium ${styles.text}`}>Launch Date</span>
                  <span className={`font-bold ${styles.accent}`}>{(data.launchDate as string) || 'TBA'}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-black/10 rounded-lg">
                  <span className={`font-medium ${styles.text}`}>Cart Opens</span>
                  <span className={`font-bold ${styles.text}`}>{(data.cartOpen as string) || '9:00 AM EST'}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-black/10 rounded-lg">
                  <span className={`font-medium ${styles.text}`}>Cart Closes</span>
                  <span className={`font-bold ${styles.text}`}>{(data.cartClose as string) || '11:59 PM EST'}</span>
                </div>
                {(data.webinarTime as string) && (
                  <div className="flex items-center justify-between p-4 bg-black/10 rounded-lg">
                    <span className={`font-medium ${styles.text}`}>Webinar</span>
                    <span className={`font-bold ${styles.text}`}>{data.webinarTime as string}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'jv_prizes':
        return (
          <div key={section.id} className="py-12 px-6">
            <div className={`max-w-2xl mx-auto p-8 rounded-xl ${styles.card}`}>
              <h3 className={`text-2xl font-bold mb-6 text-center ${styles.text}`}>
                {(data.headline as string) || 'Win Amazing Prizes'}
              </h3>
              <div className="grid gap-4">
                {((data.prizes as Array<{position: string; amount: string}>) || []).map((prize, i) => (
                  <div key={i} className={`flex items-center justify-between p-4 rounded-lg ${i === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-2 border-yellow-500/50' : 'bg-black/10'}`}>
                    <span className={`font-bold text-lg ${styles.text}`}>{prize.position} Place</span>
                    <span className={`text-2xl font-bold ${styles.accent}`}>{prize.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'pricing_table':
        return (
          <div key={section.id} className="py-16 px-6">
            <div className="max-w-5xl mx-auto">
              <h3 className={`text-3xl font-bold mb-4 text-center ${styles.text}`}>
                {(data.headline as string) || 'Choose Your Package'}
              </h3>
              {(data.subheadline as string) && (
                <p className={`text-center mb-10 ${styles.text} opacity-80`}>{data.subheadline as string}</p>
              )}
              <div className={`grid gap-6 ${((data.packages as Array<unknown>)?.length || 0) === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'md:grid-cols-3'}`}>
                {((data.packages as Array<{name: string; price: string; originalPrice?: string; features: string[]; buttonText: string; highlighted?: boolean}>) || []).map((pkg, i) => (
                  <div 
                    key={i} 
                    className={`${styles.card} p-6 rounded-xl cursor-pointer transition-all duration-200 ${pkg.highlighted ? 'ring-2 ring-offset-2 ring-primary scale-105' : 'hover:scale-102 hover:shadow-lg'}`}
                    onClick={() => handlePricingBoxClick(section.id, i)}
                    data-testid={`pricing-box-${i}-${section.id}`}
                  >
                    {pkg.highlighted && (
                      <Badge className={`${styles.badgeStyle} mb-4 w-full justify-center`}>MOST POPULAR</Badge>
                    )}
                    <h4 className={`text-xl font-bold text-center mb-2 ${styles.text}`}>{pkg.name}</h4>
                    <div className="text-center mb-4">
                      {pkg.originalPrice && (
                        <span className={`text-lg line-through ${styles.text} opacity-50 mr-2`}>{pkg.originalPrice}</span>
                      )}
                      <span className={`text-4xl font-bold ${styles.accent}`}>{pkg.price}</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {pkg.features.map((feature, j) => (
                        <li key={j} className={`flex items-center gap-2 ${styles.text}`}>
                          <span className={styles.accent}>&#10003;</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className={`${styles.button} w-full`}>{pkg.buttonText || 'Get Started'}</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'countdown_timer':
        return (
          <div key={section.id} className="py-12 px-6">
            <div className={`max-w-2xl mx-auto text-center p-8 rounded-xl ${styles.card} border-2 border-red-500/50`}>
              <h3 className={`text-2xl font-bold mb-2 ${styles.text}`}>
                {(data.headline as string) || 'This Offer Expires In:'}
              </h3>
              <div className="flex items-center justify-center gap-4 my-6">
                {['Days', 'Hours', 'Mins', 'Secs'].map((unit, i) => (
                  <div key={unit} className="text-center">
                    <div className={`w-16 h-16 ${styles.badgeStyle} rounded-lg flex items-center justify-center text-2xl font-bold`}>
                      {[0, 12, 34, 56][i]}
                    </div>
                    <span className={`text-xs ${styles.text} opacity-70`}>{unit}</span>
                  </div>
                ))}
              </div>
              <p className="text-red-500 font-bold animate-pulse">
                {(data.urgencyText as string) || 'Act now before this offer disappears forever!'}
              </p>
            </div>
          </div>
        );

      case 'about_author':
        return (
          <div key={section.id} className="py-16 px-6">
            <div className={`max-w-3xl mx-auto ${styles.card} p-8 rounded-xl`}>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-6xl text-white font-bold flex-shrink-0">
                  {((data.name as string) || 'A').charAt(0)}
                </div>
                <div className="text-center md:text-left">
                  <h3 className={`text-2xl font-bold mb-2 ${styles.text}`}>
                    {(data.name as string) || 'About The Author'}
                  </h3>
                  <p className={`${styles.accent} font-medium mb-4`}>
                    {(data.title as string) || 'Expert & Entrepreneur'}
                  </p>
                  <p className={`${styles.text} opacity-80 leading-relaxed`}>
                    {(data.bio as string) || 'Share your story, credentials, and why you created this product...'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'story_section':
        return (
          <div key={section.id} className="py-16 px-6">
            <div className="max-w-3xl mx-auto">
              {(data.headline as string) && (
                <h3 className={`text-3xl font-bold mb-8 text-center ${styles.text}`}>
                  {data.headline as string}
                </h3>
              )}
              <div className={`prose prose-lg max-w-none ${styles.text}`}>
                {((data.paragraphs as string[]) || [(data.content as string) || 'Your story goes here...']).map((p, i) => (
                  <p key={i} className={`mb-4 leading-relaxed ${styles.text}`}>{stripHtml(p)}</p>
                ))}
              </div>
            </div>
          </div>
        );

      case 'social_proof_bar':
        return (
          <div key={section.id} className="py-8 px-6 bg-black/5">
            <div className="max-w-5xl mx-auto">
              <p className={`text-center text-sm mb-4 ${styles.text} opacity-70`}>
                {(data.headline as string) || 'As Featured In:'}
              </p>
              <div className="flex items-center justify-center gap-8 flex-wrap">
                {((data.logos as string[]) || ['Forbes', 'Inc', 'Entrepreneur', 'Business Insider']).map((logo, i) => (
                  <span key={i} className={`text-xl font-bold ${styles.text} opacity-40`}>{logo}</span>
                ))}
              </div>
            </div>
          </div>
        );

      case 'warning_box':
        return (
          <div key={section.id} className="py-12 px-6">
            <div className="max-w-2xl mx-auto p-6 rounded-xl bg-red-500/10 border-2 border-red-500/50">
              <div className="flex items-start gap-4">
                <span className="text-3xl">&#9888;</span>
                <div>
                  <h4 className={`text-xl font-bold mb-2 text-red-600`}>
                    {(data.headline as string) || 'WARNING'}
                  </h4>
                  <p className={`${styles.text} leading-relaxed`}>
                    {(data.content as string) || 'Important warning message goes here...'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'who_is_this_for':
        return (
          <div key={section.id} className="py-16 px-6">
            <div className="max-w-3xl mx-auto">
              <h3 className={`text-3xl font-bold mb-10 text-center ${styles.text}`}>
                {(data.headline as string) || 'Who Is This For?'}
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className={`${styles.card} p-6 rounded-xl`}>
                  <h4 className={`text-xl font-bold mb-4 text-green-600`}>This IS For You If:</h4>
                  <ul className="space-y-3">
                    {((data.forYou as string[]) || ['You want results fast', 'You are ready to take action']).map((item, i) => (
                      <li key={i} className={`flex items-start gap-3 ${styles.text}`}>
                        <span className="text-green-500 text-lg">&#10003;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`${styles.card} p-6 rounded-xl`}>
                  <h4 className={`text-xl font-bold mb-4 text-red-600`}>This is NOT For You If:</h4>
                  <ul className="space-y-3">
                    {((data.notForYou as string[]) || ['You are looking for get-rich-quick schemes', 'You are not willing to put in work']).map((item, i) => (
                      <li key={i} className={`flex items-start gap-3 ${styles.text}`}>
                        <span className="text-red-500 text-lg">&#10007;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'what_you_get':
        return (
          <div key={section.id} className="py-16 px-6">
            <div className="max-w-3xl mx-auto">
              <h3 className={`text-3xl font-bold mb-10 text-center ${styles.text}`}>
                {(data.headline as string) || 'Here\'s Everything You Get:'}
              </h3>
              <div className="space-y-4">
                {((data.items as Array<{name: string; description: string; value: string}>) || []).map((item, i) => (
                  <div key={i} className={`${styles.card} p-5 rounded-xl flex items-center gap-4`}>
                    <span className={`w-8 h-8 ${styles.badgeStyle} rounded-full flex items-center justify-center font-bold`}>
                      &#10003;
                    </span>
                    <div className="flex-1">
                      <h4 className={`font-bold ${styles.text}`}>{item.name}</h4>
                      {item.description && <p className={`text-sm ${styles.text} opacity-70`}>{item.description}</p>}
                    </div>
                    <span className={`font-bold ${styles.accent}`}>{item.value}</span>
                  </div>
                ))}
              </div>
              {(data.totalValue as string) && (
                <div className={`mt-8 p-6 rounded-xl ${styles.card} text-center`}>
                  <p className={`${styles.text}`}>Total Value: <span className="line-through opacity-50">{data.totalValue as string}</span></p>
                  <p className={`text-3xl font-bold ${styles.accent} mt-2`}>Today Only: {(data.todayPrice as string) || '$47'}</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'ps_section':
        return (
          <div key={section.id} className="py-12 px-6">
            <div className="max-w-2xl mx-auto">
              {((data.items as Array<{prefix: string; content: string}>) || [{prefix: 'P.S.', content: 'Your P.S. message here...'}]).map((item, i) => (
                <p key={i} className={`mb-4 ${styles.text} leading-relaxed`}>
                  <strong className={styles.accent}>{item.prefix}</strong> {stripHtml(item.content)}
                </p>
              ))}
            </div>
          </div>
        );

      case 'image_section':
        return (
          <div key={section.id} className="py-12 px-6">
            <div className="max-w-4xl mx-auto">
              <div className="rounded-xl overflow-hidden shadow-xl bg-gray-200 min-h-[300px] flex items-center justify-center">
                {(data.imageUrl as string) ? (
                  <img src={data.imageUrl as string} alt={(data.alt as string) || 'Image'} className="w-full h-auto" />
                ) : (
                  <span className={`${styles.text} opacity-50`}>Image Placeholder</span>
                )}
              </div>
              {(data.caption as string) && (
                <p className={`text-center mt-4 ${styles.text} opacity-80`}>{data.caption as string}</p>
              )}
            </div>
          </div>
        );

      case 'before_after':
        return (
          <div key={section.id} className="py-16 px-6">
            <div className="max-w-4xl mx-auto">
              <h3 className={`text-3xl font-bold mb-10 text-center ${styles.text}`}>
                {(data.headline as string) || 'The Transformation'}
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className={`${styles.card} p-6 rounded-xl text-center border-2 border-red-300`}>
                  <Badge className="bg-red-500 text-white mb-4">BEFORE</Badge>
                  <p className={`${styles.text}`}>{(data.before as string) || 'Before description...'}</p>
                </div>
                <div className={`${styles.card} p-6 rounded-xl text-center border-2 border-green-300`}>
                  <Badge className="bg-green-500 text-white mb-4">AFTER</Badge>
                  <p className={`${styles.text}`}>{(data.after as string) || 'After description...'}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'step_by_step':
        return (
          <div key={section.id} className="py-16 px-6">
            <div className="max-w-3xl mx-auto">
              <h3 className={`text-3xl font-bold mb-10 text-center ${styles.text}`}>
                {(data.headline as string) || 'How It Works'}
              </h3>
              <div className="space-y-6">
                {((data.steps as Array<{title: string; description: string}>) || []).map((step, i) => (
                  <div key={i} className="flex items-start gap-6">
                    <div className={`w-12 h-12 flex-shrink-0 rounded-full ${styles.badgeStyle} flex items-center justify-center text-xl font-bold`}>
                      {i + 1}
                    </div>
                    <div>
                      <h4 className={`text-xl font-bold mb-1 ${styles.text}`}>{step.title}</h4>
                      <p className={`${styles.text} opacity-80`}>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'module_breakdown':
        return (
          <div key={section.id} className="py-16 px-6">
            <div className="max-w-3xl mx-auto">
              <h3 className={`text-3xl font-bold mb-10 text-center ${styles.text}`}>
                {(data.headline as string) || 'What\'s Inside'}
              </h3>
              <div className="space-y-4">
                {((data.modules as Array<{name: string; description: string; lessons?: number}>) || []).map((mod, i) => (
                  <div key={i} className={`${styles.card} p-6 rounded-xl`}>
                    <div className="flex items-center gap-4 mb-2">
                      <Badge className={styles.badgeStyle}>Module {i + 1}</Badge>
                      <h4 className={`text-lg font-bold ${styles.text}`}>{mod.name}</h4>
                    </div>
                    <p className={`${styles.text} opacity-80`}>{mod.description}</p>
                    {mod.lessons && (
                      <p className={`text-sm mt-2 ${styles.accent}`}>{mod.lessons} lessons</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'credibility_bar':
        return (
          <div key={section.id} className="py-6 px-6 bg-black/5">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-8 flex-wrap">
                {((data.items as string[]) || ['Secure Checkout', '256-bit SSL', 'Money Back Guarantee', '24/7 Support']).map((item, i) => (
                  <div key={i} className={`flex items-center gap-2 ${styles.text} opacity-70`}>
                    <span className={styles.accent}>&#10003;</span>
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'headline_only': {
        const headlineTextEffects = buildTextEffectStyles((data.textEffects as TextEffectsValues) || {});
        return (
          <div key={section.id} className="py-12 px-6">
            <h2 
              className={`text-3xl md:text-4xl lg:text-5xl font-bold text-center max-w-4xl mx-auto ${styles.text}`}
              style={headlineTextEffects}
            >
              {stripHtml(data.headline as string) || 'Your Big Headline Here'}
            </h2>
          </div>
        );
      }

      case 'comparison_table':
        return (
          <div key={section.id} className="py-16 px-6">
            <div className="max-w-4xl mx-auto">
              <h3 className={`text-3xl font-bold mb-10 text-center ${styles.text}`}>
                {(data.headline as string) || 'Why Choose Us?'}
              </h3>
              <div className={`${styles.card} rounded-xl overflow-hidden`}>
                <table className="w-full">
                  <thead>
                    <tr className="bg-black/10">
                      <th className={`p-4 text-left ${styles.text}`}>Feature</th>
                      <th className={`p-4 text-center ${styles.text}`}>{(data.usLabel as string) || 'Us'}</th>
                      <th className={`p-4 text-center ${styles.text} opacity-60`}>{(data.themLabel as string) || 'Others'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {((data.rows as Array<{feature: string; us: boolean; them: boolean}>) || []).map((row, i) => (
                      <tr key={i} className="border-t border-black/10">
                        <td className={`p-4 ${styles.text}`}>{row.feature}</td>
                        <td className="p-4 text-center text-green-500 text-xl">{row.us ? '\u2713' : '\u2717'}</td>
                        <td className="p-4 text-center text-red-500 text-xl">{row.them ? '\u2713' : '\u2717'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'order_bump':
        return (
          <div key={section.id} className="py-12 px-6">
            <div className="max-w-2xl mx-auto p-6 rounded-xl border-4 border-dashed border-yellow-500 bg-yellow-50/50">
              <div className="flex items-start gap-4">
                <input type="checkbox" className="w-6 h-6 mt-1" defaultChecked />
                <div>
                  <h4 className={`text-lg font-bold ${styles.text}`}>
                    {(data.headline as string) || 'YES! Add This To My Order!'}
                  </h4>
                  <p className={`${styles.text} opacity-80 mb-2`}>
                    {(data.description as string) || 'One-time offer description here...'}
                  </p>
                  <p className={`font-bold ${styles.accent}`}>
                    Add for just {(data.price as string) || '$27'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'testimonial_grid':
        return (
          <div key={section.id} className={`py-16 px-6 ${styles.testimonialBg}`}>
            <div className="max-w-5xl mx-auto">
              <h3 className={`text-3xl font-bold mb-10 text-center ${styles.text}`}>
                {(data.headline as string) || 'What Our Customers Say'}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {((data.testimonials as Array<{quote: string; name: string; role?: string}>) || []).map((t, i) => (
                  <div key={i} className={`${styles.card} p-6 rounded-xl`}>
                    <div className="flex mb-3">
                      {[1,2,3,4,5].map(s => <span key={s} className="text-yellow-400">&#9733;</span>)}
                    </div>
                    <p className={`${styles.text} italic mb-4`}>"{t.quote}"</p>
                    <p className={`font-bold ${styles.text}`}>{t.name}</p>
                    {t.role && <p className={`text-sm ${styles.text} opacity-60`}>{t.role}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'video_testimonials':
        return (
          <div key={section.id} className="py-16 px-6">
            <div className="max-w-5xl mx-auto">
              <h3 className={`text-3xl font-bold mb-10 text-center ${styles.text}`}>
                {(data.headline as string) || 'Video Success Stories'}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {((data.videos as Array<{embedUrl: string; name: string}>) || []).map((v, i) => (
                  <div key={i} className={`${styles.card} rounded-xl overflow-hidden`}>
                    <div className="aspect-video bg-gray-900">
                      {v.embedUrl ? (
                        <iframe src={v.embedUrl} className="w-full h-full" allowFullScreen />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">Video Placeholder</div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className={`font-bold ${styles.text}`}>{v.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'income_proof':
        return (
          <div key={section.id} className="py-16 px-6">
            <div className="max-w-4xl mx-auto">
              <h3 className={`text-3xl font-bold mb-4 text-center ${styles.text}`}>
                {(data.headline as string) || 'Real Results From Real People'}
              </h3>
              <p className={`text-center mb-10 ${styles.text} opacity-70`}>
                {(data.disclaimer as string) || 'Results may vary. These are actual results from dedicated users.'}
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {((data.proofs as Array<{amount: string; timeframe: string; name: string}>) || []).map((p, i) => (
                  <div key={i} className={`${styles.card} p-6 rounded-xl text-center`}>
                    <p className={`text-4xl font-bold ${styles.accent} mb-2`}>{p.amount}</p>
                    <p className={`${styles.text} opacity-70 mb-4`}>{p.timeframe}</p>
                    <p className={`font-medium ${styles.text}`}>{p.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div key={section.id} className="py-8 px-6 text-center">
            <p className={`${styles.text} opacity-50`}>
              [{section.type} section preview]
            </p>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between gap-2 p-4 border-b flex-wrap">
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'desktop' | 'mobile')}>
            <TabsList>
              <TabsTrigger value="desktop" data-testid="button-view-desktop">
                <Monitor className="w-4 h-4 mr-1" />
                Desktop
              </TabsTrigger>
              <TabsTrigger value="mobile" data-testid="button-view-mobile">
                <Smartphone className="w-4 h-4 mr-1" />
                Mobile
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {isEditMode && onFreeformElementsChange && (
            <div className="flex items-center gap-1 ml-2 pl-2 border-l">
              <Button
                variant={freeformEditMode ? "default" : "outline"}
                size="sm"
                onClick={() => setFreeformEditMode(!freeformEditMode)}
                data-testid="button-toggle-freeform"
              >
                <MousePointer2 className="w-4 h-4 mr-1" />
                {freeformEditMode ? 'Exit Edit' : 'Edit Elements'}
              </Button>
              {freeformEditMode && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddFreeformElement('text')}
                    data-testid="button-add-text"
                  >
                    <Type className="w-4 h-4 mr-1" />
                    Text
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddFreeformElement('image')}
                    data-testid="button-add-image"
                  >
                    <Image className="w-4 h-4 mr-1" />
                    Image
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={onPreview} data-testid="button-preview">
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopyHtml} data-testid="button-copy-html">
            <Copy className="w-4 h-4 mr-1" />
            Copy HTML
          </Button>
          {canDownloadHtml && (
            <Button variant="outline" size="sm" onClick={handleDownloadHtml} data-testid="button-download-html">
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          )}
          {canExportJson && (
            <Button variant="outline" size="sm" onClick={handleExportJson} data-testid="button-export-json">
              <FileJson className="w-4 h-4 mr-1" />
              JSON
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className={`${viewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
          <div 
            ref={previewContainerRef}
            className={`min-h-full ${styles.bg} relative`}
            onClick={() => {
              if (freeformEditMode) {
                setSelectedFreeformId(null);
              }
            }}
          >
            {sections.length === 0 && freeformElements.length === 0 ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <p className={`${styles.text} opacity-50`}>Add sections to see preview</p>
              </div>
            ) : (
              <>
                {sections.map(renderSection)}
                {hasWatermark && (
                  <div className="py-4 text-center bg-black/80">
                    <p className="text-xs text-gray-400">
                      Built with Sales Page Forge (Free Account)
                    </p>
                  </div>
                )}
              </>
            )}
            
            {freeformElements.length > 0 && (
              <FreeformElementsLayer
                elements={freeformElements}
                containerRef={previewContainerRef}
                selectedId={selectedFreeformId}
                onSelect={setSelectedFreeformId}
                onUpdate={handleUpdateFreeformElement}
                onDelete={handleDeleteFreeformElement}
                isEditMode={freeformEditMode}
              />
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
