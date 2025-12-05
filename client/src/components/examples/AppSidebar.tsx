import { AppSidebar } from '../AppSidebar';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { Project } from '@/lib/projectTypes';

// todo: remove mock functionality
const mockProjects: Project[] = [
  {
    id: '1',
    userId: '1',
    name: 'Ultimate Product Launch',
    type: 'sales_letter',
    theme: 'mmo_dark',
    sections: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: '1',
    name: 'JV Partner Page',
    type: 'jv_page',
    theme: 'neon_gamer',
    sections: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function AppSidebarExample() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SidebarProvider>
          <div className="flex h-[600px] w-full">
            <AppSidebar
              currentPage="projects"
              onNavigate={(page) => console.log('Navigate to:', page)}
              projects={mockProjects}
              selectedProjectId="1"
              onSelectProject={(id) => console.log('Select project:', id)}
              onNewProject={() => console.log('New project')}
              onLogout={() => console.log('Logout')}
            />
            <div className="flex-1 bg-background p-4">
              <p className="text-muted-foreground">Main content area</p>
            </div>
          </div>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
