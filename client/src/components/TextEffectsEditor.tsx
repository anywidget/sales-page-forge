import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, Sparkles } from 'lucide-react';
import { useState } from 'react';

export interface TextEffectsValues {
  textShadow?: string;
  letterSpacing?: string;
  textTransform?: string;
  textDecoration?: string;
  textOutline?: string;
}

interface TextEffectsEditorProps {
  values: TextEffectsValues;
  onChange: (key: keyof TextEffectsValues, value: string) => void;
  compact?: boolean;
}

export const TEXT_SHADOW_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: '1px 1px 2px rgba(0,0,0,0.5)', label: 'Subtle Shadow' },
  { value: '2px 2px 4px rgba(0,0,0,0.8)', label: 'Bold Shadow' },
  { value: '0 0 10px rgba(255,255,255,0.8)', label: 'White Glow' },
  { value: '0 0 10px rgba(255,215,0,0.8)', label: 'Gold Glow' },
  { value: '0 0 20px rgba(0,255,255,1), 0 0 40px rgba(0,255,255,0.5)', label: 'Neon Cyan' },
  { value: '0 0 20px rgba(255,0,255,1), 0 0 40px rgba(255,0,255,0.5)', label: 'Neon Pink' },
  { value: '0 0 20px rgba(255,100,0,1), 0 0 40px rgba(255,50,0,0.5)', label: 'Fire Glow' },
  { value: '0 0 15px rgba(0,128,255,0.8), 0 0 30px rgba(0,128,255,0.4)', label: 'Electric Blue' },
  { value: '0 0 15px rgba(0,255,0,0.8), 0 0 30px rgba(0,255,0,0.4)', label: 'Matrix Green' },
  { value: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000', label: 'Hard Outline' },
  { value: '2px 2px 0 rgba(0,0,0,0.3), 4px 4px 0 rgba(0,0,0,0.2)', label: '3D Effect' },
  { value: '3px 3px 0 #c41e3a, 6px 6px 0 #7a1222', label: '3D Red' },
  { value: '3px 3px 0 #d4af37, 6px 6px 0 #9a7d2a', label: '3D Gold' },
];

export const LETTER_SPACING_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: '-0.5px', label: 'Tight (-0.5px)' },
  { value: '0.5px', label: 'Slightly Wide (+0.5px)' },
  { value: '1px', label: 'Wide (+1px)' },
  { value: '2px', label: 'Very Wide (+2px)' },
  { value: '4px', label: 'Extra Wide (+4px)' },
  { value: '8px', label: 'Spread Out (+8px)' },
];

export const TEXT_TRANSFORM_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'uppercase', label: 'UPPERCASE' },
  { value: 'lowercase', label: 'lowercase' },
  { value: 'capitalize', label: 'Capitalize Each Word' },
];

export const TEXT_DECORATION_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'underline', label: 'Underline' },
  { value: 'line-through', label: 'Strikethrough' },
];

export const TEXT_OUTLINE_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: '1px black', label: 'Thin Black' },
  { value: '2px black', label: 'Medium Black' },
  { value: '1px white', label: 'Thin White' },
  { value: '2px white', label: 'Medium White' },
  { value: '1px gold', label: 'Thin Gold' },
  { value: '2px gold', label: 'Medium Gold' },
  { value: '1px red', label: 'Thin Red' },
  { value: '2px red', label: 'Medium Red' },
];

export function TextEffectsEditor({ values, onChange, compact = false }: TextEffectsEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const hasActiveEffects = 
    (values.textShadow && values.textShadow !== 'none') ||
    (values.letterSpacing && values.letterSpacing !== 'normal') ||
    (values.textTransform && values.textTransform !== 'none') ||
    (values.textDecoration && values.textDecoration !== 'none') ||
    (values.textOutline && values.textOutline !== 'none');

  const content = (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {/* Text Shadow */}
      <div className="space-y-2">
        <Label className={compact ? "text-xs" : "text-sm"}>Text Shadow / Glow</Label>
        <Select
          value={values.textShadow || 'none'}
          onValueChange={(value) => onChange('textShadow', value)}
        >
          <SelectTrigger className={compact ? "h-8 text-xs" : ""} data-testid="select-textshadow">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TEXT_SHADOW_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Letter Spacing */}
      <div className="space-y-2">
        <Label className={compact ? "text-xs" : "text-sm"}>Letter Spacing</Label>
        <Select
          value={values.letterSpacing || 'normal'}
          onValueChange={(value) => onChange('letterSpacing', value)}
        >
          <SelectTrigger className={compact ? "h-8 text-xs" : ""} data-testid="select-letterspacing">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LETTER_SPACING_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Text Transform */}
      <div className="space-y-2">
        <Label className={compact ? "text-xs" : "text-sm"}>Text Transform</Label>
        <Select
          value={values.textTransform || 'none'}
          onValueChange={(value) => onChange('textTransform', value)}
        >
          <SelectTrigger className={compact ? "h-8 text-xs" : ""} data-testid="select-texttransform">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TEXT_TRANSFORM_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Text Decoration */}
      <div className="space-y-2">
        <Label className={compact ? "text-xs" : "text-sm"}>Text Decoration</Label>
        <Select
          value={values.textDecoration || 'none'}
          onValueChange={(value) => onChange('textDecoration', value)}
        >
          <SelectTrigger className={compact ? "h-8 text-xs" : ""} data-testid="select-textdecoration">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TEXT_DECORATION_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Text Outline */}
      <div className="space-y-2">
        <Label className={compact ? "text-xs" : "text-sm"}>Text Outline</Label>
        <Select
          value={values.textOutline || 'none'}
          onValueChange={(value) => onChange('textOutline', value)}
        >
          <SelectTrigger className={compact ? "h-8 text-xs" : ""} data-testid="select-textoutline">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TEXT_OUTLINE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  if (compact) {
    return (
      <div className="pt-3 border-t">
        <h5 className="font-medium text-xs mb-3">Text Effects</h5>
        {content}
      </div>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-lg">
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full justify-between px-4 py-3 h-auto"
          data-testid="button-text-effects-toggle"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">Text Effects</span>
            {hasActiveEffects && (
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4">
        {content}
      </CollapsibleContent>
    </Collapsible>
  );
}

// Helper function to build CSS styles from text effects values
export function buildTextEffectStyles(effects: TextEffectsValues): React.CSSProperties {
  const styles: React.CSSProperties = {};
  
  if (effects.textShadow && effects.textShadow !== 'none') {
    styles.textShadow = effects.textShadow;
  }
  if (effects.letterSpacing && effects.letterSpacing !== 'normal') {
    styles.letterSpacing = effects.letterSpacing;
  }
  if (effects.textTransform && effects.textTransform !== 'none') {
    styles.textTransform = effects.textTransform as 'uppercase' | 'lowercase' | 'capitalize';
  }
  if (effects.textDecoration && effects.textDecoration !== 'none') {
    styles.textDecoration = effects.textDecoration;
  }
  if (effects.textOutline && effects.textOutline !== 'none') {
    (styles as Record<string, string>).WebkitTextStroke = effects.textOutline;
  }
  
  return styles;
}
