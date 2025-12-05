import { EditorLayout } from '../EditorLayout';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import type { Project } from '@/lib/projectTypes';
import { DEFAULT_SECTION_DATA } from '@/lib/projectTypes';
import { Toaster } from '@/components/ui/toaster';

// todo: remove mock functionality
const mockProject: Project = {
  id: '1',
  userId: '1',
  name: 'Ultimate Product Launch',
  type: 'sales_letter',
  theme: 'mmo_dark',
  sections: [
    { id: '1', type: 'hero', position: 0, data: DEFAULT_SECTION_DATA.hero },
    { id: '2', type: 'bullets', position: 1, data: DEFAULT_SECTION_DATA.bullets },
    { id: '3', type: 'testimonial', position: 2, data: DEFAULT_SECTION_DATA.testimonial },
    { id: '4', type: 'cta', position: 3, data: DEFAULT_SECTION_DATA.cta },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function EditorLayoutExample() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EditorLayout
          project={mockProject}
          onBack={() => console.log('Back clicked')}
          onSave={(project) => console.log('Save project:', project)}
        />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
