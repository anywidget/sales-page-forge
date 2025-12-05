import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Users, Eye, Copy } from 'lucide-react';
import type { Project, ThemeType } from '@/lib/projectTypes';
import { DEFAULT_SECTION_DATA } from '@/lib/projectTypes';
import heroBackground from '@assets/generated_images/mmo_dark_theme_hero.png';
import neonBackground from '@assets/generated_images/dark_neon_dashboard_background.png';

interface TemplatesPageProps {
  onUseTemplate: (template: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  onPreviewTemplate: (template: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
}

// todo: remove mock functionality
const TEMPLATES: Array<{
  name: string;
  description: string;
  type: 'sales_letter' | 'jv_page';
  theme: ThemeType;
  preview: string;
  sections: Array<{ type: string; data: Record<string, unknown> }>;
}> = [
  {
    name: 'Classic MMO Sales Letter',
    description: 'A proven high-converting sales letter template with dark theme and neon accents',
    type: 'sales_letter',
    theme: 'mmo_dark',
    preview: heroBackground,
    sections: [
      { type: 'hero', data: DEFAULT_SECTION_DATA.hero },
      { type: 'subheadline', data: { text: 'Discover the secret system that generated over $1M in online sales...' } },
      { type: 'bullets', data: DEFAULT_SECTION_DATA.bullets },
      { type: 'video', data: DEFAULT_SECTION_DATA.video },
      { type: 'testimonial', data: DEFAULT_SECTION_DATA.testimonial },
      { type: 'guarantee', data: DEFAULT_SECTION_DATA.guarantee },
      { type: 'cta', data: DEFAULT_SECTION_DATA.cta },
    ],
  },
  {
    name: 'Product Launch JV Page',
    description: 'Professional JV/affiliate recruitment page with commission details and prize structure',
    type: 'jv_page',
    theme: 'neon_gamer',
    preview: neonBackground,
    sections: [
      { type: 'hero', data: { ...DEFAULT_SECTION_DATA.hero, headline: 'Partner With Us On Our Biggest Launch Yet!', subheadline: 'Earn 50% commissions on a proven $100K+ funnel' } },
      { type: 'jv_commissions', data: DEFAULT_SECTION_DATA.jv_commissions },
      { type: 'jv_prizes', data: DEFAULT_SECTION_DATA.jv_prizes },
      { type: 'jv_calendar', data: DEFAULT_SECTION_DATA.jv_calendar },
      { type: 'testimonial', data: { ...DEFAULT_SECTION_DATA.testimonial, quote: 'Made $5,000 in commissions in just 3 days! This is the easiest product to promote.' } },
      { type: 'cta', data: { headline: 'Ready to Promote?', buttonText: 'Get Your Affiliate Link', buttonUrl: '#', scarcityText: 'Contest ends in 7 days!' } },
    ],
  },
  {
    name: 'Clean Product Page',
    description: 'A professional, clean template perfect for business and coaching offers',
    type: 'sales_letter',
    theme: 'clean_marketer',
    preview: neonBackground,
    sections: [
      { type: 'hero', data: { headline: 'Grow Your Business With Proven Systems', subheadline: 'Join thousands of entrepreneurs who have transformed their results', buttonText: 'Start Your Journey', backgroundStyle: 'gradient' } },
      { type: 'feature_grid', data: DEFAULT_SECTION_DATA.feature_grid },
      { type: 'bullets', data: DEFAULT_SECTION_DATA.bullets },
      { type: 'testimonial', data: DEFAULT_SECTION_DATA.testimonial },
      { type: 'guarantee', data: DEFAULT_SECTION_DATA.guarantee },
      { type: 'faq', data: DEFAULT_SECTION_DATA.faq },
      { type: 'cta', data: DEFAULT_SECTION_DATA.cta },
    ],
  },
];

export function TemplatesPage({ onUseTemplate, onPreviewTemplate }: TemplatesPageProps) {
  const handleUseTemplate = (template: typeof TEMPLATES[0]) => {
    onUseTemplate({
      name: `New ${template.name}`,
      type: template.type,
      theme: template.theme,
      sections: template.sections.map((s, i) => ({
        id: `section-${Date.now()}-${i}`,
        type: s.type as any,
        position: i,
        data: s.data,
      })),
    });
  };

  const handlePreviewTemplate = (template: typeof TEMPLATES[0]) => {
    onPreviewTemplate({
      name: template.name,
      type: template.type,
      theme: template.theme,
      sections: template.sections.map((s, i) => ({
        id: `section-${Date.now()}-${i}`,
        type: s.type as any,
        position: i,
        data: s.data,
      })),
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-templates-title">Templates</h1>
        <p className="text-muted-foreground">Start with a pre-built template to save time</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((template, index) => (
          <Card key={index} className="overflow-hidden group">
            <div 
              className="h-40 bg-cover bg-center relative"
              style={{ backgroundImage: `url(${template.preview})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {template.type === 'jv_page' ? (
                    <><Users className="w-3 h-3 mr-1" /> JV Page</>
                  ) : (
                    <><FileText className="w-3 h-3 mr-1" /> Sales Letter</>
                  )}
                </Badge>
                <Badge variant="outline" className="border-white/30 text-white">
                  {template.theme.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription className="text-sm">{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-xs text-muted-foreground">
                {template.sections.length} pre-built sections
              </p>
            </CardContent>
            <CardFooter className="gap-2 flex-wrap">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handlePreviewTemplate(template)}
                data-testid={`button-preview-template-${index}`}
              >
                <Eye className="w-3 h-3 mr-1" />
                Preview
              </Button>
              <Button 
                size="sm"
                onClick={() => handleUseTemplate(template)}
                data-testid={`button-use-template-${index}`}
              >
                <Copy className="w-3 h-3 mr-1" />
                Use Template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
