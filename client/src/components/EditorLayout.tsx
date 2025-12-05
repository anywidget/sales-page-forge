import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SectionEditor } from './SectionEditor';
import { PagePreview } from './PagePreview';
import { ThemeToggle } from './ThemeToggle';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import type { Project, PageSection, ThemeType, SectionType, FreeformElement } from '@/lib/projectTypes';
import { THEME_LABELS, DEFAULT_SECTION_DATA } from '@/lib/projectTypes';
import { useAuth } from '@/contexts/AuthContext';
import { getPlanLimits } from '@/lib/planLimits';
import { useToast } from '@/hooks/use-toast';
import { generateHtml } from '@/lib/exportUtils';

interface EditorLayoutProps {
  project: Project;
  onBack: () => void;
  onSave: (project: Project) => void;
}

export function EditorLayout({ project, onBack, onSave }: EditorLayoutProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentProject, setCurrentProject] = useState<Project>(project);
  const [isSaving, setIsSaving] = useState(false);

  const planLimits = user ? getPlanLimits(user.plan) : getPlanLimits('free');
  const availableThemes = planLimits.themes;
  const availableSectionTypes = [...planLimits.sectionTypes] as SectionType[];

  const handleSectionsChange = useCallback((sections: PageSection[]) => {
    setCurrentProject(prev => ({ ...prev, sections, updatedAt: new Date().toISOString() }));
  }, []);

  const handleFreeformElementsChange = useCallback((freeformElements: FreeformElement[]) => {
    setCurrentProject(prev => ({ ...prev, freeformElements, updatedAt: new Date().toISOString() }));
  }, []);

  const handleAddSection = useCallback((type: SectionType) => {
    setCurrentProject(prev => {
      const newSection: PageSection = {
        id: `section-${Date.now()}`,
        type,
        position: prev.sections.length,
        data: DEFAULT_SECTION_DATA[type] || {},
      };
      return { ...prev, sections: [...prev.sections, newSection], updatedAt: new Date().toISOString() };
    });
  }, []);

  const handleThemeChange = useCallback((theme: ThemeType) => {
    setCurrentProject(prev => ({ ...prev, theme, updatedAt: new Date().toISOString() }));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    // todo: remove mock functionality - implement real save
    await new Promise(resolve => setTimeout(resolve, 500));
    onSave(currentProject);
    toast({ title: 'Saved!', description: 'Your project has been saved.' });
    setIsSaving(false);
  };

  const handlePreview = () => {
    // Generate HTML and open in a new tab
    const html = generateHtml(currentProject.sections, currentProject.theme, currentProject.name, planLimits.hasWatermark);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, '_blank');
    if (newWindow) {
      newWindow.onload = () => URL.revokeObjectURL(url);
    } else {
      toast({ title: 'Popup blocked', description: 'Please allow popups for this site to preview.', variant: 'destructive' });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="flex items-center justify-between gap-4 px-4 py-2 border-b flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="ghost" size="icon" onClick={onBack} data-testid="button-back">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-semibold truncate max-w-[200px]" data-testid="text-project-name">
            {currentProject.name}
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select 
            value={currentProject.theme} 
            onValueChange={(v) => handleThemeChange(v as ThemeType)}
          >
            <SelectTrigger className="w-[160px]" data-testid="select-editor-theme">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(THEME_LABELS) as ThemeType[]).map((theme) => (
                <SelectItem 
                  key={theme} 
                  value={theme}
                  disabled={!availableThemes.includes(theme)}
                >
                  {THEME_LABELS[theme]}
                  {!availableThemes.includes(theme) && ' (Upgrade)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ThemeToggle />
          <Button onClick={handleSave} disabled={isSaving} data-testid="button-save">
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 border-r overflow-hidden">
          <PagePreview
            sections={currentProject.sections}
            theme={currentProject.theme}
            hasWatermark={planLimits.hasWatermark}
            canDownloadHtml={planLimits.canDownloadHtml}
            canExportJson={planLimits.canExportJson}
            onPreview={handlePreview}
            projectName={currentProject.name}
            projectType={currentProject.type}
            onSectionsChange={handleSectionsChange}
            freeformElements={currentProject.freeformElements || []}
            onFreeformElementsChange={handleFreeformElementsChange}
            isEditMode={true}
          />
        </div>
        <div className="w-[360px] border-l overflow-hidden shrink-0">
          <SectionEditor
            sections={currentProject.sections}
            availableSectionTypes={availableSectionTypes}
            onSectionsChange={handleSectionsChange}
            onAddSection={handleAddSection}
          />
        </div>
      </div>
    </div>
  );
}
