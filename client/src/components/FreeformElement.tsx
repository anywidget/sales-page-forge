import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Move, Settings, Image, Link, Check } from 'lucide-react';
import type { FreeformElement as FreeformElementType } from '@/lib/projectTypes';

interface FreeformElementProps {
  element: FreeformElementType;
  containerRef: React.RefObject<HTMLDivElement>;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<FreeformElementType>) => void;
  onDelete: (id: string) => void;
  isEditMode: boolean;
}

// Helper to parse rgba or hex with opacity
function parseBackgroundColor(bg: string | undefined): { color: string; opacity: number } {
  if (!bg || bg === 'transparent') {
    return { color: '#000000', opacity: 0 };
  }
  
  // Check for rgba format
  const rgbaMatch = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1]);
    const g = parseInt(rgbaMatch[2]);
    const b = parseInt(rgbaMatch[3]);
    const a = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1;
    const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    return { color: hex, opacity: Math.round(a * 100) };
  }
  
  // Assume hex
  return { color: bg, opacity: 100 };
}

function buildBackgroundColor(color: string, opacity: number): string {
  if (opacity === 0) return 'transparent';
  if (opacity === 100) return color;
  
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
}

export function FreeformElement({
  element,
  containerRef,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  isEditMode,
}: FreeformElementProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [editContent, setEditContent] = useState(element.content);
  const [imageUrl, setImageUrl] = useState(element.content || '');
  const elementRef = useRef<HTMLDivElement>(null);

  // Parse current background
  const { color: bgColor, opacity: bgOpacity } = parseBackgroundColor(element.styles?.backgroundColor);

  useEffect(() => {
    setEditContent(element.content);
    setImageUrl(element.content || '');
  }, [element.content]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditMode || isEditing || showImageInput) return;
    
    // Don't start drag if clicking on a control element
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('[data-radix-popover-content]')) {
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    onSelect(element.id);
    setIsDragging(true);
    setDragStart({
      x: e.clientX - (containerRef.current?.getBoundingClientRect().left || 0) - (element.x / 100) * (containerRef.current?.offsetWidth || 0),
      y: e.clientY - (containerRef.current?.getBoundingClientRect().top || 0) - element.y,
    });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRef.current.offsetWidth;
      
      const newX = e.clientX - containerRect.left - dragStart.x;
      const newY = e.clientY - containerRect.top - dragStart.y;
      
      const xPercent = Math.max(0, Math.min(100 - element.width, (newX / containerWidth) * 100));
      const yPx = Math.max(0, newY);
      
      onUpdate(element.id, { x: xPercent, y: yPx });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, containerRef, element.id, element.width, onUpdate]);

  const handleDoubleClick = () => {
    if (!isEditMode) return;
    if (element.type === 'text') {
      setIsEditing(true);
    } else {
      setShowImageInput(true);
    }
    onSelect(element.id);
  };

  const handleTextBlur = () => {
    setIsEditing(false);
    if (editContent !== element.content) {
      onUpdate(element.id, { content: editContent });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditContent(element.content);
    }
  };

  const handleImageUrlSave = () => {
    onUpdate(element.id, { content: imageUrl });
    setShowImageInput(false);
  };

  const updateStyle = (key: string, value: string) => {
    onUpdate(element.id, {
      styles: {
        ...element.styles,
        [key]: value,
      },
    });
  };

  const handleBgColorChange = (newColor: string) => {
    const newBg = buildBackgroundColor(newColor, bgOpacity);
    updateStyle('backgroundColor', newBg);
  };

  const handleBgOpacityChange = (newOpacity: number[]) => {
    const newBg = buildBackgroundColor(bgColor, newOpacity[0]);
    updateStyle('backgroundColor', newBg);
  };

  const defaultStyles = {
    fontSize: element.styles?.fontSize || '16px',
    fontWeight: element.styles?.fontWeight || 'normal',
    color: element.styles?.color || '#ffffff',
    textAlign: element.styles?.textAlign || 'left',
    backgroundColor: element.styles?.backgroundColor || 'transparent',
    padding: element.styles?.padding || '12px',
    borderRadius: element.styles?.borderRadius || '4px',
    // Text effects
    textShadow: element.styles?.textShadow !== 'none' ? element.styles?.textShadow : undefined,
    letterSpacing: element.styles?.letterSpacing !== 'normal' ? element.styles?.letterSpacing : undefined,
    textTransform: element.styles?.textTransform !== 'none' ? element.styles?.textTransform : undefined,
    textDecoration: element.styles?.textDecoration !== 'none' ? element.styles?.textDecoration : undefined,
    WebkitTextStroke: element.styles?.textOutline !== 'none' ? element.styles?.textOutline : undefined,
  };

  return (
    <div
      ref={elementRef}
      className={`absolute transition-shadow ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${
        isSelected && isEditMode ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
      style={{
        left: `${element.x}%`,
        top: `${element.y}px`,
        width: `${element.width}%`,
        minHeight: element.type === 'text' ? 'auto' : `${element.height}px`,
        zIndex: element.zIndex + 100,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onClick={(e) => {
        e.stopPropagation();
        if (isEditMode) onSelect(element.id);
      }}
      data-testid={`freeform-element-${element.id}`}
    >
      {/* Toolbar when selected */}
      {isEditMode && isSelected && (
        <div className="absolute -top-10 left-0 right-0 flex items-center justify-between gap-1 bg-gray-900 rounded-t px-2 py-1.5 z-10">
          <div className="flex items-center gap-1">
            <Move className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-white font-medium">
              {element.type === 'text' ? 'Text Box' : 'Image'}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            {/* Settings Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-white hover:bg-gray-700"
                  onClick={(e) => e.stopPropagation()}
                  data-testid={`button-settings-freeform-${element.id}`}
                >
                  <Settings className="w-3 h-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-72 p-4" 
                side="bottom" 
                align="end"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Element Settings</h4>
                  
                  {/* Background Color */}
                  <div className="space-y-2">
                    <Label className="text-xs">Background Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => handleBgColorChange(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border border-border"
                        data-testid={`input-bgcolor-${element.id}`}
                      />
                      <Input
                        value={bgColor}
                        onChange={(e) => handleBgColorChange(e.target.value)}
                        className="flex-1 h-8 text-xs"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                  
                  {/* Background Opacity */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Background Opacity</Label>
                      <span className="text-xs text-muted-foreground">{bgOpacity}%</span>
                    </div>
                    <Slider
                      value={[bgOpacity]}
                      onValueChange={handleBgOpacityChange}
                      min={0}
                      max={100}
                      step={5}
                      className="w-full"
                      data-testid={`slider-opacity-${element.id}`}
                    />
                    <p className="text-xs text-muted-foreground">
                      Set to 0% for fully transparent background
                    </p>
                  </div>
                  
                  {element.type === 'text' && (
                    <>
                      {/* Text Color */}
                      <div className="space-y-2">
                        <Label className="text-xs">Text Color</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={element.styles?.color || '#ffffff'}
                            onChange={(e) => updateStyle('color', e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border border-border"
                            data-testid={`input-textcolor-${element.id}`}
                          />
                          <Input
                            value={element.styles?.color || '#ffffff'}
                            onChange={(e) => updateStyle('color', e.target.value)}
                            className="flex-1 h-8 text-xs"
                            placeholder="#ffffff"
                          />
                        </div>
                      </div>
                      
                      {/* Font Size */}
                      <div className="space-y-2">
                        <Label className="text-xs">Font Size</Label>
                        <Select
                          value={element.styles?.fontSize || '16px'}
                          onValueChange={(value) => updateStyle('fontSize', value)}
                        >
                          <SelectTrigger className="h-8 text-xs" data-testid={`select-fontsize-${element.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12px">Small (12px)</SelectItem>
                            <SelectItem value="14px">Normal (14px)</SelectItem>
                            <SelectItem value="16px">Medium (16px)</SelectItem>
                            <SelectItem value="18px">Large (18px)</SelectItem>
                            <SelectItem value="24px">X-Large (24px)</SelectItem>
                            <SelectItem value="32px">Heading (32px)</SelectItem>
                            <SelectItem value="48px">Display (48px)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Font Weight */}
                      <div className="space-y-2">
                        <Label className="text-xs">Font Weight</Label>
                        <Select
                          value={element.styles?.fontWeight || 'normal'}
                          onValueChange={(value) => updateStyle('fontWeight', value)}
                        >
                          <SelectTrigger className="h-8 text-xs" data-testid={`select-fontweight-${element.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="semibold">Semi-Bold</SelectItem>
                            <SelectItem value="bold">Bold</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Text Align */}
                      <div className="space-y-2">
                        <Label className="text-xs">Text Alignment</Label>
                        <Select
                          value={element.styles?.textAlign || 'left'}
                          onValueChange={(value) => updateStyle('textAlign', value)}
                        >
                          <SelectTrigger className="h-8 text-xs" data-testid={`select-textalign-${element.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Text Effects Section */}
                      <div className="pt-3 border-t">
                        <h5 className="font-medium text-xs mb-3">Text Effects</h5>
                        
                        {/* Text Shadow Preset */}
                        <div className="space-y-2 mb-3">
                          <Label className="text-xs">Text Shadow</Label>
                          <Select
                            value={element.styles?.textShadow || 'none'}
                            onValueChange={(value) => updateStyle('textShadow', value)}
                          >
                            <SelectTrigger className="h-8 text-xs" data-testid={`select-textshadow-${element.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="1px 1px 2px rgba(0,0,0,0.5)">Subtle Shadow</SelectItem>
                              <SelectItem value="2px 2px 4px rgba(0,0,0,0.8)">Bold Shadow</SelectItem>
                              <SelectItem value="0 0 10px rgba(255,255,255,0.8)">White Glow</SelectItem>
                              <SelectItem value="0 0 10px rgba(255,215,0,0.8)">Gold Glow</SelectItem>
                              <SelectItem value="0 0 20px rgba(0,255,255,1), 0 0 40px rgba(0,255,255,0.5)">Neon Cyan</SelectItem>
                              <SelectItem value="0 0 20px rgba(255,0,255,1), 0 0 40px rgba(255,0,255,0.5)">Neon Pink</SelectItem>
                              <SelectItem value="0 0 20px rgba(255,100,0,1), 0 0 40px rgba(255,50,0,0.5)">Fire Glow</SelectItem>
                              <SelectItem value="1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000">Hard Outline</SelectItem>
                              <SelectItem value="2px 2px 0 rgba(0,0,0,0.3), 4px 4px 0 rgba(0,0,0,0.2)">3D Effect</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Letter Spacing */}
                        <div className="space-y-2 mb-3">
                          <Label className="text-xs">Letter Spacing</Label>
                          <Select
                            value={element.styles?.letterSpacing || 'normal'}
                            onValueChange={(value) => updateStyle('letterSpacing', value)}
                          >
                            <SelectTrigger className="h-8 text-xs" data-testid={`select-letterspacing-${element.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="-0.5px">Tight (-0.5px)</SelectItem>
                              <SelectItem value="0.5px">Slightly Wide (+0.5px)</SelectItem>
                              <SelectItem value="1px">Wide (+1px)</SelectItem>
                              <SelectItem value="2px">Very Wide (+2px)</SelectItem>
                              <SelectItem value="4px">Extra Wide (+4px)</SelectItem>
                              <SelectItem value="8px">Spread Out (+8px)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Text Transform */}
                        <div className="space-y-2 mb-3">
                          <Label className="text-xs">Text Transform</Label>
                          <Select
                            value={element.styles?.textTransform || 'none'}
                            onValueChange={(value) => updateStyle('textTransform', value)}
                          >
                            <SelectTrigger className="h-8 text-xs" data-testid={`select-texttransform-${element.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="uppercase">UPPERCASE</SelectItem>
                              <SelectItem value="lowercase">lowercase</SelectItem>
                              <SelectItem value="capitalize">Capitalize Each Word</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Text Decoration */}
                        <div className="space-y-2 mb-3">
                          <Label className="text-xs">Text Decoration</Label>
                          <Select
                            value={element.styles?.textDecoration || 'none'}
                            onValueChange={(value) => updateStyle('textDecoration', value)}
                          >
                            <SelectTrigger className="h-8 text-xs" data-testid={`select-textdecoration-${element.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="underline">Underline</SelectItem>
                              <SelectItem value="line-through">Strikethrough</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Text Outline */}
                        <div className="space-y-2">
                          <Label className="text-xs">Text Outline</Label>
                          <Select
                            value={element.styles?.textOutline || 'none'}
                            onValueChange={(value) => updateStyle('textOutline', value)}
                          >
                            <SelectTrigger className="h-8 text-xs" data-testid={`select-textoutline-${element.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="1px black">Thin Black</SelectItem>
                              <SelectItem value="2px black">Medium Black</SelectItem>
                              <SelectItem value="1px white">Thin White</SelectItem>
                              <SelectItem value="2px white">Medium White</SelectItem>
                              <SelectItem value="1px gold">Thin Gold</SelectItem>
                              <SelectItem value="2px gold">Medium Gold</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {element.type === 'image' && (
                    <div className="space-y-2">
                      <Label className="text-xs">Image URL</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="flex-1 h-8 text-xs"
                          data-testid={`input-imageurl-${element.id}`}
                        />
                        <Button
                          size="icon"
                          variant="default"
                          className="h-8 w-8"
                          onClick={handleImageUrlSave}
                          data-testid={`button-saveimage-${element.id}`}
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Image URL button for quick access */}
            {element.type === 'image' && (
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-white hover:bg-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowImageInput(true);
                }}
                data-testid={`button-setimage-${element.id}`}
              >
                <Link className="w-3 h-3" />
              </Button>
            )}
            
            {/* Delete button */}
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-red-400 hover:bg-red-500/20 hover:text-red-300"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(element.id);
              }}
              data-testid={`button-delete-freeform-${element.id}`}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Image URL Input Overlay */}
      {showImageInput && element.type === 'image' && (
        <div 
          className="absolute inset-0 bg-black/90 rounded flex flex-col items-center justify-center p-4 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <Label className="text-white text-sm mb-2">Enter Image URL</Label>
          <div className="flex items-center gap-2 w-full">
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 bg-gray-800 border-gray-700 text-white"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleImageUrlSave();
                if (e.key === 'Escape') setShowImageInput(false);
              }}
              data-testid={`input-imageurl-overlay-${element.id}`}
            />
            <Button
              size="icon"
              variant="default"
              onClick={handleImageUrlSave}
              data-testid={`button-saveimage-overlay-${element.id}`}
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowImageInput(false)}
              className="text-gray-400"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-gray-400 text-xs mt-2">Press Enter to save, Escape to cancel</p>
        </div>
      )}

      {/* Content */}
      {element.type === 'text' ? (
        isEditing ? (
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onBlur={handleTextBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-full min-h-[80px] resize-none border-2 border-blue-500"
            style={{
              fontSize: defaultStyles.fontSize,
              fontWeight: defaultStyles.fontWeight,
              color: defaultStyles.color,
              textAlign: defaultStyles.textAlign as 'left' | 'center' | 'right',
              backgroundColor: defaultStyles.backgroundColor === 'transparent' 
                ? 'rgba(0,0,0,0.9)' 
                : defaultStyles.backgroundColor,
              padding: defaultStyles.padding,
              borderRadius: defaultStyles.borderRadius,
            }}
            data-testid={`textarea-freeform-${element.id}`}
          />
        ) : (
          <div
            className="whitespace-pre-wrap min-h-[40px]"
            style={defaultStyles as React.CSSProperties}
          >
            {element.content || 'Double-click to edit text...'}
          </div>
        )
      ) : (
        <div
          className="relative overflow-hidden"
          style={{
            borderRadius: defaultStyles.borderRadius,
            height: `${element.height}px`,
            backgroundColor: defaultStyles.backgroundColor,
          }}
        >
          {element.content ? (
            <img
              src={element.content}
              alt="Freeform image"
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <div 
              className="w-full h-full flex flex-col items-center justify-center text-gray-400 cursor-pointer"
              style={{ backgroundColor: defaultStyles.backgroundColor === 'transparent' ? 'rgba(0,0,0,0.5)' : defaultStyles.backgroundColor }}
            >
              <Image className="w-10 h-10 mb-2" />
              <span className="text-sm">Double-click to add image</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface FreeformElementsLayerProps {
  elements: FreeformElementType[];
  containerRef: React.RefObject<HTMLDivElement>;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, updates: Partial<FreeformElementType>) => void;
  onDelete: (id: string) => void;
  isEditMode: boolean;
}

export function FreeformElementsLayer({
  elements,
  containerRef,
  selectedId,
  onSelect,
  onUpdate,
  onDelete,
  isEditMode,
}: FreeformElementsLayerProps) {
  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 50 }}
    >
      {elements.map((element) => (
        <div key={element.id} className="pointer-events-auto">
          <FreeformElement
            element={element}
            containerRef={containerRef}
            isSelected={selectedId === element.id}
            onSelect={onSelect}
            onUpdate={onUpdate}
            onDelete={onDelete}
            isEditMode={isEditMode}
          />
        </div>
      ))}
    </div>
  );
}
