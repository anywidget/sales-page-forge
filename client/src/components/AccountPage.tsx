import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PlanSelector } from './PlanSelector';
import { useAuth } from '@/contexts/AuthContext';
import { getPlanLimits, PLAN_FEATURES } from '@/lib/planLimits';
import { User, Mail, Crown, LogOut } from 'lucide-react';

interface AccountPageProps {
  projectCount: number;
  onLogout: () => void;
}

export function AccountPage({ projectCount, onLogout }: AccountPageProps) {
  const { user } = useAuth();

  if (!user) return null;

  const planLimits = getPlanLimits(user.plan);
  const planInfo = PLAN_FEATURES[user.plan];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-account-title">Account Settings</h1>
        <p className="text-muted-foreground">Manage your account and subscription</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-semibold text-primary">
                  {user.email[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate" data-testid="text-user-email">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={user.plan === 'lifetime' ? 'default' : 'secondary'}>
                    {user.plan === 'lifetime' && <Crown className="w-3 h-3 mr-1" />}
                    {planInfo.name}
                  </Badge>
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={onLogout} data-testid="button-logout">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
            <CardDescription>Your current plan usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Projects</span>
                <span className="text-sm text-muted-foreground">
                  {projectCount} / {planLimits.maxProjects === 100 ? 'Unlimited' : planLimits.maxProjects}
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${Math.min((projectCount / planLimits.maxProjects) * 100, 100)}%` }}
                />
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium">Plan Features:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Themes: {planLimits.themes.length}</li>
                <li>Section types: {planLimits.sectionTypes.length}</li>
                <li>HTML Download: {planLimits.canDownloadHtml ? 'Yes' : 'No'}</li>
                <li>JSON Export: {planLimits.canExportJson ? 'Yes' : 'No'}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Subscription Plans</h2>
        <PlanSelector />
      </div>
    </div>
  );
}
