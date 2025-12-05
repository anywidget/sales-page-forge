import { PagePreview } from '../PagePreview';
import { ThemeProvider } from '@/contexts/ThemeContext';
import type { PageSection } from '@/lib/projectTypes';
import { DEFAULT_SECTION_DATA } from '@/lib/projectTypes';
import { Toaster } from '@/components/ui/toaster';

// todo: remove mock functionality
const mockSections: PageSection[] = [
  { id: '1', type: 'hero', position: 0, data: DEFAULT_SECTION_DATA.hero },
  { id: '2', type: 'bullets', position: 1, data: DEFAULT_SECTION_DATA.bullets },
  { id: '3', type: 'testimonial', position: 2, data: DEFAULT_SECTION_DATA.testimonial },
  { id: '4', type: 'cta', position: 3, data: DEFAULT_SECTION_DATA.cta },
];

export default function PagePreviewExample() {
  return (
    <ThemeProvider>
      <div className="h-[600px] border rounded-lg overflow-hidden bg-background">
        <PagePreview
          sections={mockSections}
          theme="mmo_dark"
          hasWatermark={false}
          canDownloadHtml={true}
          canExportJson={true}
          onPreview={() => console.log('Preview clicked')}
        />
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
