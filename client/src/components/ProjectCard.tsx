import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Edit, Copy, Trash2, MoreVertical, FileText, Users } from 'lucide-react';
import type { Project } from '@/lib/projectTypes';
import { THEME_LABELS } from '@/lib/projectTypes';

interface ProjectCardProps {
  project: Project;
  canDuplicate: boolean;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, canDuplicate, onEdit, onDuplicate, onDelete }: ProjectCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isJvPage = project.type === 'jv_page';

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(project.id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <Card className="group hover-elevate">
        <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-semibold truncate" data-testid={`text-project-name-${project.id}`}>
              {project.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                {isJvPage ? <Users className="w-3 h-3 mr-1" /> : <FileText className="w-3 h-3 mr-1" />}
                {isJvPage ? 'JV Page' : 'Sales Letter'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {THEME_LABELS[project.theme]}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0" data-testid={`button-project-menu-${project.id}`}>
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(project.id)} data-testid={`menu-edit-${project.id}`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              {canDuplicate && (
                <DropdownMenuItem onClick={() => onDuplicate(project.id)} data-testid={`menu-duplicate-${project.id}`}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={handleDeleteClick} 
                className="text-destructive"
                data-testid={`menu-delete-${project.id}`}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground">
            {project.sections.length} section{project.sections.length !== 1 ? 's' : ''}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-2 pt-2">
          <span className="text-xs text-muted-foreground">
            Updated {new Date(project.updatedAt).toLocaleDateString()}
          </span>
          <Button size="sm" onClick={() => onEdit(project.id)} data-testid={`button-edit-project-${project.id}`}>
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{project.name}"? This action cannot be undone and all sections will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid={`button-cancel-delete-${project.id}`}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid={`button-confirm-delete-${project.id}`}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
