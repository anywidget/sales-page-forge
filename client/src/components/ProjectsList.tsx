import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProjectCard } from './ProjectCard';
import { Plus, FileText, Users, AlertCircle, Sparkles, ClipboardPaste, LayoutTemplate, ArrowLeft, Loader2, Pen, X } from 'lucide-react';
import type { Project, ProjectType, ThemeType, PageSection } from '@/lib/projectTypes';
import { THEME_LABELS, DEFAULT_SECTION_DATA } from '@/lib/projectTypes';
import { COPYWRITER_STYLES } from '@/lib/copywriterStyles';
import { useAuth } from '@/contexts/AuthContext';
import { getPlanLimits } from '@/lib/planLimits';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

type CreationMethod = 'blank' | 'paste' | 'ai';
type CreationStep = 'choose-method' | 'configure';

interface ProjectsListProps {
  projects: Project[];
  onCreateProject: (name: string, type: ProjectType, theme: ThemeType, sections?: PageSection[]) => void;
  onEditProject: (id: string) => void;
  onDuplicateProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
}

export function ProjectsList({
  projects,
  onCreateProject,
  onEditProject,
  onDuplicateProject,
  onDeleteProject,
}: ProjectsListProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<CreationStep>('choose-method');
  const [creationMethod, setCreationMethod] = useState<CreationMethod>('blank');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectType, setNewProjectType] = useState<ProjectType>('sales_letter');
  const [newProjectTheme, setNewProjectTheme] = useState<ThemeType>('classic_red');
  const [pastedCopy, setPastedCopy] = useState('');
  const [aiProductName, setAiProductName] = useState('');
  const [aiProductDescription, setAiProductDescription] = useState('');
  const [aiProvider, setAiProvider] = useState('openai');
  const [aiCopywriterStyle, setAiCopywriterStyle] = useState<string>('none');
  const [aiCopyLength, setAiCopyLength] = useState<string>('standard');
  const [isGenerating, setIsGenerating] = useState(false);

  const planLimits = user ? getPlanLimits(user.plan) : getPlanLimits('free');
  const canCreateMore = projects.length < planLimits.maxProjects;
  const availableThemes = planLimits.themes;
  const canUseAI = user?.plan !== 'free';

  const resetForm = () => {
    setStep('choose-method');
    setCreationMethod('blank');
    setNewProjectName('');
    setNewProjectType('sales_letter');
    setNewProjectTheme('classic_red');
    setPastedCopy('');
    setAiProductName('');
    setAiProductDescription('');
    setAiCopywriterStyle('none');
    setAiCopyLength('standard');
    setIsGenerating(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) resetForm();
  };

  const selectMethod = (method: CreationMethod) => {
    setCreationMethod(method);
    setStep('configure');
  };

  const parsePastedCopy = (text: string): PageSection[] => {
    const sections: PageSection[] = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      sections.push({
        id: `section-${Date.now()}`,
        type: 'hero',
        position: 0,
        data: DEFAULT_SECTION_DATA.hero,
      });
      return sections;
    }

    const firstLine = lines[0].trim();
    sections.push({
      id: `section-${Date.now()}-hero`,
      type: 'hero',
      position: 0,
      data: {
        headline: firstLine,
        subheadline: lines[1]?.trim() || '',
        buttonText: 'Get Started Now',
        buttonUrl: '#',
        backgroundStyle: 'gradient',
      },
    });

    const bullets: string[] = [];
    let currentParagraph = '';
    let testimonialQuote = '';
    let sectionCount = 1;

    for (let i = 2; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line)) {
        if (currentParagraph) {
          sections.push({
            id: `section-${Date.now()}-sub-${sectionCount++}`,
            type: 'subheadline',
            position: sections.length,
            data: { text: currentParagraph },
          });
          currentParagraph = '';
        }
        bullets.push(line.replace(/^[•\-*]\s*|\d+\.\s*/, '').trim());
      } else if (line.startsWith('"') || line.startsWith("'")) {
        if (bullets.length > 0) {
          sections.push({
            id: `section-${Date.now()}-bullets-${sectionCount++}`,
            type: 'bullets',
            position: sections.length,
            data: { title: 'What You Get:', items: [...bullets] },
          });
          bullets.length = 0;
        }
        testimonialQuote = line.replace(/^["']+|["']+$/g, '');
      } else if (testimonialQuote && line.includes('-')) {
        const name = line.replace('-', '').trim();
        sections.push({
          id: `section-${Date.now()}-testimonial-${sectionCount++}`,
          type: 'testimonial',
          position: sections.length,
          data: { quote: testimonialQuote, name, role: '' },
        });
        testimonialQuote = '';
      } else if (line.length > 10) {
        if (bullets.length > 0) {
          sections.push({
            id: `section-${Date.now()}-bullets-${sectionCount++}`,
            type: 'bullets',
            position: sections.length,
            data: { title: 'What You Get:', items: [...bullets] },
          });
          bullets.length = 0;
        }
        currentParagraph += (currentParagraph ? ' ' : '') + line;
      }
    }

    if (bullets.length > 0) {
      sections.push({
        id: `section-${Date.now()}-bullets-final`,
        type: 'bullets',
        position: sections.length,
        data: { title: 'Key Benefits:', items: bullets },
      });
    }

    if (currentParagraph) {
      sections.push({
        id: `section-${Date.now()}-sub-final`,
        type: 'subheadline',
        position: sections.length,
        data: { text: currentParagraph },
      });
    }

    sections.push({
      id: `section-${Date.now()}-cta`,
      type: 'cta',
      position: sections.length,
      data: {
        headline: 'Ready to Get Started?',
        buttonText: 'Yes, I Want This!',
        buttonUrl: '#',
        scarcityText: 'Limited time offer',
      },
    });

    return sections;
  };

  const parseAiGeneratedCopy = (rawContent: string): PageSection[] => {
    const sections: PageSection[] = [];
    let sectionCount = 0;

    // Clean markdown fences that some providers add
    const cleanedContent = rawContent
      .replace(/```html\n?/gi, '')
      .replace(/```markdown\n?/gi, '')
      .replace(/```\n?/g, '')
      .trim();

    // Check if we have section markers
    const hasMarkers = /<SECTION:/i.test(cleanedContent);

    // Extract sections using the markers
    const extractSection = (name: string): string => {
      const regex = new RegExp(`<SECTION:${name}>([\\s\\S]*?)<\\/SECTION:${name}>`, 'i');
      const match = cleanedContent.match(regex);
      return match ? match[1].trim() : '';
    };

    // Extract bullets from content
    const extractBullets = (content: string): string[] => {
      const bullets: string[] = [];
      // Match various bullet formats
      const bulletPatterns = [
        /<li[^>]*>([\s\S]*?)<\/li>/gi,
        /^[\s]*[-*•✓✔]\s*(.+)$/gm,
        /^[\s]*\d+\.\s*(.+)$/gm,
      ];
      
      for (const pattern of bulletPatterns) {
        const matches = Array.from(content.matchAll(pattern));
        for (const match of matches) {
          const text = match[1].replace(/<[^>]+>/g, '').trim();
          if (text && text.length > 5 && !bullets.includes(text)) {
            bullets.push(text);
          }
        }
      }
      return bullets;
    };

    // Extract headline from content
    const extractHeadline = (content: string): string => {
      const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      if (h1Match) return h1Match[1].replace(/<[^>]+>/g, '').trim();
      const h2Match = content.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
      if (h2Match) return h2Match[1].replace(/<[^>]+>/g, '').trim();
      const strongMatch = content.match(/<strong[^>]*>([\s\S]*?)<\/strong>/i);
      if (strongMatch) return strongMatch[1].replace(/<[^>]+>/g, '').trim();
      // First line as fallback
      const lines = content.split('\n').filter(l => l.trim());
      return lines[0]?.replace(/<[^>]+>/g, '').trim() || '';
    };

    // Clean HTML but preserve line breaks
    const cleanContent = (content: string): string => {
      return content
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<[^>]+>/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    };

    // Hero section
    const heroContent = extractSection('hero');
    const heroLines = heroContent.split('\n').filter(l => l.trim());
    sections.push({
      id: `section-ai-${sectionCount++}`,
      type: 'hero',
      position: sections.length,
      data: {
        headline: extractHeadline(heroContent) || aiProductName,
        subheadline: heroLines.length > 1 ? cleanContent(heroLines.slice(1).join(' ')) : '',
        buttonText: 'Get Instant Access Now',
        buttonUrl: '#',
        backgroundStyle: 'gradient',
      },
    });

    // Story section
    const storyContent = extractSection('story');
    if (storyContent) {
      sections.push({
        id: `section-ai-${sectionCount++}`,
        type: 'subheadline',
        position: sections.length,
        data: { text: cleanContent(storyContent) },
      });
    }

    // Problem section
    const problemContent = extractSection('problem');
    if (problemContent) {
      sections.push({
        id: `section-ai-${sectionCount++}`,
        type: 'subheadline',
        position: sections.length,
        data: { text: cleanContent(problemContent) },
      });
    }

    // Solution section
    const solutionContent = extractSection('solution');
    if (solutionContent) {
      sections.push({
        id: `section-ai-${sectionCount++}`,
        type: 'subheadline',
        position: sections.length,
        data: { text: cleanContent(solutionContent) },
      });
    }

    // First bullets section
    const bullets1Content = extractSection('bullets1');
    if (bullets1Content) {
      const bullets = extractBullets(bullets1Content);
      if (bullets.length > 0) {
        sections.push({
          id: `section-ai-${sectionCount++}`,
          type: 'bullets',
          position: sections.length,
          data: { title: 'Here\'s What You\'re Getting:', items: bullets },
        });
      }
    }

    // Features section
    const featuresContent = extractSection('features');
    if (featuresContent) {
      const featureBullets = extractBullets(featuresContent);
      if (featureBullets.length > 0) {
        sections.push({
          id: `section-ai-${sectionCount++}`,
          type: 'bullets',
          position: sections.length,
          data: { title: 'Powerful Features Include:', items: featureBullets },
        });
      } else {
        sections.push({
          id: `section-ai-${sectionCount++}`,
          type: 'subheadline',
          position: sections.length,
          data: { text: cleanContent(featuresContent) },
        });
      }
    }

    // Second bullets section
    const bullets2Content = extractSection('bullets2');
    if (bullets2Content) {
      const bullets = extractBullets(bullets2Content);
      if (bullets.length > 0) {
        sections.push({
          id: `section-ai-${sectionCount++}`,
          type: 'bullets',
          position: sections.length,
          data: { title: 'Plus, You\'ll Also Discover:', items: bullets },
        });
      }
    }

    // Testimonials
    const testimonialSections = ['testimonial1', 'testimonial2', 'testimonial3'];
    for (const testSection of testimonialSections) {
      const testContent = extractSection(testSection);
      if (testContent) {
        const cleanTest = cleanContent(testContent);
        const lines = cleanTest.split('\n').filter(l => l.trim());
        // Try to extract name from content
        const nameMatch = cleanTest.match(/[-–—]\s*([A-Z][a-z]+(?:\s+[A-Z]\.?)?(?:\s+[A-Z][a-z]+)?)/);
        sections.push({
          id: `section-ai-${sectionCount++}`,
          type: 'testimonial',
          position: sections.length,
          data: {
            quote: lines[0] || cleanTest,
            name: nameMatch ? nameMatch[1] : 'Satisfied Customer',
            role: '',
          },
        });
      }
    }

    // Bonus sections
    const bonusSections = ['bonus1', 'bonus2', 'bonus3'];
    const bonusItems: string[] = [];
    for (const bonusSection of bonusSections) {
      const bonusContent = extractSection(bonusSection);
      if (bonusContent) {
        const headline = extractHeadline(bonusContent);
        const description = cleanContent(bonusContent.replace(/<h[123][^>]*>[\s\S]*?<\/h[123]>/gi, ''));
        if (headline) {
          bonusItems.push(`${headline}: ${description.substring(0, 150)}...`);
        }
      }
    }
    if (bonusItems.length > 0) {
      sections.push({
        id: `section-ai-${sectionCount++}`,
        type: 'bullets',
        position: sections.length,
        data: { title: 'FREE Bonuses (Yours When You Order Today):', items: bonusItems },
      });
    }

    // Third bullets section
    const bullets3Content = extractSection('bullets3');
    if (bullets3Content) {
      const bullets = extractBullets(bullets3Content);
      if (bullets.length > 0) {
        sections.push({
          id: `section-ai-${sectionCount++}`,
          type: 'bullets',
          position: sections.length,
          data: { title: 'And That\'s Not All:', items: bullets },
        });
      }
    }

    // Guarantee section
    const guaranteeContent = extractSection('guarantee');
    sections.push({
      id: `section-ai-${sectionCount++}`,
      type: 'guarantee',
      position: sections.length,
      data: {
        title: '100% Money-Back Guarantee',
        description: guaranteeContent ? cleanContent(guaranteeContent) : 'Try it risk-free for 30 days. If you are not completely satisfied for any reason, we will refund every penny. No questions asked.',
        duration: '30 Days',
      },
    });

    // FAQ section
    const faqContent = extractSection('faq');
    if (faqContent) {
      const faqItems: { question: string; answer: string }[] = [];
      // Try to extract Q&A pairs
      const qaPairs = faqContent.match(/(?:Q:|Question:|\*\*Q:|\d+\.)\s*([\s\S]*?)(?:A:|Answer:|\*\*A:)\s*([\s\S]*?)(?=(?:Q:|Question:|\*\*Q:|\d+\.)|$)/gi);
      if (qaPairs) {
        for (const qa of qaPairs) {
          const parts = qa.split(/A:|Answer:|\*\*A:/i);
          if (parts.length >= 2) {
            const q = parts[0].replace(/^(?:Q:|Question:|\*\*Q:|\d+\.)\s*/i, '').replace(/<[^>]+>/g, '').trim();
            const a = parts[1].replace(/<[^>]+>/g, '').trim();
            if (q && a) {
              faqItems.push({ question: q, answer: a });
            }
          }
        }
      }
      if (faqItems.length > 0) {
        sections.push({
          id: `section-ai-${sectionCount++}`,
          type: 'faq',
          position: sections.length,
          data: { items: faqItems },
        });
      }
    }

    // Urgency section
    const urgencyContent = extractSection('urgency');
    if (urgencyContent) {
      sections.push({
        id: `section-ai-${sectionCount++}`,
        type: 'subheadline',
        position: sections.length,
        data: { text: cleanContent(urgencyContent) },
      });
    }

    // CTA section
    const ctaContent = extractSection('cta');
    sections.push({
      id: `section-ai-${sectionCount++}`,
      type: 'cta',
      position: sections.length,
      data: {
        headline: ctaContent ? extractHeadline(ctaContent) : 'Get Instant Access Now',
        buttonText: 'Yes! Give Me Instant Access',
        buttonUrl: '#',
        scarcityText: 'Special Launch Pricing - Limited Time Only!',
      },
    });

    // P.S. section
    const psContent = extractSection('ps');
    if (psContent) {
      sections.push({
        id: `section-ai-${sectionCount++}`,
        type: 'subheadline',
        position: sections.length,
        data: { text: cleanContent(psContent) },
      });
    }

    // Final CTA
    sections.push({
      id: `section-ai-${sectionCount++}`,
      type: 'cta',
      position: sections.length,
      data: {
        headline: 'Don\'t Wait - Start Today!',
        buttonText: 'Get Started Now',
        buttonUrl: '#',
        scarcityText: 'Act Now Before Price Increases',
      },
    });

    // Count meaningful sections (excluding just hero and final CTAs we always add)
    const meaningfulSections = sections.filter(s => 
      s.type === 'bullets' || s.type === 'testimonial' || s.type === 'faq' || 
      (s.type === 'subheadline' && (s.data as { text?: string }).text && (s.data as { text?: string }).text!.length > 100)
    ).length;

    // If we got too few meaningful sections, use fallback parsing
    if (meaningfulSections < 3) {
      const fallbackSections = parseFallbackContent(cleanedContent);
      // Only use fallback if it produces more content
      if (fallbackSections.length > sections.length) {
        return fallbackSections;
      }
    }

    return sections;
  };

  // Fallback parser when section markers are missing
  const parseFallbackContent = (content: string): PageSection[] => {
    const sections: PageSection[] = [];
    let sectionCount = 0;

    // Extract headline
    const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const h2Match = content.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    
    sections.push({
      id: `section-fallback-${sectionCount++}`,
      type: 'hero',
      position: sections.length,
      data: {
        headline: h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : aiProductName,
        subheadline: h2Match ? h2Match[1].replace(/<[^>]+>/g, '').trim() : '',
        buttonText: 'Get Instant Access Now',
        buttonUrl: '#',
        backgroundStyle: 'gradient',
      },
    });

    // Extract all bullet lists
    const listMatches = Array.from(content.matchAll(/<ul[^>]*>([\s\S]*?)<\/ul>/gi));
    for (const listMatch of listMatches) {
      const items = Array.from(listMatch[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi))
        .map(m => m[1].replace(/<[^>]+>/g, '').trim())
        .filter(Boolean);
      if (items.length > 0) {
        sections.push({
          id: `section-fallback-${sectionCount++}`,
          type: 'bullets',
          position: sections.length,
          data: { title: 'What You Get:', items: items.slice(0, 15) },
        });
      }
    }

    // Extract paragraphs as subheadlines
    const paragraphs = Array.from(content.matchAll(/<p[^>]*>([\s\S]{80,}?)<\/p>/gi));
    for (const p of paragraphs.slice(0, 6)) {
      const text = p[1].replace(/<[^>]+>/g, '').trim();
      if (text.length > 50) {
        sections.push({
          id: `section-fallback-${sectionCount++}`,
          type: 'subheadline',
          position: sections.length,
          data: { text },
        });
      }
    }

    // Add guarantee
    sections.push({
      id: `section-fallback-${sectionCount++}`,
      type: 'guarantee',
      position: sections.length,
      data: {
        title: '100% Money-Back Guarantee',
        description: 'Try it risk-free for 30 days. If you are not completely satisfied, we will refund every penny.',
        duration: '30 Days',
      },
    });

    // Add CTA
    sections.push({
      id: `section-fallback-${sectionCount++}`,
      type: 'cta',
      position: sections.length,
      data: {
        headline: 'Get Instant Access Now',
        buttonText: 'Yes! Give Me Access',
        buttonUrl: '#',
        scarcityText: 'Limited Time Offer',
      },
    });

    return sections;
  };

  const handleCreate = async () => {
    if (!newProjectName.trim()) return;

    if (creationMethod === 'blank') {
      const defaultSections: PageSection[] = [
        {
          id: `section-${Date.now()}-hero`,
          type: 'hero',
          position: 0,
          data: DEFAULT_SECTION_DATA.hero,
        },
      ];
      onCreateProject(newProjectName.trim(), newProjectType, newProjectTheme, defaultSections);
      handleOpenChange(false);
    } else if (creationMethod === 'paste') {
      const sections = parsePastedCopy(pastedCopy);
      onCreateProject(newProjectName.trim(), newProjectType, newProjectTheme, sections);
      handleOpenChange(false);
    } else if (creationMethod === 'ai') {
      if (!aiProductName.trim()) {
        toast({ title: 'Error', description: 'Please enter a product name', variant: 'destructive' });
        return;
      }
      
      setIsGenerating(true);
      try {
        const selectedStyle = aiCopywriterStyle !== 'none' ? COPYWRITER_STYLES.find(s => s.id.toString() === aiCopywriterStyle) : null;
        const stylePrompt = selectedStyle ? `${selectedStyle.ai_prompt}\n\n` : '';
        const fullPrompt = stylePrompt + aiProductDescription;
        
        const response = await apiRequest('POST', '/api/ai/generate-copy', {
          provider: aiProvider,
          productName: aiProductName,
          productType: newProjectType === 'sales_letter' ? 'Digital Product' : 'Affiliate Product',
          prompt: fullPrompt,
          copyLength: aiCopyLength,
        });

        const data = await response.json();
        if (data.error) {
          toast({ title: 'Error', description: data.error, variant: 'destructive' });
          return;
        }

        const sections = parseAiGeneratedCopy(data.copy);
        onCreateProject(newProjectName.trim() || aiProductName, newProjectType, newProjectTheme, sections);
        handleOpenChange(false);
      } catch (error) {
        toast({ 
          title: 'Generation Failed', 
          description: 'Could not generate copy. Make sure your API key is configured in Settings.', 
          variant: 'destructive' 
        });
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const renderMethodSelection = () => (
    <div className="space-y-4 py-4">
      <div className="grid gap-3">
        <Card 
          className="cursor-pointer hover-elevate border-2 border-transparent data-[selected=true]:border-primary"
          onClick={() => selectMethod('blank')}
          data-testid="card-method-blank"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10">
                <LayoutTemplate className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Start Blank</CardTitle>
                <CardDescription className="text-sm">Build your page from scratch with drag-and-drop sections</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card 
          className="cursor-pointer hover-elevate border-2 border-transparent data-[selected=true]:border-primary"
          onClick={() => selectMethod('paste')}
          data-testid="card-method-paste"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10">
                <ClipboardPaste className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Paste Existing Copy</CardTitle>
                <CardDescription className="text-sm">Convert your existing sales copy into editable sections</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card 
          className={`cursor-pointer hover-elevate border-2 border-transparent data-[selected=true]:border-primary ${!canUseAI ? 'opacity-50' : ''}`}
          onClick={() => canUseAI && selectMethod('ai')}
          data-testid="card-method-ai"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  AI Copy Generator
                  {!canUseAI && <span className="text-xs font-normal text-muted-foreground">(Upgrade Required)</span>}
                </CardTitle>
                <CardDescription className="text-sm">Let AI write compelling sales copy for your product</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );

  const renderConfigureStep = () => (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="project-name">Project Name</Label>
        <Input
          id="project-name"
          placeholder="My Awesome Product Launch"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          data-testid="input-project-name"
        />
      </div>

      <div className="space-y-2">
        <Label>Project Type</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={newProjectType === 'sales_letter' ? 'default' : 'outline'}
            className="justify-start"
            onClick={() => setNewProjectType('sales_letter')}
            data-testid="button-type-sales-letter"
          >
            <FileText className="w-4 h-4 mr-2" />
            Sales Letter
          </Button>
          <Button
            type="button"
            variant={newProjectType === 'jv_page' ? 'default' : 'outline'}
            className="justify-start"
            onClick={() => setNewProjectType('jv_page')}
            data-testid="button-type-jv-page"
          >
            <Users className="w-4 h-4 mr-2" />
            JV Page
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-theme">Theme</Label>
        <Select value={newProjectTheme} onValueChange={(v) => setNewProjectTheme(v as ThemeType)}>
          <SelectTrigger data-testid="select-theme">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(THEME_LABELS) as ThemeType[]).map((theme) => (
              <SelectItem 
                key={theme} 
                value={theme}
                disabled={!availableThemes.includes(theme)}
              >
                {THEME_LABELS[theme]}
                {!availableThemes.includes(theme) && ' (Upgrade)'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {creationMethod === 'paste' && (
        <div className="space-y-2">
          <Label htmlFor="paste-copy">Paste Your Sales Copy</Label>
          <Textarea
            id="paste-copy"
            placeholder="Paste your existing sales letter content here... Headlines, bullet points, testimonials, etc."
            value={pastedCopy}
            onChange={(e) => setPastedCopy(e.target.value)}
            className="min-h-[200px]"
            data-testid="textarea-paste-copy"
          />
          <p className="text-xs text-muted-foreground">
            The system will automatically detect headlines, bullet points, and other elements
          </p>
        </div>
      )}

      {creationMethod === 'ai' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="ai-provider">AI Provider</Label>
            <Select value={aiProvider} onValueChange={setAiProvider}>
              <SelectTrigger data-testid="select-ai-provider">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI (GPT-4)</SelectItem>
                <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                <SelectItem value="google">Google (Gemini)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ai-copy-length">Sales Letter Length</Label>
            <Select value={aiCopyLength} onValueChange={setAiCopyLength}>
              <SelectTrigger data-testid="select-copy-length">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Short (1-2 pages)</span>
                    <span className="text-xs text-muted-foreground">~1,500 words, 8-12 sections</span>
                  </div>
                </SelectItem>
                <SelectItem value="standard">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Standard (5-10 pages)</span>
                    <span className="text-xs text-muted-foreground">~4,000 words, 15-25 sections</span>
                  </div>
                </SelectItem>
                <SelectItem value="extended">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Extended (15-30 pages)</span>
                    <span className="text-xs text-muted-foreground">~8,000 words, 25-40 sections</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ai-copywriter-style" className="flex items-center gap-2">
              <Pen className="w-3.5 h-3.5" />
              Copywriter Style (Optional)
            </Label>
            <Select value={aiCopywriterStyle} onValueChange={setAiCopywriterStyle}>
              <SelectTrigger data-testid="select-copywriter-style">
                <SelectValue placeholder="No style - Use default AI writing" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-[280px]">
                  <SelectItem value="none">No style - Use default AI writing</SelectItem>
                  {COPYWRITER_STYLES.map((style) => (
                    <SelectItem key={style.id} value={style.id.toString()}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{style.name}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[280px]">{style.known_for}</span>
                      </div>
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
            {aiCopywriterStyle && aiCopywriterStyle !== 'none' && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted p-2 rounded-md">
                <span className="flex-1">
                  AI will write in the style of <strong>{COPYWRITER_STYLES.find(s => s.id.toString() === aiCopywriterStyle)?.name}</strong>
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => setAiCopywriterStyle('none')}
                  data-testid="button-clear-style"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ai-product-name">Product Name</Label>
            <Input
              id="ai-product-name"
              placeholder="e.g., Ultimate Marketing System"
              value={aiProductName}
              onChange={(e) => setAiProductName(e.target.value)}
              data-testid="input-ai-product-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ai-description">Product Description</Label>
            <Textarea
              id="ai-description"
              placeholder="Describe your product, its benefits, target audience, and any key selling points..."
              value={aiProductDescription}
              onChange={(e) => setAiProductDescription(e.target.value)}
              className="min-h-[120px]"
              data-testid="textarea-ai-description"
            />
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-projects-title">My Projects</h1>
          <p className="text-muted-foreground">
            {projects.length} / {planLimits.maxProjects === 100 ? 'Unlimited' : planLimits.maxProjects} projects
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button disabled={!canCreateMore} data-testid="button-new-project">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <div className="flex items-center gap-2">
                {step === 'configure' && (
                  <Button variant="ghost" size="icon" onClick={() => setStep('choose-method')} data-testid="button-back-to-methods">
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                )}
                <div>
                  <DialogTitle>
                    {step === 'choose-method' ? 'Create New Project' : `New Project - ${creationMethod === 'blank' ? 'Start Blank' : creationMethod === 'paste' ? 'Paste Copy' : 'AI Generate'}`}
                  </DialogTitle>
                  <DialogDescription>
                    {step === 'choose-method' 
                      ? 'Choose how you want to start building your page'
                      : 'Configure your new project'}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            {step === 'choose-method' ? renderMethodSelection() : renderConfigureStep()}

            {step === 'configure' && (
              <DialogFooter>
                <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
                <Button 
                  onClick={handleCreate} 
                  disabled={!newProjectName.trim() || isGenerating || (creationMethod === 'ai' && !aiProductName.trim())} 
                  data-testid="button-create-project"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      {creationMethod === 'ai' && <Sparkles className="w-4 h-4 mr-2" />}
                      Create Project
                    </>
                  )}
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {!canCreateMore && (
        <div className="bg-muted p-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Project limit reached</p>
            <p className="text-sm text-muted-foreground">
              Upgrade your plan to create more projects
            </p>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-card-border">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-4">Create your first sales page to get started</p>
          <Button onClick={() => setIsOpen(true)} data-testid="button-create-first-project">
            <Plus className="w-4 h-4 mr-2" />
            Create Project
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              canDuplicate={planLimits.canDuplicate}
              onEdit={onEditProject}
              onDuplicate={onDuplicateProject}
              onDelete={onDeleteProject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
