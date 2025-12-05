import { useState, useCallback, useEffect } from 'react';
import { Switch, Route, useLocation } from 'wouter';
import { queryClient, apiRequest } from './lib/queryClient';
import { QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AuthForms } from '@/components/AuthForms';
import { AppSidebar } from '@/components/AppSidebar';
import { ProjectsList } from '@/components/ProjectsList';
import { TemplatesPage } from '@/components/TemplatesPage';
import { AccountPage } from '@/components/AccountPage';
import { EditorLayout } from '@/components/EditorLayout';
import { SettingsPage } from '@/components/SettingsPage';
import { AdminPanel } from '@/components/AdminPanel';
import { LandingPage } from '@/pages/LandingPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { Project, ProjectType, ThemeType } from '@/lib/projectTypes';
import { DEFAULT_SECTION_DATA } from '@/lib/projectTypes';

type PageType = 'projects' | 'templates' | 'account' | 'settings' | 'admin-dashboard' | 'admin-users' | 'admin-projects' | 'editor';

interface ApiProject {
  id: string;
  userId: string;
  name: string;
  type: string;
  theme: string;
  sections: unknown;
  createdAt: string;
  updatedAt: string;
}

function transformProject(apiProject: ApiProject): Project {
  return {
    ...apiProject,
    type: apiProject.type as ProjectType,
    theme: apiProject.theme as ThemeType,
    sections: Array.isArray(apiProject.sections) ? apiProject.sections : [],
    createdAt: apiProject.createdAt,
    updatedAt: apiProject.updatedAt,
  } as Project;
}

function AuthPage() {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/app');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <AuthForms 
      onSuccess={() => {
        setTimeout(() => navigate('/app'), 100);
      }} 
    />
  );
}

