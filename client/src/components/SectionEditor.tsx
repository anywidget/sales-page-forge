import { useState, useCallback } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RichTextEditor } from './RichTextEditor';
import { TextEffectsEditor, type TextEffectsValues } from './TextEffectsEditor';
import { 
  GripVertical, Trash2, Plus, Copy,
  Layout, Type, Video, List, Grid3X3, Gift, MessageSquare, Shield, HelpCircle, 
  MousePointer, Minus, DollarSign, Calendar, Trophy, Timer, User, BookOpen,
  Award, AlertTriangle, Target, Package, Image, ArrowRightLeft, Footprints,
  Layers, BadgeCheck, CheckCircle2, Table, ShoppingCart, Quote, Play, TrendingUp
} from 'lucide-react';
import type { PageSection, SectionType } from '@/lib/projectTypes';
import { SECTION_LABELS } from '@/lib/projectTypes';

const SECTION_ICONS: Record<SectionType, React.ReactNode> = {
  hero: <Layout className="w-4 h-4" />,
  subheadline: <Type className="w-4 h-4" />,
  video: <Video className="w-4 h-4" />,
  bullets: <List className="w-4 h-4" />,
  feature_grid: <Grid3X3 className="w-4 h-4" />,
  bonus_stack: <Gift className="w-4 h-4" />,
  testimonial: <MessageSquare className="w-4 h-4" />,
  guarantee: <Shield className="w-4 h-4" />,
  faq: <HelpCircle className="w-4 h-4" />,
  cta: <MousePointer className="w-4 h-4" />,
  divider: <Minus className="w-4 h-4" />,
  jv_commissions: <DollarSign className="w-4 h-4" />,
  jv_calendar: <Calendar className="w-4 h-4" />,
  jv_prizes: <Trophy className="w-4 h-4" />,
  pricing_table: <DollarSign className="w-4 h-4" />,
  countdown_timer: <Timer className="w-4 h-4" />,
  about_author: <User className="w-4 h-4" />,
  story_section: <BookOpen className="w-4 h-4" />,
  social_proof_bar: <Award className="w-4 h-4" />,
  warning_box: <AlertTriangle className="w-4 h-4" />,
  who_is_this_for: <Target className="w-4 h-4" />,
  what_you_get: <Package className="w-4 h-4" />,
  ps_section: <Type className="w-4 h-4" />,
  image_section: <Image className="w-4 h-4" />,
  before_after: <ArrowRightLeft className="w-4 h-4" />,
  step_by_step: <Footprints className="w-4 h-4" />,
  module_breakdown: <Layers className="w-4 h-4" />,
  credibility_bar: <BadgeCheck className="w-4 h-4" />,
  headline_only: <Type className="w-4 h-4" />,
  comparison_table: <Table className="w-4 h-4" />,
  order_bump: <ShoppingCart className="w-4 h-4" />,
  testimonial_grid: <Quote className="w-4 h-4" />,
  video_testimonials: <Play className="w-4 h-4" />,
  income_proof: <TrendingUp className="w-4 h-4" />,
};

interface SortableSectionItemProps {
  section: PageSection;
  index: number;
  onDuplicate: () => void;
  onDelete: () => void;
  renderFields: () => React.ReactNode;
}

