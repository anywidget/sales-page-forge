import { TemplatesPage } from '../TemplatesPage';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function TemplatesPageExample() {
  return (
    <ThemeProvider>
      <div className="p-6">
        <TemplatesPage
          onUseTemplate={(template) => console.log('Use template:', template)}
          onPreviewTemplate={(template) => console.log('Preview template:', template)}
        />
      </div>
    </ThemeProvider>
  );
}
