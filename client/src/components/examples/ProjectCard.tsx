import { ProjectCard } from '../ProjectCard';
import { ThemeProvider } from '@/contexts/ThemeContext';
import type { Project } from '@/lib/projectTypes';

const mockProject: Project = {
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
};

export default function ProjectCardExample() {
  return (
    <ThemeProvider>
      <div className="max-w-sm">
        <ProjectCard
          project={mockProject}
          canDuplicate={true}
          onEdit={(id) => console.log('Edit:', id)}
          onDuplicate={(id) => console.log('Duplicate:', id)}
          onDelete={(id) => console.log('Delete:', id)}
        />
      </div>
    </ThemeProvider>
  );
}
