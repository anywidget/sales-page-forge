import { PlanSelector } from '../PlanSelector';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

export default function PlanSelectorExample() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="p-6">
          <PlanSelector />
        </div>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