function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [currentPage, setCurrentPage] = useState<PageType>('projects');
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>();
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const { data: projectsData = [], isLoading: projectsLoading, refetch: refetchProjects } = useQuery<ApiProject[]>({
    queryKey: ['/api/projects'],
    enabled: isAuthenticated,
  });

  const projects: Project[] = projectsData.map(transformProject);

  const createProjectMutation = useMutation({
    mutationFn: async (data: { name: string; type: ProjectType; theme: ThemeType; sections?: unknown[] }) => {
      const response = await apiRequest('POST', '/api/projects', {
        ...data,
        sections: data.sections || [{ id: `section-${Date.now()}`, type: 'hero', position: 0, data: DEFAULT_SECTION_DATA.hero }],
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create project');
      }
      return response.json();
    },
    onSuccess: (data: ApiProject) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      const project = transformProject(data);
      toast({ title: 'Project created!', description: `"${project.name}" is ready to edit.` });
      setEditingProject(project);
      setCurrentPage('editor');
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string; [key: string]: unknown }) => {
      const response = await apiRequest('PATCH', `/api/projects/${id}`, data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update project');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/projects/${id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete project');
      }
      return id;
    },
    onSuccess: (id: string) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      const project = projects.find(p => p.id === id);
      toast({ title: 'Project deleted', description: `"${project?.name}" has been removed.` });
      if (selectedProjectId === id) {
        setSelectedProjectId(undefined);
      }
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const duplicateProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('POST', `/api/projects/${id}/duplicate`, {});
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to duplicate project');
      }
      return response.json();
    },
    onSuccess: (data: ApiProject) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({ title: 'Project duplicated!', description: `"${data.name}" created.` });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const handleNavigate = useCallback((page: 'projects' | 'templates' | 'account' | 'settings' | 'admin-dashboard' | 'admin-users' | 'admin-projects') => {
    setCurrentPage(page);
    setEditingProject(null);
  }, []);

  const handleCreateProject = useCallback((name: string, type: ProjectType, theme: ThemeType, sections?: unknown[]) => {
    createProjectMutation.mutate({ name, type, theme, sections });
  }, [createProjectMutation]);

  const handleEditProject = useCallback((id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setEditingProject(project);
      setSelectedProjectId(id);
      setCurrentPage('editor');
    }
  }, [projects]);

  const handleDuplicateProject = useCallback((id: string) => {
    duplicateProjectMutation.mutate(id);
  }, [duplicateProjectMutation]);

  const handleDeleteProject = useCallback((id: string) => {
    deleteProjectMutation.mutate(id);
  }, [deleteProjectMutation]);

  const handleSaveProject = useCallback((updatedProject: Project) => {
    updateProjectMutation.mutate({
      id: updatedProject.id,
      name: updatedProject.name,
      type: updatedProject.type,
      theme: updatedProject.theme,
      sections: updatedProject.sections,
    });
    setEditingProject(updatedProject);
  }, [updateProjectMutation]);

  const handleUseTemplate = useCallback((template: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    createProjectMutation.mutate({
      name: template.name,
      type: template.type,
      theme: template.theme,
      sections: template.sections,
    });
  }, [createProjectMutation]);

  const handlePreviewTemplate = useCallback((template: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    toast({ title: 'Preview', description: `Previewing "${template.name}" template.` });
  }, [toast]);

  const handleLogout = useCallback(async () => {
    toast({ title: 'Signed out', description: 'You have been logged out.' });
    await logout();
    setCurrentPage('projects');
    setEditingProject(null);
    window.location.href = '/';
  }, [logout, toast]);

  const handleNewProject = useCallback(() => {
    setCurrentPage('projects');
    setEditingProject(null);
  }, []);

  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    if (!authLoading && !hasCheckedAuth) {
      setHasCheckedAuth(true);
      if (!isAuthenticated) {
        navigate('/auth');
      }
    }
  }, [authLoading, isAuthenticated, hasCheckedAuth, navigate]);

  if (authLoading || (!hasCheckedAuth && !isAuthenticated)) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (currentPage === 'editor' && editingProject) {
    return (
      <EditorLayout
        project={editingProject}
        onBack={() => {
          setCurrentPage('projects');
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
      />
    );
  }

  
  const sidebarStyle = {
    '--sidebar-width': '18rem',
    '--sidebar-width-icon': '3rem',
  } as React.CSSProperties;

  return (
    <SidebarProvider style={sidebarStyle}>
      <div className="flex h-screen w-full">
        <AppSidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={handleEditProject}
          onNewProject={handleNewProject}
          onLogout={handleLogout}
        />
        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center justify-between gap-4 px-4 py-2 border-b shrink-0">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-6">
            {projectsLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {currentPage === 'projects' && (
                  <ProjectsList
                    projects={projects}
                    onCreateProject={handleCreateProject}
                    onEditProject={handleEditProject}
                    onDuplicateProject={handleDuplicateProject}
                    onDeleteProject={handleDeleteProject}
                  />
                )}
                {currentPage === 'templates' && (
                  <TemplatesPage
                    onUseTemplate={handleUseTemplate}
                    onPreviewTemplate={handlePreviewTemplate}
                  />
                )}
                {currentPage === 'account' && (
                  <AccountPage
                    projectCount={projects.length}
                    onLogout={handleLogout}
                  />
                )}
                {currentPage === 'settings' && (
                  <SettingsPage />
                )}
                {currentPage === 'admin-dashboard' && user?.isAdmin && (
                  <AdminPanel view="dashboard" />
                )}
                {currentPage === 'admin-users' && user?.isAdmin && (
                  <AdminPanel view="users" />
                )}
                {currentPage === 'admin-projects' && user?.isAdmin && (
                  <AdminPanel view="projects" />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function LandingPageWrapper() {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/app');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <LandingPage 
      onGetStarted={() => navigate('/auth')} 
      onLogin={() => navigate('/auth')}
    />
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPageWrapper} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/reset-password" component={ResetPasswordPage} />
      <Route path="/app" component={Dashboard} />
      <Route>
        <div className="h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Page not found</p>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
