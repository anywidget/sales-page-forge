import { ProjectsList } from '../ProjectsList';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import type { Project } from '@/lib/projectTypes';
import { Toaster } from '@/components/ui/toaster';

// todo: remove mock functionality
const mockProjects: Project[] = [
  {
    id: '1',
    userId: '1',
    name: 'Ultimate Product Launch',
    type: 'sales_letter',
    theme: 'mmo_dark',
    sections: [
      { id: '1', type: 'hero', position: 0, data: {} },
      { id: '2', type: 'bullets', position: 1, data: {} },
      { id: '3', type: 'cta', position: 2, data: {} },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: '1',
    name: 'JV Partner Page',
    type: 'jv_page',
    theme: 'neon_gamer',
    sections: [
      { id: '1', type: 'hero', position: 0, data: {} },
      { id: '2', type: 'jv_commissions', position: 1, data: {} },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export default function ProjectsListExample() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="p-6">
          <ProjectsList
            projects={mockProjects}
            onCreateProject={(name, type, theme) => console.log('Create:', { name, type, theme })}
            onEditProject={(id) => console.log('Edit:', id)}
            onDuplicateProject={(id) => console.log('Duplicate:', id)}
            onDeleteProject={(id) => console.log('Delete:', id)}
          />
        </div>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