function SortableSectionItem({ section, onDuplicate, onDelete, renderFields }: SortableSectionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <AccordionItem 
        value={section.id}
        className="border rounded-lg bg-card"
      >
        <AccordionTrigger className="px-3 py-2 hover:no-underline">
          <div className="flex items-center gap-2 flex-1">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing touch-none"
              data-testid={`drag-handle-${section.id}`}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-muted-foreground">{SECTION_ICONS[section.type]}</span>
            <span className="font-medium text-sm">{SECTION_LABELS[section.type]}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-3 pb-3">
          <div className="space-y-4">
            <div className="flex items-center gap-1 border-b pb-2 mb-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onDuplicate}
                data-testid={`button-duplicate-${section.id}`}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="text-destructive"
                data-testid={`button-delete-${section.id}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            {renderFields()}
          </div>
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}

interface SectionEditorProps {
  sections: PageSection[];
  availableSectionTypes: SectionType[];
  onSectionsChange: (sections: PageSection[]) => void;
  onAddSection: (type: SectionType) => void;
}

export function SectionEditor({ 
  sections, 
  availableSectionTypes,
  onSectionsChange, 
  onAddSection 
}: SectionEditorProps) {
  const [isAddingSection, setIsAddingSection] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      
      const newSections = arrayMove(sections, oldIndex, newIndex);
      newSections.forEach((s, i) => s.position = i);
      onSectionsChange(newSections);
    }
  };

  const duplicateSection = (index: number) => {
    const newSections = [...sections];
    const sectionToDuplicate = { ...sections[index], id: `section-${Date.now()}` };
    newSections.splice(index + 1, 0, sectionToDuplicate);
    newSections.forEach((s, i) => s.position = i);
    onSectionsChange(newSections);
  };

  const deleteSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    newSections.forEach((s, i) => s.position = i);
    onSectionsChange(newSections);
  };

  const updateSectionData = useCallback((index: number, data: Record<string, unknown>) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], data };
    onSectionsChange(newSections);
  }, [sections, onSectionsChange]);

  const createUpdateField = useCallback((index: number, data: Record<string, unknown>) => {
    return (field: string, value: unknown) => {
      updateSectionData(index, { ...data, [field]: value });
    };
  }, [updateSectionData]);

  const renderSectionFields = (section: PageSection, index: number) => {
    const data = section.data;
    const updateField = createUpdateField(index, data);

    switch (section.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="space-y-4">
                <div className="space-y-2">
                  <Label>Headline (with formatting)</Label>
                  <RichTextEditor
                    value={(data.headline as string) || ''}
                    onChange={(value) => updateField('headline', value)}
                    placeholder="Your compelling headline"
                    minimal
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subheadline (with formatting)</Label>
                  <RichTextEditor
                    value={(data.subheadline as string) || ''}
                    onChange={(value) => updateField('subheadline', value)}
                    placeholder="Supporting text that convinces visitors"
                  />
                </div>
              </TabsContent>
              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-2">
                  <Label>Button Text</Label>
                  <Input 
                    value={(data.buttonText as string) || ''} 
                    onChange={(e) => updateField('buttonText', e.target.value)}
                    placeholder="Get Started Now"
                    data-testid={`input-hero-button-${section.id}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Button URL</Label>
                  <Input 
                    value={(data.buttonUrl as string) || ''} 
                    onChange={(e) => updateField('buttonUrl', e.target.value)}
                    placeholder="https://..."
                    data-testid={`input-hero-url-${section.id}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Background Style</Label>
                  <Select 
                    value={(data.backgroundStyle as string) || 'gradient'} 
                    onValueChange={(v) => updateField('backgroundStyle', v)}
                  >
                    <SelectTrigger data-testid={`select-hero-bg-${section.id}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gradient">Gradient</SelectItem>
                      <SelectItem value="solid">Solid Color</SelectItem>
                      <SelectItem value="image">Background Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Limited Time Offer Badge Text</Label>
                  <Input 
                    value={(data.scarcityText as string) || ''} 
                    onChange={(e) => updateField('scarcityText', e.target.value)}
                    placeholder="Leave blank to hide the badge"
                    data-testid={`input-hero-scarcity-${section.id}`}
                  />
                  <p className="text-xs text-muted-foreground">Leave empty to hide the badge, or enter custom text</p>
                </div>
                
                <TextEffectsEditor
                  values={{
                    textShadow: (data.textEffects as TextEffectsValues)?.textShadow,
                    letterSpacing: (data.textEffects as TextEffectsValues)?.letterSpacing,
                    textTransform: (data.textEffects as TextEffectsValues)?.textTransform,
                    textDecoration: (data.textEffects as TextEffectsValues)?.textDecoration,
                    textOutline: (data.textEffects as TextEffectsValues)?.textOutline,
                  }}
                  onChange={(key, value) => {
                    const currentEffects = (data.textEffects as TextEffectsValues) || {};
                    updateField('textEffects', { ...currentEffects, [key]: value });
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>
        );

      case 'subheadline':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Text (with formatting)</Label>
              <RichTextEditor
                value={(data.text as string) || ''}
                onChange={(value) => updateField('text', value)}
                placeholder="Your subheadline text..."
              />
            </div>
            
            <TextEffectsEditor
              values={{
                textShadow: (data.textEffects as TextEffectsValues)?.textShadow,
                letterSpacing: (data.textEffects as TextEffectsValues)?.letterSpacing,
                textTransform: (data.textEffects as TextEffectsValues)?.textTransform,
                textDecoration: (data.textEffects as TextEffectsValues)?.textDecoration,
                textOutline: (data.textEffects as TextEffectsValues)?.textOutline,
              }}
              onChange={(key, value) => {
                const currentEffects = (data.textEffects as TextEffectsValues) || {};
                updateField('textEffects', { ...currentEffects, [key]: value });
              }}
            />
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Video URL (YouTube/Vimeo)</Label>
              <Input 
                value={(data.embedUrl as string) || ''} 
                onChange={(e) => updateField('embedUrl', e.target.value)}
                placeholder="https://youtube.com/embed/..."
                data-testid={`input-video-url-${section.id}`}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                checked={(data.autoplay as boolean) || false}
                onCheckedChange={(v) => updateField('autoplay', v)}
                data-testid={`switch-video-autoplay-${section.id}`}
              />
              <Label>Autoplay</Label>
            </div>
            <div className="space-y-2">
              <Label>Caption</Label>
              <Input 
                value={(data.caption as string) || ''} 
                onChange={(e) => updateField('caption', e.target.value)}
                placeholder="Watch this short video..."
                data-testid={`input-video-caption-${section.id}`}
              />
            </div>
          </div>
        );

      case 'bullets':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Section Title</Label>
              <Input 
                value={(data.title as string) || ''} 
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="What You Get:"
                data-testid={`input-bullets-title-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Bullet Items (one per line)</Label>
              <Textarea 
                value={((data.items as string[]) || []).join('\n')} 
                onChange={(e) => updateField('items', e.target.value.split('\n').filter(Boolean))}
                placeholder="First benefit&#10;Second benefit&#10;Third benefit"
                rows={6}
                data-testid={`input-bullets-items-${section.id}`}
              />
            </div>
            
            <TextEffectsEditor
              values={{
                textShadow: (data.textEffects as TextEffectsValues)?.textShadow,
                letterSpacing: (data.textEffects as TextEffectsValues)?.letterSpacing,
                textTransform: (data.textEffects as TextEffectsValues)?.textTransform,
                textDecoration: (data.textEffects as TextEffectsValues)?.textDecoration,
                textOutline: (data.textEffects as TextEffectsValues)?.textOutline,
              }}
              onChange={(key, value) => {
                const currentEffects = (data.textEffects as TextEffectsValues) || {};
                updateField('textEffects', { ...currentEffects, [key]: value });
              }}
            />
          </div>
        );

      case 'cta':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Headline</Label>
              <Input 
                value={(data.headline as string) || ''} 
                onChange={(e) => updateField('headline', e.target.value)}
                placeholder="Ready to Get Started?"
                data-testid={`input-cta-headline-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input 
                value={(data.buttonText as string) || ''} 
                onChange={(e) => updateField('buttonText', e.target.value)}
                placeholder="Yes! I Want This Now"
                data-testid={`input-cta-button-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Button URL</Label>
              <Input 
                value={(data.buttonUrl as string) || ''} 
                onChange={(e) => updateField('buttonUrl', e.target.value)}
                placeholder="https://..."
                data-testid={`input-cta-url-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Scarcity Text</Label>
              <Input 
                value={(data.scarcityText as string) || ''} 
                onChange={(e) => updateField('scarcityText', e.target.value)}
                placeholder="Only 7 spots left!"
                data-testid={`input-cta-scarcity-${section.id}`}
              />
            </div>
            
            <TextEffectsEditor
              values={{
                textShadow: (data.textEffects as TextEffectsValues)?.textShadow,
                letterSpacing: (data.textEffects as TextEffectsValues)?.letterSpacing,
                textTransform: (data.textEffects as TextEffectsValues)?.textTransform,
                textDecoration: (data.textEffects as TextEffectsValues)?.textDecoration,
                textOutline: (data.textEffects as TextEffectsValues)?.textOutline,
              }}
              onChange={(key, value) => {
                const currentEffects = (data.textEffects as TextEffectsValues) || {};
                updateField('textEffects', { ...currentEffects, [key]: value });
              }}
            />
          </div>
        );

      case 'testimonial':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Quote (with formatting)</Label>
              <RichTextEditor
                value={(data.quote as string) || ''}
                onChange={(value) => updateField('quote', value)}
                placeholder="This product changed my life..."
                minimal
              />
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input 
                value={(data.name as string) || ''} 
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="John Smith"
                data-testid={`input-testimonial-name-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Role/Title</Label>
              <Input 
                value={(data.role as string) || ''} 
                onChange={(e) => updateField('role', e.target.value)}
                placeholder="Online Entrepreneur"
                data-testid={`input-testimonial-role-${section.id}`}
              />
            </div>
          </div>
        );

      case 'guarantee':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Guarantee Title</Label>
              <Input 
                value={(data.title as string) || ''} 
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="100% Money-Back Guarantee"
                data-testid={`input-guarantee-title-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Description (with formatting)</Label>
              <RichTextEditor
                value={(data.description as string) || ''}
                onChange={(value) => updateField('description', value)}
                placeholder="Try it risk-free for 30 days..."
              />
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Input 
                value={(data.duration as string) || ''} 
                onChange={(e) => updateField('duration', e.target.value)}
                placeholder="30 Days"
                data-testid={`input-guarantee-duration-${section.id}`}
              />
            </div>
          </div>
        );

      case 'faq':
        const faqItems = (data.items as Array<{question: string; answer: string}>) || [];
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>FAQ Items</Label>
              {faqItems.map((item, i) => (
                <div key={i} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 justify-between">
                    <span className="text-sm font-medium">Question #{i + 1}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        const newItems = faqItems.filter((_, idx) => idx !== i);
                        updateField('items', newItems);
                      }}
                      className="text-destructive"
                      data-testid={`button-remove-faq-${i}-${section.id}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <Input 
                    value={item.question}
                    onChange={(e) => {
                      const newItems = [...faqItems];
                      newItems[i] = { ...newItems[i], question: e.target.value };
                      updateField('items', newItems);
                    }}
                    placeholder="Your question?"
                    data-testid={`input-faq-question-${i}-${section.id}`}
                  />
                  <Textarea 
                    value={item.answer}
                    onChange={(e) => {
                      const newItems = [...faqItems];
                      newItems[i] = { ...newItems[i], answer: e.target.value };
                      updateField('items', newItems);
                    }}
                    placeholder="The answer..."
                    rows={2}
                    data-testid={`input-faq-answer-${i}-${section.id}`}
                  />
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  const newItems = [...faqItems, { question: 'New Question?', answer: 'Answer here...' }];
                  updateField('items', newItems);
                }}
                data-testid={`button-add-faq-${section.id}`}
              >
                <Plus className="w-3 h-3 mr-1" /> Add Question
              </Button>
            </div>
          </div>
        );

      case 'feature_grid':
        const features = (data.features as Array<{icon: string; title: string; description: string}>) || [];
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Section Headline</Label>
              <Input 
                value={(data.headline as string) || ''} 
                onChange={(e) => updateField('headline', e.target.value)}
                placeholder="Everything You Need"
                data-testid={`input-feature-grid-headline-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Columns</Label>
              <Select 
                value={String((data.columns as number) || 3)} 
                onValueChange={(v) => updateField('columns', parseInt(v))}
              >
                <SelectTrigger data-testid={`select-feature-grid-cols-${section.id}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Columns</SelectItem>
                  <SelectItem value="3">3 Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Features</Label>
              {features.map((feature, i) => (
                <div key={i} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 justify-between">
                    <span className="text-sm font-medium">Feature #{i + 1}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        const newFeatures = features.filter((_, idx) => idx !== i);
                        updateField('features', newFeatures);
                      }}
                      className="text-destructive"
                      data-testid={`button-remove-feature-${i}-${section.id}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input 
                      value={feature.title}
                      onChange={(e) => {
                        const newFeatures = [...features];
                        newFeatures[i] = { ...newFeatures[i], title: e.target.value };
                        updateField('features', newFeatures);
                      }}
                      placeholder="Feature Title"
                      data-testid={`input-feature-title-${i}-${section.id}`}
                    />
                    <Select 
                      value={feature.icon || 'check'} 
                      onValueChange={(v) => {
                        const newFeatures = [...features];
                        newFeatures[i] = { ...newFeatures[i], icon: v };
                        updateField('features', newFeatures);
                      }}
                    >
                      <SelectTrigger data-testid={`select-feature-icon-${i}-${section.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="check">Check</SelectItem>
                        <SelectItem value="star">Star</SelectItem>
                        <SelectItem value="zap">Zap</SelectItem>
                        <SelectItem value="shield">Shield</SelectItem>
                        <SelectItem value="award">Award</SelectItem>
                        <SelectItem value="heart">Heart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Input 
                    value={feature.description}
                    onChange={(e) => {
                      const newFeatures = [...features];
                      newFeatures[i] = { ...newFeatures[i], description: e.target.value };
                      updateField('features', newFeatures);
                    }}
                    placeholder="Feature description..."
                    data-testid={`input-feature-desc-${i}-${section.id}`}
                  />
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  const newFeatures = [...features, { icon: 'check', title: 'New Feature', description: 'Description here...' }];
                  updateField('features', newFeatures);
                }}
                data-testid={`button-add-feature-${section.id}`}
              >
                <Plus className="w-3 h-3 mr-1" /> Add Feature
              </Button>
            </div>
          </div>
        );

      case 'bonus_stack':
        const bonuses = (data.bonuses as Array<{title: string; description: string; value: string}>) || [];
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Section Title</Label>
              <Input 
                value={(data.title as string) || ''} 
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="But Wait... There's More!"
                data-testid={`input-bonus-title-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Total Bonus Value</Label>
              <Input 
                value={(data.totalValue as string) || ''} 
                onChange={(e) => updateField('totalValue', e.target.value)}
                placeholder="$997"
                data-testid={`input-bonus-totalvalue-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Bonuses</Label>
              {bonuses.map((bonus, i) => (
                <div key={i} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 justify-between">
                    <span className="text-sm font-medium">Bonus #{i + 1}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        const newBonuses = bonuses.filter((_, idx) => idx !== i);
                        updateField('bonuses', newBonuses);
                      }}
                      className="text-destructive"
                      data-testid={`button-remove-bonus-${i}-${section.id}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <Input 
                    value={bonus.title}
                    onChange={(e) => {
                      const newBonuses = [...bonuses];
                      newBonuses[i] = { ...newBonuses[i], title: e.target.value };
                      updateField('bonuses', newBonuses);
                    }}
                    placeholder="Bonus Title"
                    data-testid={`input-bonus-item-title-${i}-${section.id}`}
                  />
                  <Input 
                    value={bonus.description}
                    onChange={(e) => {
                      const newBonuses = [...bonuses];
                      newBonuses[i] = { ...newBonuses[i], description: e.target.value };
                      updateField('bonuses', newBonuses);
                    }}
                    placeholder="Bonus Description"
                    data-testid={`input-bonus-item-desc-${i}-${section.id}`}
                  />
                  <Input 
                    value={bonus.value}
                    onChange={(e) => {
                      const newBonuses = [...bonuses];
                      newBonuses[i] = { ...newBonuses[i], value: e.target.value };
                      updateField('bonuses', newBonuses);
                    }}
                    placeholder="$297"
                    data-testid={`input-bonus-item-value-${i}-${section.id}`}
                  />
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  const newBonuses = [...bonuses, { title: 'New Bonus', description: 'Description here...', value: '$97' }];
                  updateField('bonuses', newBonuses);
                }}
                data-testid={`button-add-bonus-${section.id}`}
              >
                <Plus className="w-3 h-3 mr-1" /> Add Bonus
              </Button>
            </div>
          </div>
        );

      case 'divider':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Divider Style</Label>
              <Select 
                value={(data.style as string) || 'line'} 
                onValueChange={(v) => updateField('style', v)}
              >
                <SelectTrigger data-testid={`select-divider-style-${section.id}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Simple Line</SelectItem>
                  <SelectItem value="dots">Dots</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'jv_commissions':
        const tiers = (data.tiers as Array<{name: string; commission: string}>) || [];
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Headline</Label>
              <Input 
                value={(data.headline as string) || ''} 
                onChange={(e) => updateField('headline', e.target.value)}
                placeholder="Earn 50% Commissions"
                data-testid={`input-jv-commission-headline-${section.id}`}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>EPC</Label>
                <Input 
                  value={(data.epc as string) || ''} 
                  onChange={(e) => updateField('epc', e.target.value)}
                  placeholder="$2.50"
                  data-testid={`input-jv-commission-epc-${section.id}`}
                />
              </div>
              <div className="space-y-2">
                <Label>Cookie Duration</Label>
                <Input 
                  value={(data.cookieDuration as string) || ''} 
                  onChange={(e) => updateField('cookieDuration', e.target.value)}
                  placeholder="60 days"
                  data-testid={`input-jv-commission-cookie-${section.id}`}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Commission Tiers</Label>
              {tiers.map((tier, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input 
                    value={tier.name}
                    onChange={(e) => {
                      const newTiers = [...tiers];
                      newTiers[i] = { ...newTiers[i], name: e.target.value };
                      updateField('tiers', newTiers);
                    }}
                    placeholder="Tier Name"
                    className="flex-1"
                    data-testid={`input-jv-tier-name-${i}-${section.id}`}
                  />
                  <Input 
                    value={tier.commission}
                    onChange={(e) => {
                      const newTiers = [...tiers];
                      newTiers[i] = { ...newTiers[i], commission: e.target.value };
                      updateField('tiers', newTiers);
                    }}
                    placeholder="50%"
                    className="w-24"
                    data-testid={`input-jv-tier-commission-${i}-${section.id}`}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      const newTiers = tiers.filter((_, idx) => idx !== i);
                      updateField('tiers', newTiers);
                    }}
                    className="text-destructive"
                    data-testid={`button-remove-tier-${i}-${section.id}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  const newTiers = [...tiers, { name: 'New Tier', commission: '50%' }];
                  updateField('tiers', newTiers);
                }}
                data-testid={`button-add-tier-${section.id}`}
              >
                <Plus className="w-3 h-3 mr-1" /> Add Tier
              </Button>
            </div>
          </div>
        );

      case 'jv_calendar':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Launch Date</Label>
              <Input 
                value={(data.launchDate as string) || ''} 
                onChange={(e) => updateField('launchDate', e.target.value)}
                placeholder="January 15, 2025"
                data-testid={`input-jv-launch-date-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Cart Opens</Label>
              <Input 
                value={(data.cartOpen as string) || ''} 
                onChange={(e) => updateField('cartOpen', e.target.value)}
                placeholder="9:00 AM EST"
                data-testid={`input-jv-cart-open-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Cart Closes</Label>
              <Input 
                value={(data.cartClose as string) || ''} 
                onChange={(e) => updateField('cartClose', e.target.value)}
                placeholder="11:59 PM EST"
                data-testid={`input-jv-cart-close-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Webinar Time (optional)</Label>
              <Input 
                value={(data.webinarTime as string) || ''} 
                onChange={(e) => updateField('webinarTime', e.target.value)}
                placeholder="2:00 PM EST"
                data-testid={`input-jv-webinar-${section.id}`}
              />
            </div>
          </div>
        );

      case 'jv_prizes':
        const prizes = (data.prizes as Array<{position: string; amount: string}>) || [];
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Headline</Label>
              <Input 
                value={(data.headline as string) || ''} 
                onChange={(e) => updateField('headline', e.target.value)}
                placeholder="Win Amazing Prizes"
                data-testid={`input-jv-prizes-headline-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Prizes</Label>
              {prizes.map((prize, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input 
                    value={prize.position}
                    onChange={(e) => {
                      const newPrizes = [...prizes];
                      newPrizes[i] = { ...newPrizes[i], position: e.target.value };
                      updateField('prizes', newPrizes);
                    }}
                    placeholder="1st"
                    className="w-24"
                    data-testid={`input-prize-position-${i}-${section.id}`}
                  />
                  <Input 
                    value={prize.amount}
                    onChange={(e) => {
                      const newPrizes = [...prizes];
                      newPrizes[i] = { ...newPrizes[i], amount: e.target.value };
                      updateField('prizes', newPrizes);
                    }}
                    placeholder="$1,000 Cash"
                    className="flex-1"
                    data-testid={`input-prize-amount-${i}-${section.id}`}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      const newPrizes = prizes.filter((_, idx) => idx !== i);
                      updateField('prizes', newPrizes);
                    }}
                    className="text-destructive"
                    data-testid={`button-remove-prize-${i}-${section.id}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  const newPrizes = [...prizes, { position: `${prizes.length + 1}${prizes.length === 0 ? 'st' : prizes.length === 1 ? 'nd' : prizes.length === 2 ? 'rd' : 'th'}`, amount: '$100 Cash' }];
                  updateField('prizes', newPrizes);
                }}
                data-testid={`button-add-prize-${section.id}`}
              >
                <Plus className="w-3 h-3 mr-1" /> Add Prize
              </Button>
            </div>
          </div>
        );

      case 'pricing_table':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Headline</Label>
              <Input 
                value={(data.headline as string) || ''} 
                onChange={(e) => updateField('headline', e.target.value)}
                placeholder="Choose Your Package"
                data-testid={`input-pricing-headline-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Subheadline</Label>
              <Input 
                value={(data.subheadline as string) || ''} 
                onChange={(e) => updateField('subheadline', e.target.value)}
                placeholder="Select the plan that works best for you"
                data-testid={`input-pricing-subheadline-${section.id}`}
              />
            </div>
            <p className="text-sm text-muted-foreground">Edit packages in JSON format or use AI generation to create pricing tables.</p>
          </div>
        );

      case 'countdown_timer':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Headline</Label>
              <Input 
                value={(data.headline as string) || ''} 
                onChange={(e) => updateField('headline', e.target.value)}
                placeholder="This Special Offer Expires In:"
                data-testid={`input-countdown-headline-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Urgency Text</Label>
              <Input 
                value={(data.urgencyText as string) || ''} 
                onChange={(e) => updateField('urgencyText', e.target.value)}
                placeholder="Act now before this offer disappears!"
                data-testid={`input-countdown-urgency-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date (optional)</Label>
              <Input 
                type="datetime-local"
                value={(data.endDate as string) || ''} 
                onChange={(e) => updateField('endDate', e.target.value)}
                data-testid={`input-countdown-enddate-${section.id}`}
              />
            </div>
          </div>
        );

      case 'about_author':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input 
                value={(data.name as string) || ''} 
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Your Name"
                data-testid={`input-author-name-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Title/Role</Label>
              <Input 
                value={(data.title as string) || ''} 
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Expert & Entrepreneur"
                data-testid={`input-author-title-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea 
                value={(data.bio as string) || ''} 
                onChange={(e) => updateField('bio', e.target.value)}
                placeholder="Share your story and credentials..."
                rows={4}
                data-testid={`input-author-bio-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Image URL (optional)</Label>
              <Input 
                value={(data.imageUrl as string) || ''} 
                onChange={(e) => updateField('imageUrl', e.target.value)}
                placeholder="https://..."
                data-testid={`input-author-image-${section.id}`}
              />
            </div>
          </div>
        );

      case 'story_section':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Headline (optional)</Label>
              <Input 
                value={(data.headline as string) || ''} 
                onChange={(e) => updateField('headline', e.target.value)}
                placeholder="My Story"
                data-testid={`input-story-headline-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Story Content (with formatting)</Label>
              <RichTextEditor
                value={(data.content as string) || ''}
                onChange={(value) => updateField('content', value)}
                placeholder="Tell your story here..."
              />
            </div>
          </div>
        );

      case 'social_proof_bar':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Headline</Label>
              <Input 
                value={(data.headline as string) || ''} 
                onChange={(e) => updateField('headline', e.target.value)}
                placeholder="As Featured In:"
                data-testid={`input-social-proof-headline-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Logos/Brands (one per line)</Label>
              <Textarea 
                value={((data.logos as string[]) || []).join('\n')} 
                onChange={(e) => updateField('logos', e.target.value.split('\n').filter(Boolean))}
                placeholder="Forbes&#10;Inc&#10;Entrepreneur&#10;Business Insider"
                rows={4}
                data-testid={`input-social-proof-logos-${section.id}`}
              />
            </div>
          </div>
        );

      case 'warning_box':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Headline</Label>
              <Input 
                value={(data.headline as string) || ''} 
                onChange={(e) => updateField('headline', e.target.value)}
                placeholder="WARNING"
                data-testid={`input-warning-headline-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Warning Message</Label>
              <Textarea 
                value={(data.content as string) || ''} 
                onChange={(e) => updateField('content', e.target.value)}
                placeholder="Important warning message..."
                rows={3}
                data-testid={`input-warning-content-${section.id}`}
              />
            </div>
          </div>
        );

      case 'who_is_this_for':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Headline</Label>
              <Input 
                value={(data.headline as string) || ''} 
                onChange={(e) => updateField('headline', e.target.value)}
                placeholder="Who Is This For?"
                data-testid={`input-who-headline-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>This IS For You If... (one per line)</Label>
              <Textarea 
                value={((data.forYou as string[]) || []).join('\n')} 
                onChange={(e) => updateField('forYou', e.target.value.split('\n').filter(Boolean))}
                placeholder="You want to achieve results fast&#10;You are ready to take action&#10;You are committed to success"
                rows={4}
                data-testid={`input-who-foryou-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>This is NOT For You If... (one per line)</Label>
              <Textarea 
                value={((data.notForYou as string[]) || []).join('\n')} 
                onChange={(e) => updateField('notForYou', e.target.value.split('\n').filter(Boolean))}
                placeholder="You want overnight success&#10;You are not willing to put in work&#10;You are looking for magic bullets"
                rows={4}
                data-testid={`input-who-notforyou-${section.id}`}
              />
            </div>
          </div>
        );

      case 'what_you_get':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Headline</Label>
              <Input 
                value={(data.headline as string) || ''} 
                onChange={(e) => updateField('headline', e.target.value)}
                placeholder="Here's Everything You Get:"
                data-testid={`input-whatyouget-headline-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Total Value</Label>
              <Input 
                value={(data.totalValue as string) || ''} 
                onChange={(e) => updateField('totalValue', e.target.value)}
                placeholder="$997"
                data-testid={`input-whatyouget-total-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Today's Price</Label>
              <Input 
                value={(data.todayPrice as string) || ''} 
                onChange={(e) => updateField('todayPrice', e.target.value)}
                placeholder="$47"
                data-testid={`input-whatyouget-price-${section.id}`}
              />
            </div>
            <p className="text-sm text-muted-foreground">Items can be edited via AI generation.</p>
          </div>
        );

      case 'ps_section':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>P.S. Items (Format: P.S. Your message)</Label>
              <Textarea 
                value={((data.items as Array<{prefix: string; content: string}>) || [])
                  .map(item => `${item.prefix} ${item.content}`).join('\n')} 
                onChange={(e) => {
                  const lines = e.target.value.split('\n').filter(Boolean);
                  const items = lines.map(line => {
                    const match = line.match(/^(P\.S\.|P\.P\.S\.|P\.P\.P\.S\.)\s*(.*)/i);
                    if (match) {
                      return { prefix: match[1].toUpperCase(), content: match[2] };
                    }
                    return { prefix: 'P.S.', content: line };
                  });
                  updateField('items', items);
                }}
                placeholder="P.S. Remember, you have our 30-day guarantee&#10;P.P.S. This pricing won't last forever"
                rows={4}
                data-testid={`input-ps-items-${section.id}`}
              />
            </div>
          </div>
        );

      case 'image_section':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input 
                value={(data.imageUrl as string) || ''} 
                onChange={(e) => updateField('imageUrl', e.target.value)}
                placeholder="https://..."
                data-testid={`input-image-url-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Alt Text</Label>
              <Input 
                value={(data.alt as string) || ''} 
                onChange={(e) => updateField('alt', e.target.value)}
                placeholder="Description of the image"
                data-testid={`input-image-alt-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Caption (optional)</Label>
              <Input 
                value={(data.caption as string) || ''} 
                onChange={(e) => updateField('caption', e.target.value)}
                placeholder="Image caption..."
                data-testid={`input-image-caption-${section.id}`}
              />
            </div>
          </div>
        );

      case 'before_after':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Headline</Label>
              <Input 
                value={(data.headline as string) || ''} 
                onChange={(e) => updateField('headline', e.target.value)}
                placeholder="See The Transformation"
                data-testid={`input-beforeafter-headline-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Before (the problem state)</Label>
              <Textarea 
                value={(data.before as string) || ''} 
                onChange={(e) => updateField('before', e.target.value)}
                placeholder="Struggling, confused, overwhelmed..."
                rows={3}
                data-testid={`input-beforeafter-before-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>After (the desired outcome)</Label>
              <Textarea 
                value={(data.after as string) || ''} 
                onChange={(e) => updateField('after', e.target.value)}
                placeholder="Confident, successful, achieving goals..."
                rows={3}
                data-testid={`input-beforeafter-after-${section.id}`}
              />
            </div>
          </div>
        );

      case 'step_by_step':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Headline</Label>
              <Input 
                value={(data.headline as string) || ''} 
                onChange={(e) => updateField('headline', e.target.value)}
                placeholder="How It Works"
                data-testid={`input-steps-headline-${section.id}`}
              />
            </div>
            <p className="text-sm text-muted-foreground">Steps can be edited via AI generation or in the preview.</p>
          </div>
        );

      case 'module_breakdown':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Headline</Label>
              <Input 
                value={(data.headline as string) || ''} 
                onChange={(e) => updateField('headline', e.target.value)}
                placeholder="What's Inside The Training"
                data-testid={`input-modules-headline-${section.id}`}
              />
            </div>
            <p className="text-sm text-muted-foreground">Modules can be edited via AI generation.</p>
          </div>
        );

      case 'credibility_bar':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Credibility Items (one per line)</Label>
              <Textarea 
                value={((data.items as string[]) || []).join('\n')} 
                onChange={(e) => updateField('items', e.target.value.split('\n').filter(Boolean))}
                placeholder="Secure Checkout&#10;256-bit SSL Encryption&#10;Money Back Guarantee&#10;24/7 Support"
                rows={4}
                data-testid={`input-credibility-items-${section.id}`}
              />
            </div>
          </div>
        );

      case 'headline_only':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Headline (with formatting)</Label>
              <RichTextEditor
                value={(data.headline as string) || ''}
                onChange={(value) => updateField('headline', value)}
                placeholder="Your Big, Bold Headline"
                minimal
              />
            </div>
            
            <TextEffectsEditor
              values={{
                textShadow: (data.textEffects as TextEffectsValues)?.textShadow,
                letterSpacing: (data.textEffects as TextEffectsValues)?.letterSpacing,
                textTransform: (data.textEffects as TextEffectsValues)?.textTransform,
                textDecoration: (data.textEffects as TextEffectsValues)?.textDecoration,
                textOutline: (data.textEffects as TextEffectsValues)?.textOutline,
              }}
              onChange={(key, value) => {
                const currentEffects = (data.textEffects as TextEffectsValues) || {};
                updateField('textEffects', { ...currentEffects, [key]: value });
              }}
            />
          </div>
        );

      case 'comparison_table':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Headline</Label>
              <Input 
                value={(data.headline as string) || ''} 
                onChange={(e) => updateField('headline', e.target.value)}
                placeholder="Why We're Different"
                data-testid={`input-comparison-headline-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Our Label</Label>
              <Input 
                value={(data.usLabel as string) || ''} 
                onChange={(e) => updateField('usLabel', e.target.value)}
                placeholder="Our Solution"
                data-testid={`input-comparison-us-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Others Label</Label>
              <Input 
                value={(data.themLabel as string) || ''} 
                onChange={(e) => updateField('themLabel', e.target.value)}
                placeholder="Others"
                data-testid={`input-comparison-them-${section.id}`}
              />
            </div>
            <p className="text-sm text-muted-foreground">Comparison rows can be edited via AI generation.</p>
          </div>
        );

      case 'order_bump':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Headline</Label>
              <Input 
                value={(data.headline as string) || ''} 
                onChange={(e) => updateField('headline', e.target.value)}
                placeholder="YES! Add This To My Order!"
                data-testid={`input-orderbump-headline-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={(data.description as string) || ''} 
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Describe what they get with this add-on..."
                rows={3}
                data-testid={`input-orderbump-description-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Price</Label>
              <Input 
                value={(data.price as string) || ''} 
                onChange={(e) => updateField('price', e.target.value)}
                placeholder="$27"
                data-testid={`input-orderbump-price-${section.id}`}
              />
            </div>
          </div>
        );

      case 'testimonial_grid':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Headline</Label>
              <Input 
                value={(data.headline as string) || ''} 
                onChange={(e) => updateField('headline', e.target.value)}
                placeholder="What Our Customers Say"
                data-testid={`input-testimonialgrid-headline-${section.id}`}
              />
            </div>
            <p className="text-sm text-muted-foreground">Testimonials can be added via AI generation.</p>
          </div>
        );

      case 'video_testimonials':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Headline</Label>
              <Input 
                value={(data.headline as string) || ''} 
                onChange={(e) => updateField('headline', e.target.value)}
                placeholder="Video Success Stories"
                data-testid={`input-videotestimonials-headline-${section.id}`}
              />
            </div>
            <p className="text-sm text-muted-foreground">Video URLs can be added via AI generation.</p>
          </div>
        );

      case 'income_proof':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Headline</Label>
              <Input 
                value={(data.headline as string) || ''} 
                onChange={(e) => updateField('headline', e.target.value)}
                placeholder="Real Results From Real People"
                data-testid={`input-incomeproof-headline-${section.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Disclaimer</Label>
              <Input 
                value={(data.disclaimer as string) || ''} 
                onChange={(e) => updateField('disclaimer', e.target.value)}
                placeholder="Results may vary. These are actual results..."
                data-testid={`input-incomeproof-disclaimer-${section.id}`}
              />
            </div>
            <p className="text-sm text-muted-foreground">Income proof entries can be added via AI generation.</p>
          </div>
        );

      default:
        return (
          <p className="text-sm text-muted-foreground">
            Configure this section's content in the fields above.
          </p>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Sections</h2>
        <p className="text-sm text-muted-foreground">
          {sections.length} section{sections.length !== 1 ? 's' : ''} - Drag to reorder
        </p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {sections.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No sections yet</p>
              <Button onClick={() => setIsAddingSection(true)} data-testid="button-add-first-section">
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sections.map(s => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <Accordion type="single" collapsible className="space-y-2">
                  {sections.map((section, index) => (
                    <SortableSectionItem
                      key={section.id}
                      section={section}
                      index={index}
                      onDuplicate={() => duplicateSection(index)}
                      onDelete={() => deleteSection(index)}
                      renderFields={() => renderSectionFields(section, index)}
                    />
                  ))}
                </Accordion>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        {isAddingSection ? (
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Add Section</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 pb-3">
              {availableSectionTypes.map((type) => (
                <Button
                  key={type}
                  variant="outline"
                  size="sm"
                  className="justify-start text-xs"
                  onClick={() => {
                    onAddSection(type);
                    setIsAddingSection(false);
                  }}
                  data-testid={`button-add-section-${type}`}
                >
                  {SECTION_ICONS[type]}
                  <span className="ml-1 truncate">{SECTION_LABELS[type]}</span>
                </Button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="col-span-2"
                onClick={() => setIsAddingSection(false)}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => setIsAddingSection(true)}
            data-testid="button-add-section"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        )}
      </div>
    </div>
  );
}
