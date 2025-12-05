import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check, X, Crown, Zap, Sparkles } from 'lucide-react';
import { useAuth, type PlanType } from '@/contexts/AuthContext';
import { PLAN_FEATURES } from '@/lib/planLimits';
import { useToast } from '@/hooks/use-toast';

export function PlanSelector() {
  const { user, updatePlan } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const currentPlan = user?.plan || 'free';

  const handleUpgrade = (plan: PlanType) => {
    setSelectedPlan(plan);
    setIsDialogOpen(true);
  };

  const confirmUpgrade = async () => {
    if (selectedPlan) {
      try {
        await updatePlan(selectedPlan);
        toast({
          title: 'Plan Updated!',
          description: `You are now on the ${PLAN_FEATURES[selectedPlan].name} plan.`,
        });
        setIsDialogOpen(false);
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to update plan',
          variant: 'destructive',
        });
      }
    }
  };

  const getPlanIcon = (plan: PlanType) => {
    switch (plan) {
      case 'free': return <Zap className="w-6 h-6" />;
      case 'monthly': return <Sparkles className="w-6 h-6" />;
      case 'lifetime': return <Crown className="w-6 h-6" />;
    }
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-3">
        {(Object.keys(PLAN_FEATURES) as PlanType[]).map((plan) => {
          const features = PLAN_FEATURES[plan];
          const isCurrentPlan = plan === currentPlan;

          return (
            <Card 
              key={plan} 
              className={`relative ${isCurrentPlan ? 'ring-2 ring-primary' : ''} ${plan === 'lifetime' ? 'md:scale-105' : ''}`}
            >
              {features.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  {features.badge}
                </Badge>
              )}
              {isCurrentPlan && (
                <Badge variant="secondary" className="absolute -top-3 right-4">
                  Current
                </Badge>
              )}
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-2">
                  {getPlanIcon(plan)}
                </div>
                <CardTitle>{features.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-foreground">{features.price}</span>
                  <span className="text-muted-foreground"> {features.period}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {features.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                  {features.limitations.map((limitation, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <X className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="text-sm">{limitation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={isCurrentPlan ? 'secondary' : plan === 'lifetime' ? 'default' : 'outline'}
                  disabled={isCurrentPlan}
                  onClick={() => handleUpgrade(plan)}
                  data-testid={`button-select-${plan}`}
                >
                  {isCurrentPlan ? 'Current Plan' : plan === 'free' ? 'Downgrade' : 'Upgrade'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Plan Change</DialogTitle>
            <DialogDescription>
              {selectedPlan && (
                <>
                  You are about to switch to the <strong>{PLAN_FEATURES[selectedPlan].name}</strong> plan 
                  ({PLAN_FEATURES[selectedPlan].price} {PLAN_FEATURES[selectedPlan].period}).
                  <br /><br />
                  <span className="text-muted-foreground">
                    This is a demo - no actual payment will be processed.
                  </span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmUpgrade} data-testid="button-confirm-upgrade">
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
