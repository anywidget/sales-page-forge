import { AccountPage } from '../AccountPage';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

export default function AccountPageExample() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="p-6">
          <AccountPage
            projectCount={3}
            onLogout={() => console.log('Logout clicked')}
          />
        </div>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
