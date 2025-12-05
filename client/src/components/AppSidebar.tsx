import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader,
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  FolderOpen, 
  LayoutTemplate, 
  User, 
  Settings,
  Zap,
  Crown,
  FileText,
  Users,
  Plus,
  LogOut,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PLAN_FEATURES } from '@/lib/planLimits';
import type { Project } from '@/lib/projectTypes';

interface AppSidebarProps {
  currentPage: 'projects' | 'templates' | 'account' | 'settings' | 'admin-dashboard' | 'admin-users' | 'admin-projects' | 'editor';
  onNavigate: (page: 'projects' | 'templates' | 'account' | 'settings' | 'admin-dashboard' | 'admin-users' | 'admin-projects') => void;
  projects: Project[];
  selectedProjectId?: string;
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
  onLogout: () => void;
}

export function AppSidebar({
  currentPage,
  onNavigate,
  projects,
  selectedProjectId,
  onSelectProject,
  onNewProject,
  onLogout,
}: AppSidebarProps) {
  const { user } = useAuth();
  const planInfo = user ? PLAN_FEATURES[user.plan] : PLAN_FEATURES.free;

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-sm truncate">Sales Page Forge</h1>
            <p className="text-xs text-muted-foreground truncate">Sales Page Builder</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => onNavigate('projects')}
                  isActive={currentPage === 'projects'}
                  data-testid="nav-projects"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Projects</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => onNavigate('templates')}
                  isActive={currentPage === 'templates'}
                  data-testid="nav-templates"
                >
                  <LayoutTemplate className="w-4 h-4" />
                  <span>Templates</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => onNavigate('account')}
                  isActive={currentPage === 'account'}
                  data-testid="nav-account"
                >
                  <User className="w-4 h-4" />
                  <span>Account</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => onNavigate('settings')}
                  isActive={currentPage === 'settings'}
                  data-testid="nav-settings"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        <SidebarGroup>
          <div className="flex items-center justify-between px-2 mb-2">
            <SidebarGroupLabel className="mb-0">My Projects</SidebarGroupLabel>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={onNewProject}
              data-testid="button-sidebar-new-project"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <SidebarGroupContent>
            <ScrollArea className="h-[200px]">
              <SidebarMenu>
                {projects.length === 0 ? (
                  <div className="px-2 py-4 text-center">
                    <p className="text-xs text-muted-foreground">No projects yet</p>
                  </div>
                ) : (
                  projects.map((project) => (
                    <SidebarMenuItem key={project.id}>
                      <SidebarMenuButton
                        onClick={() => onSelectProject(project.id)}
                        isActive={selectedProjectId === project.id}
                        data-testid={`nav-project-${project.id}`}
                      >
                        {project.type === 'jv_page' ? (
                          <Users className="w-4 h-4 shrink-0" />
                        ) : (
                          <FileText className="w-4 h-4 shrink-0" />
                        )}
                        <span className="truncate">{project.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {user?.isAdmin && (
          <div className="mb-3 space-y-1">
            <p className="text-xs font-medium text-muted-foreground px-2 mb-2">Admin</p>
            <Button 
              variant={currentPage === 'admin-dashboard' ? 'secondary' : 'ghost'}
              size="sm" 
              className="w-full justify-start"
              onClick={() => onNavigate('admin-dashboard')}
              data-testid="nav-admin-dashboard"
            >
              <Shield className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button 
              variant={currentPage === 'admin-users' ? 'secondary' : 'ghost'}
              size="sm" 
              className="w-full justify-start"
              onClick={() => onNavigate('admin-users')}
              data-testid="nav-admin-users"
            >
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </Button>
            <Button 
              variant={currentPage === 'admin-projects' ? 'secondary' : 'ghost'}
              size="sm" 
              className="w-full justify-start"
              onClick={() => onNavigate('admin-projects')}
              data-testid="nav-admin-projects"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Manage Projects
            </Button>
          </div>
        )}
        <div className="bg-sidebar-accent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            {user?.plan === 'lifetime' && <Crown className="w-4 h-4 text-primary" />}
            <span className="text-sm font-medium">{planInfo.name}</span>
            {planInfo.badge && (
              <Badge variant="default" className="text-xs">{planInfo.badge}</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </p>
          {user?.plan === 'free' && (
            <Button 
              size="sm" 
              className="w-full mb-2"
              onClick={() => onNavigate('account')}
              data-testid="button-upgrade-sidebar"
            >
              Upgrade Plan
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full"
            onClick={onLogout}
            data-testid="button-logout-sidebar"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
