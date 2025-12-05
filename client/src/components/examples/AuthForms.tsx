import { AuthForms } from '../AuthForms';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';

export default function AuthFormsExample() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthForms onSuccess={() => console.log('Auth success!')} />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
