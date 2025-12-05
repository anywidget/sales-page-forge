import { useState } from 'react';
import { SectionEditor } from '../SectionEditor';
import { ThemeProvider } from '@/contexts/ThemeContext';
import type { PageSection, SectionType } from '@/lib/projectTypes';
import { DEFAULT_SECTION_DATA } from '@/lib/projectTypes';

// todo: remove mock functionality
const initialSections: PageSection[] = [
  { id: '1', type: 'hero', position: 0, data: DEFAULT_SECTION_DATA.hero },
  { id: '2', type: 'bullets', position: 1, data: DEFAULT_SECTION_DATA.bullets },
  { id: '3', type: 'cta', position: 2, data: DEFAULT_SECTION_DATA.cta },
];

const availableTypes: SectionType[] = [
  'hero', 'subheadline', 'video', 'bullets', 'feature_grid', 'bonus_stack',
  'testimonial', 'guarantee', 'faq', 'cta', 'divider',
];

export default function SectionEditorExample() {
  const [sections, setSections] = useState(initialSections);

  const handleAddSection = (type: SectionType) => {
    const newSection: PageSection = {
      id: `section-${Date.now()}`,
      type,
      position: sections.length,
      data: DEFAULT_SECTION_DATA[type] || {},
    };
    setSections([...sections, newSection]);
  };

  return (
    <ThemeProvider>
      <div className="h-[600px] w-[360px] border rounded-lg overflow-hidden bg-background">
        <SectionEditor
          sections={sections}
          availableSectionTypes={availableTypes}
          onSectionsChange={setSections}
          onAddSection={handleAddSection}
        />
      </div>
    </ThemeProvider>
  );
}
